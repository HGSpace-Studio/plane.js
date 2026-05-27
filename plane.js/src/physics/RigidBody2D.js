class Physics2DManager {
    static _instance = null;

    constructor() {
        this._bodies = [];
        this._areas = [];
        this._collision_shapes = [];
        this._gravity = new Vector2(0, 980);
        this._max_bodies = 1000;
        this._collision_layer_count = 32;
    }

    static get_singleton() {
        if (!Physics2DManager._instance) {
            Physics2DManager._instance = new Physics2DManager();
        }
        return Physics2DManager._instance;
    }

    get gravity() { return this._gravity.clone(); }
    set gravity(value) { this._gravity = value.clone(); }

    add_body(body) {
        if (this._bodies.length < this._max_bodies) {
            this._bodies.push(body);
        }
    }

    remove_body(body) {
        const index = this._bodies.indexOf(body);
        if (index !== -1) {
            this._bodies.splice(index, 1);
        }
    }

    add_area(area) {
        this._areas.push(area);
    }

    remove_area(area) {
        const index = this._areas.indexOf(area);
        if (index !== -1) {
            this._areas.splice(index, 1);
        }
    }

    add_collision_shape(shape) {
        this._collision_shapes.push(shape);
    }

    remove_collision_shape(shape) {
        const index = this._collision_shapes.indexOf(shape);
        if (index !== -1) {
            this._collision_shapes.splice(index, 1);
        }
    }

    _process(dt) {
        for (const body of this._bodies) {
            if (body._active) {
                body._physics_process(dt);
            }
        }

        this._check_collisions();
    }

    _check_collisions() {
        for (let i = 0; i < this._bodies.length; i++) {
            for (let j = i + 1; j < this._bodies.length; j++) {
                const body1 = this._bodies[i];
                const body2 = this._bodies[j];

                if (!body1._active || !body2._active) continue;
                if (!this._layers_collide(body1._collision_layer, body2._collision_mask)) continue;
                if (!this._layers_collide(body2._collision_layer, body1._collision_mask)) continue;

                const collision = this._test_collision(body1, body2);
                if (collision) {
                    body1._on_collision(body2, collision);
                    body2._on_collision(body1, collision);
                }
            }
        }

        for (const body of this._bodies) {
            if (!body._active) continue;
            for (const area of this._areas) {
                if (!area.monitoring) continue;
                if (!this._layers_collide(body._collision_layer, area._collision_mask)) continue;

                const collision = this._test_collision(body, area);
                if (collision) {
                    area._on_body_entered(body);
                }
            }
        }
    }

    _layers_collide(layer1, mask2) {
        return (layer1 & mask2) !== 0;
    }

    _test_collision(body1, body2) {
        const shapes1 = body1._get_collision_shapes();
        const shapes2 = body2._get_collision_shapes();

        for (const shape1 of shapes1) {
            for (const shape2 of shapes2) {
                const result = this._test_shape_collision(shape1, shape2);
                if (result) {
                    return result;
                }
            }
        }

        return null;
    }

    _test_shape_collision(shape1, shape2) {
        const pos1 = shape1.get_global_position();
        const pos2 = shape2.get_global_position();

        if (shape1._shape instanceof CircleShape2D) {
            if (shape2._shape instanceof CircleShape2D) {
                const distance = pos1.distance_to(pos2);
                const radius_sum = shape1._shape.radius + shape2._shape.radius;
                if (distance < radius_sum) {
                    return {
                        position: pos1,
                        normal: pos2.subtract(pos1).normalized(),
                        depth: radius_sum - distance
                    };
                }
            } else if (shape2._shape instanceof RectangleShape2D) {
                const rect = shape2._shape.rect;
                const halfSize = rect.size.divide(2);
                const closest = new Vector2(
                    Math.max(pos2.x - halfSize.x, Math.min(pos1.x, pos2.x + halfSize.x)),
                    Math.max(pos2.y - halfSize.y, Math.min(pos1.y, pos2.y + halfSize.y))
                );
                const distance = pos1.distance_to(closest);
                if (distance < shape1._shape.radius) {
                    return {
                        position: closest,
                        normal: pos1.subtract(closest).normalized(),
                        depth: shape1._shape.radius - distance
                    };
                }
            }
        }

        if (shape1._shape instanceof RectangleShape2D) {
            if (shape2._shape instanceof RectangleShape2D) {
                const rect1 = shape1._shape.rect;
                const rect2 = shape2._shape.rect;
                const rect1Global = new Rect2(pos1.subtract(rect1.size.divide(2)), rect1.size);
                const rect2Global = new Rect2(pos2.subtract(rect2.size.divide(2)), rect2.size);
                if (rect1Global.intersects(rect2Global)) {
                    return {
                        position: rect1Global.center,
                        normal: new Vector2(0, -1),
                        depth: 1
                    };
                }
            }
        }

        return null;
    }
}

class CollisionObject2D extends Node2D {
    constructor() {
        super();
        this._collision_layer = 1;
        this._collision_mask = 1;
        this._collision_shapes = [];
    }

    get collision_layer() { return this._collision_layer; }
    get collision_mask() { return this._collision_mask; }

    set collision_layer(value) { this._collision_layer = value; }
    set collision_mask(value) { this._collision_mask = value; }

    _get_collision_shapes() {
        return this._collision_shapes;
    }

    _add_collision_shape(shape) {
        this._collision_shapes.push(shape);
    }

    _remove_collision_shape(shape) {
        const index = this._collision_shapes.indexOf(shape);
        if (index !== -1) {
            this._collision_shapes.splice(index, 1);
        }
    }
}

class Area2D extends CollisionObject2D {
    constructor() {
        super();
        this.name = "Area2D";
        this._monitoring = true;
        this._monitorable = true;
        this._priority = 0;
        this._body_entered = new Signal();
        this._body_exited = new Signal();
        this._area_entered = new Signal();
        this._area_exited = new Signal();
        this._overlapping_bodies = [];
        this._overlapping_areas = [];
    }

    get monitoring() { return this._monitoring; }
    get monitorable() { return this._monitorable; }
    get priority() { return this._priority; }

    set monitoring(value) { this._monitoring = value; }
    set monitorable(value) { this._monitorable = value; }
    set priority(value) { this._priority = value; }

    _ready() {
        super._ready();
        Physics2DManager.get_singleton().add_area(this);
    }

    _exit_tree() {
        Physics2DManager.get_singleton().remove_area(this);
        super._exit_tree();
    }

    _on_body_entered(body) {
        if (!this._overlapping_bodies.includes(body)) {
            this._overlapping_bodies.push(body);
            this._body_entered.emit(body);
        }
    }

    _on_body_exited(body) {
        const index = this._overlapping_bodies.indexOf(body);
        if (index !== -1) {
            this._overlapping_bodies.splice(index, 1);
            this._body_exited.emit(body);
        }
    }

    get_overlapping_bodies() {
        return [...this._overlapping_bodies];
    }

    get_overlapping_areas() {
        return [...this._overlapping_areas];
    }
}

class RigidBody2D extends CollisionObject2D {
    constructor() {
        super();
        this.name = "RigidBody2D";
        this._mass = 1;
        this._friction = 0.1;
        this._bounce = 0;
        this._gravity_scale = 1;
        this._linear_velocity = new Vector2(0, 0);
        this._angular_velocity = 0;
        this._freeze_rotation = false;
        this._is_kinematic = false;
        this._sleeping = false;
        this._sleep_threshold = 0.1;
        this._active = true;
        this._collision = new Signal();
        this._collision_signal = new Signal();
    }

    get mass() { return this._mass; }
    get friction() { return this._friction; }
    get bounce() { return this._bounce; }
    get gravity_scale() { return this._gravity_scale; }
    get linear_velocity() { return this._linear_velocity.clone(); }
    get angular_velocity() { return this._angular_velocity; }
    get freeze_rotation() { return this._freeze_rotation; }
    get is_kinematic() { return this._is_kinematic; }
    get sleeping() { return this._sleeping; }
    get active() { return this._active; }

    set mass(value) { this._mass = value; }
    set friction(value) { this._friction = value; }
    set bounce(value) { this._bounce = value; }
    set gravity_scale(value) { this._gravity_scale = value; }
    set linear_velocity(value) { this._linear_velocity = value.clone(); }
    set angular_velocity(value) { this._angular_velocity = value; }
    set freeze_rotation(value) { this._freeze_rotation = value; }
    set is_kinematic(value) { this._is_kinematic = value; }
    set sleeping(value) { this._sleeping = value; }
    set active(value) { this._active = value; }

    _ready() {
        super._ready();
        Physics2DManager.get_singleton().add_body(this);
    }

    _exit_tree() {
        Physics2DManager.get_singleton().remove_body(this);
        super._exit_tree();
    }

    _physics_process(dt) {
        if (!this._active || this._is_kinematic || this._sleeping) return;

        const gravity = Physics2DManager.get_singleton().gravity;
        this._linear_velocity = this._linear_velocity.add(gravity.multiply(this._gravity_scale * dt));

        this._linear_velocity = this._linear_velocity.multiply(1 - this._friction * dt);

        this.position = this.position.add(this._linear_velocity.multiply(dt));

        if (!this._freeze_rotation) {
            this.rotation += this._angular_velocity * dt;
        }

        if (this._linear_velocity.length() < this._sleep_threshold) {
            this._sleeping = true;
        } else {
            this._sleeping = false;
        }
    }

    _on_collision(other, collision) {
        if (collision && collision.normal) {
            const velocity_along_normal = this._linear_velocity.dot(collision.normal);

            if (velocity_along_normal < 0) {
                this._linear_velocity = this._linear_velocity.subtract(collision.normal.multiply(velocity_along_normal * (1 + this._bounce)));
            }

            const tangent = new Vector2(-collision.normal.y, collision.normal.x);
            const velocity_along_tangent = this._linear_velocity.dot(tangent);
            this._linear_velocity = this._linear_velocity.subtract(tangent.multiply(velocity_along_tangent * (1 - this._friction)));

            this.position = this.position.add(collision.normal.multiply(collision.depth));
        }

        this._collision.emit(other);
    }

    add_force(force) {
        if (!this._is_kinematic) {
            this._linear_velocity = this._linear_velocity.add(force.divide(this._mass));
            this._sleeping = false;
        }
    }

    add_impulse(impulse) {
        if (!this._is_kinematic) {
            this._linear_velocity = this._linear_velocity.add(impulse);
            this._sleeping = false;
        }
    }

    apply_central_force(force) {
        this.add_force(force);
    }

    apply_impulse(impulse, position = null) {
        this.add_impulse(impulse);
    }

    set_linear_velocity(velocity) {
        this._linear_velocity = velocity.clone();
        this._sleeping = false;
    }

    set_angular_velocity(velocity) {
        this._angular_velocity = velocity;
        this._sleeping = false;
    }

    set_sleeping(enabled) {
        this._sleeping = enabled;
    }

    wake_up() {
        this._sleeping = false;
    }
}

class CharacterBody2D extends CollisionObject2D {
    constructor() {
        super();
        this.name = "CharacterBody2D";
        this._velocity = new Vector2(0, 0);
        this._gravity_scale = 1;
        this._friction = 0.1;
        this._move_and_slide_enabled = true;
        this._floor_normal = new Vector2(0, 0);
        this._is_on_floor = false;
        this._is_on_wall = false;
        this._is_on_ceiling = false;
        this._max_slides = 4;
        this._stop_on_slope = false;
    }

    get velocity() { return this._velocity.clone(); }
    get gravity_scale() { return this._gravity_scale; }
    get friction() { return this._friction; }
    get floor_normal() { return this._floor_normal.clone(); }
    get is_on_floor() { return this._is_on_floor; }
    get is_on_wall() { return this._is_on_wall; }
    get is_on_ceiling() { return this._is_on_ceiling; }

    set velocity(value) { this._velocity = value.clone(); }
    set gravity_scale(value) { this._gravity_scale = value; }
    set friction(value) { this._friction = value; }

    _physics_process(dt) {
        const gravity = Physics2DManager.get_singleton().gravity;
        this._velocity = this._velocity.add(gravity.multiply(this._gravity_scale * dt));

        if (this._move_and_slide_enabled) {
            this.move_and_slide();
        }
    }

    move_and_slide() {
        this._is_on_floor = false;
        this._is_on_wall = false;
        this._is_on_ceiling = false;
        this._floor_normal = new Vector2(0, 0);

        let remaining_motion = this._velocity;

        for (let i = 0; i < this._max_slides; i++) {
            if (remaining_motion.length() < 0.001) break;

            this.position = this.position.add(remaining_motion);

            const collisions = this._check_collisions();

            if (collisions.length === 0) break;

            let min_depth = Infinity;
            let best_normal = new Vector2(0, 0);

            for (const collision of collisions) {
                if (collision.depth < min_depth) {
                    min_depth = collision.depth;
                    best_normal = collision.normal;
                }
            }

            if (best_normal.y < -0.5) {
                this._is_on_floor = true;
                this._floor_normal = best_normal;
            } else if (best_normal.y > 0.5) {
                this._is_on_ceiling = true;
            } else if (Math.abs(best_normal.x) > 0.5) {
                this._is_on_wall = true;
            }

            const dot = remaining_motion.dot(best_normal);
            remaining_motion = remaining_motion.subtract(best_normal.multiply(dot));

            this.position = this.position.add(best_normal.multiply(min_depth));
        }

        this._velocity = remaining_motion.multiply(1 - this._friction);
    }

    _check_collisions() {
        const physics = Physics2DManager.get_singleton();
        const collisions = [];

        for (const body of physics._bodies) {
            if (body === this || !body._active) continue;

            const collision = physics._test_collision(this, body);
            if (collision) {
                collisions.push(collision);
            }
        }

        return collisions;
    }

    move_and_collide(motion) {
        this.position = this.position.add(motion);
        return null;
    }

    is_on_floor() { return this._is_on_floor; }
    is_on_wall() { return this._is_on_wall; }
    is_on_ceiling() { return this._is_on_ceiling; }
}

class StaticBody2D extends CollisionObject2D {
    constructor() {
        super();
        this.name = "StaticBody2D";
        this._friction = 0.1;
        this._bounce = 0;
    }

    get friction() { return this._friction; }
    get bounce() { return this._bounce; }

    set friction(value) { this._friction = value; }
    set bounce(value) { this._bounce = value; }
}

class CollisionShape2D extends Node2D {
    constructor() {
        super();
        this.name = "CollisionShape2D";
        this._shape = null;
        this._disabled = false;
        this._one_way = false;
        this._one_way_margin = 0.0;
    }

    get shape() { return this._shape; }
    get disabled() { return this._disabled; }
    get one_way() { return this._one_way; }
    get one_way_margin() { return this._one_way_margin; }

    set shape(value) { this._shape = value; }
    set disabled(value) { this._disabled = value; }
    set one_way(value) { this._one_way = value; }
    set one_way_margin(value) { this._one_way_margin = value; }

    _ready() {
        super._ready();
        if (this._parent instanceof CollisionObject2D) {
            this._parent._add_collision_shape(this);
        }
    }

    _exit_tree() {
        if (this._parent instanceof CollisionObject2D) {
            this._parent._remove_collision_shape(this);
        }
        super._exit_tree();
    }

    get_global_position() {
        return this.global_position;
    }
}

class CircleShape2D {
    constructor() {
        this._radius = 10;
    }

    get radius() { return this._radius; }
    set radius(value) { this._radius = value; }
}

class RectangleShape2D {
    constructor() {
        this._rect = new Rect2(0, 0, 50, 50);
    }

    get rect() { return this._rect.clone(); }
    set rect(value) { this._rect = value.clone(); }
}

class CapsuleShape2D {
    constructor() {
        this._radius = 10;
        this._height = 40;
    }

    get radius() { return this._radius; }
    get height() { return this._height; }

    set radius(value) { this._radius = value; }
    set height(value) { this._height = value; }
}

plane.Physics2DManager = Physics2DManager;
plane.CollisionObject2D = CollisionObject2D;
plane.Area2D = Area2D;
plane.RigidBody2D = RigidBody2D;
plane.CharacterBody2D = CharacterBody2D;
plane.StaticBody2D = StaticBody2D;
plane.CollisionShape2D = CollisionShape2D;
plane.CircleShape2D = CircleShape2D;
plane.RectangleShape2D = RectangleShape2D;
plane.CapsuleShape2D = CapsuleShape2D;