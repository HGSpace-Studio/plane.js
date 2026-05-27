class Physics2DManager {
    constructor() {
        this._gravity = new Vector2(0, 980);
        this._ipd = 4;
        this._active = true;
        this._physics_callback = null;
    }

    static get_singleton() {
        if (!Physics2DManager._instance) {
            Physics2DManager._instance = new Physics2DManager();
        }
        return Physics2DManager._instance;
    }

    get gravity() { return this._gravity.clone(); }
    get ipd() { return this._ipd; }
    get active() { return this._active; }

    set gravity(value) { this._gravity = value.clone(); }
    set ipd(value) { this._ipd = value; }
    set active(value) { this._active = value; }

    get_default_physics_material() {
        return null;
    }

    area_set_gravity_override(area, value) {
    }

    area_set_gravity_vector_override(area, value) {
    }

    area_set_gravity_scale_override(area, value) {
    }
}

Physics2DManager._instance = null;

class CollisionObject2D extends Node2D {
    static AREA = 0;
    static BODY = 1;
    static SHAPE = 2;

    constructor() {
        super();
        this._collision_layer = 1;
        this._collision_mask = 1;
        this._collision_priority = 1.0;
        this._collision_object_type = CollisionObject2D.SHAPE;
        this._collisionCallbacks = [];
        this._area = null;
        this._shape_owners = {};
    }

    get collision_layer() { return this._collision_layer; }
    get collision_mask() { return this._collision_mask; }
    get collision_priority() { return this._collision_priority; }

    set collision_layer(value) { this._collision_layer = value; }
    set collision_mask(value) { this._collision_mask = value; }
    set collision_priority(value) { this._collision_priority = value; }

    _collision_add_shape_owner(owner_id) {
        this._shape_owners[owner_id] = { shapes: [] };
    }

    _collision_remove_shape_owner(owner_id) {
        delete this._shape_owners[owner_id];
    }

    add_shape(shape, transform = new Transform2D(),disabled = false) {
        const owner_id = Math.random().toString(36).substr(2, 9);
        this._collision_add_shape_owner(owner_id);
        const shape_data = { shape, transform, disabled, owner_id };
        this._shape_owners[owner_id].shapes.push(shape_data);
        return owner_id;
    }

    remove_shape_owner(owner_id) {
        this._collision_remove_shape_owner(owner_id);
    }

    get_shape_owners() {
        return Object.keys(this._shape_owners);
    }

    _get_shapes(owner_id) {
        return this._shape_owners[owner_id] ? this._shape_owners[owner_id].shapes : [];
    }

    connect_collider(callback) {
        this._collisionCallbacks.push(callback);
    }

    disconnect_collider(callback) {
        const idx = this._collisionCallbacks.indexOf(callback);
        if (idx !== -1) this._collisionCallbacks.splice(idx, 1);
    }

    emit_collision(collision) {
        for (const cb of this._collisionCallbacks) {
            cb(collision);
        }
    }
}

class Area2D extends CollisionObject2D {
    constructor() {
        super();
        this._collision_object_type = CollisionObject2D.AREA;
        this._gravity = 980;
        this._gravity_vec = new Vector2(0, 1);
        this._gravity_scale = 1.0;
        this._linear_damp = 0.1;
        this._angular_damp = 0.1;
        this._priority = 0;
        this._monitoring = true;
        this._monitorable = true;
        this._overriding_gravity = false;
        this._space_override_mode = 0;
        this._entered_bodies = [];
        this._exited_bodies = [];
    }

    get gravity() { return this._gravity; }
    get gravity_vec() { return this._gravity_vec.clone(); }
    get gravity_scale() { return this._gravity_scale; }
    get linear_damp() { return this._linear_damp; }
    get angular_damp() { return this._angular_damp; }
    get priority() { return this._priority; }
    get monitoring() { return this._monitoring; }
    get monitorable() { return this._monitorable; }

    set gravity(value) { this._gravity = value; }
    set gravity_vec(value) { this._gravity_vec = value.clone(); }
    set gravity_scale(value) { this._gravity_scale = value; }
    set linear_damp(value) { this._linear_damp = value; }
    set angular_damp(value) { this._angular_damp = value; }
    set priority(value) { this._priority = value; }
    set monitoring(value) { this._monitoring = value; }
    set monitorable(value) { this._monitorable = value; }

    _body_enter_tree(body_id) {
        if (!this._entered_bodies.includes(body_id)) {
            this._entered_bodies.push(body_id);
            this.emit("body_entered", body_id);
        }
        const idx = this._exited_bodies.indexOf(body_id);
        if (idx !== -1) this._exited_bodies.splice(idx, 1);
    }

    _body_exit_tree(body_id) {
        if (!this._exited_bodies.includes(body_id)) {
            this._exited_bodies.push(body_id);
            this.emit("body_exited", body_id);
        }
        const idx = this._entered_bodies.indexOf(body_id);
        if (idx !== -1) this._entered_bodies.splice(idx, 1);
    }

    has_body(body_id) {
        return this._entered_bodies.includes(body_id);
    }
}

class PhysicsBody2D extends CollisionObject2D {
    constructor() {
        super();
        this._collision_object_type = CollisionObject2D.BODY;
        this._mass = 1.0;
        this._friction = 0.5;
        this._bounce = 0.0;
        this._linear_velocity = new Vector2(0, 0);
        this._angular_velocity = 0;
        this._gravity_scale = 1.0;
        this._max_linear_velocity = 1000;
        this._max_angular_velocity = 10;
        this._applied_force = new Vector2(0, 0);
        this._applied_torque = 0;
        this._current_gravity = new Vector2(0, 980);
    }

    get mass() { return this._mass; }
    get friction() { return this._friction; }
    get bounce() { return this._bounce; }
    get linear_velocity() { return this._linear_velocity.clone(); }
    get angular_velocity() { return this._angular_velocity; }
    get gravity_scale() { return this._gravity_scale; }
    get max_linear_velocity() { return this._max_linear_velocity; }
    get max_angular_velocity() { return this._max_angular_velocity; }

    set mass(value) { this._mass = value; }
    set friction(value) { this._friction = value; }
    set bounce(value) { this._bounce = value; }
    set linear_velocity(value) { this._linear_velocity = value.clone(); }
    set angular_velocity(value) { this._angular_velocity = value; }
    set gravity_scale(value) { this._gravity_scale = value; }
    set max_linear_velocity(value) { this._max_linear_velocity = value; }
    set max_angular_velocity(value) { this._max_angular_velocity = value; }

    apply_force(force, position = null) {
        this._applied_force = this._applied_force.add(force);
        if (position) {
            const r = position.subtract(this._position);
            this._applied_torque += r.cross(force);
        }
    }

    apply_central_force(force) {
        this.apply_force(force, this._position);
    }

    apply_impulse(impulse, position = null) {
        this._linear_velocity = this._linear_velocity.add(impulse.divide(this._mass));
        if (position) {
            const r = position.subtract(this._position);
            this._angular_velocity += r.cross(impulse) / (this._mass * 0.5);
        }
    }

    apply_central_impulse(impulse) {
        this.apply_impulse(impulse, this._position);
    }

    apply_torque(torque) {
        this._applied_torque += torque;
    }

    apply_torque_impulse(impulse) {
        this._angular_velocity += impulse / (this._mass * 0.5);
    }

    set_zero_linear_velocity() {
        this._linear_velocity = new Vector2(0, 0);
    }

    set_zero_angular_velocity() {
        this._angular_velocity = 0;
    }

    integrate_forces(dt) {
        const gravity = Physics2DManager.get_singleton().gravity.multiply(this._gravity_scale);
        this._linear_velocity = this._linear_velocity.add(gravity.multiply(dt));
        this._linear_velocity = this._linear_velocity.add(this._applied_force.divide(this._mass).multiply(dt));
        this._linear_velocity = this._linear_velocity.limit_length(this._max_linear_velocity);
        this._angular_velocity += this._applied_torque / this._mass * dt;
        this._angular_velocity = MathUtils.clamp(this._angular_velocity, -this._max_angular_velocity, this._max_angular_velocity);
        this._applied_force = new Vector2(0, 0);
        this._applied_torque = 0;
    }

    integrate_velocities(dt) {
        this._position = this._position.add(this._linear_velocity.multiply(dt));
        this._rotation += this._angular_velocity * dt;
        this._update_transform();
    }

    _physics_process(dt) {
        this.integrate_forces(dt);
        this.integrate_velocities(dt);
    }
}

class RigidBody2D extends PhysicsBody2D {
    static MODE_STATIC = 0;
    static MODE_KINEMATIC = 1;
    static MODE_RIGID = 2;
    static MODE_CHARACTER = 3;

    constructor() {
        super();
        this._physics_mode = RigidBody2D.MODE_RIGID;
        this._can_sleep = true;
        this._sleeping = false;
        this._freeze = false;
        this._freeze_mode = 0;
        this._linear_damp = -1;
        this._angular_damp = -1;
        this._custom_solver_bias = 0;
    }

    get physics_mode() { return this._physics_mode; }
    get can_sleep() { return this._can_sleep; }
    get sleeping() { return this._sleeping; }
    get freeze() { return this._freeze; }
    get linear_damp() { return this._linear_damp; }
    get angular_damp() { return this._angular_damp; }

    set physics_mode(value) { this._physics_mode = value; }
    set can_sleep(value) { this._can_sleep = value; }
    set sleeping(value) { this._sleeping = value; }
    set freeze(value) { this._freeze = value; }
    set linear_damp(value) { this._linear_damp = value; }
    set angular_damp(value) { this._angular_damp = value; }

    _physics_process(dt) {
        if (this._physics_mode === RigidBody2D.MODE_RIGID) {
            super._physics_process(dt);
        }
    }
}

class StaticBody2D extends PhysicsBody2D {
    constructor() {
        super();
        this._collision_object_type = CollisionObject2D.BODY;
    }

    _physics_process(dt) {
    }
}

class CharacterBody2D extends PhysicsBody2D {
    static MOTION_MODE_TRANSLATING = 0;
    static MOTION_MODE_GROUNDED = 1;

    static SLOPE_STOP_BELOW_VELOCITY = 0;
    static UP_DIRECTION = new Vector2(0, -1);

    constructor() {
        super();
        this._motion_mode = CharacterBody2D.MOTION_MODE_TRANSLATING;
        this._up_direction = CharacterBody2D.UP_DIRECTION.clone();
        this._max_floor_slide_angle = Math.PI / 6;
        this._floor_stop_on_slope = true;
        this._floor_block_on_wall = false;
        this._safe_margin = 0.08;
        this._platform_floor_layers = 1;
        this._platform_wall_layers = 1;
        this._platform_velocity = new Vector2(0, 0);
        this._current_floor_normal = new Vector2(0, -1);
        this._was_on_floor = false;
        this._on_floor = false;
        this._on_ceiling = false;
        this._on_wall = false;
    }

    get motion_mode() { return this._motion_mode; }
    get up_direction() { return this._up_direction.clone(); }
    get max_floor_slide_angle() { return this._max_floor_slide_angle; }
    get floor_stop_on_slope() { return this._floor_stop_on_slope; }
    get safe_margin() { return this._safe_margin; }

    set motion_mode(value) { this._motion_mode = value; }
    set up_direction(value) { this._up_direction = value.clone(); }
    set max_floor_slide_angle(value) { this._max_floor_slide_angle = value; }
    set floor_stop_on_slope(value) { this._floor_stop_on_slope = value; }
    set safe_margin(value) { this._safe_margin = value; }

    move_and_slide() {
        this.integrate_velocities(Engine.get_physics_delta_time());
    }

    is_on_floor() {
        return this._on_floor;
    }

    is_on_ceiling() {
        return this._on_ceiling;
    }

    is_on_wall() {
        return this._on_wall;
    }

    get_floor_normal() {
        return this._current_floor_normal.clone();
    }
}

class CollisionShape2D extends Node2D {
    constructor() {
        super();
        this._shape = null;
        this._shape_owner = null;
        this._disabled = false;
        this._one_way_collision = false;
        this._one_way_collision_margin = 1.0;
    }

    get shape() { return this._shape; }
    get disabled() { return this._disabled; }
    get one_way_collision() { return this._one_way_collision; }
    get one_way_collision_margin() { return this._one_way_collision_margin; }

    set shape(value) { this._shape = value; }
    set disabled(value) { this._disabled = value; }
    set one_way_collision(value) { this._one_way_collision = value; }
    set one_way_collision_margin(value) { this._one_way_collision_margin = value; }
}

class CircleShape2D {
    constructor() {
        this._radius = 10;
        this.type = 'circle';
    }

    get radius() { return this._radius; }
    set radius(value) { this._radius = value; }

    get_rect() {
        return new Rect2(-this._radius, -this._radius, this._radius * 2, this._radius * 2);
    }

    contains_point(point) {
        return point.length() <= this._radius;
    }

    collides_with_shape(other) {
        return false;
    }
}

class RectangleShape2D {
    constructor() {
        this._size = new Vector2(100, 100);
        this.type = 'rectangle';
    }

    get size() { return this._size.clone(); }
    set size(value) { this._size = value.clone(); }

    get_rect() {
        return new Rect2(-this._size.x / 2, -this._size.y / 2, this._size.x, this._size.y);
    }
}

class CapsuleShape2D {
    constructor() {
        this._radius = 10;
        this._height = 30;
        this.type = 'capsule';
    }

    get radius() { return this._radius; }
    get height() { return this._height; }

    set radius(value) { this._radius = value; }
    set height(value) { this._height = value; }
}

plane.Physics2DManager = Physics2DManager;
plane.CollisionObject2D = CollisionObject2D;
plane.Area2D = Area2D;
plane.PhysicsBody2D = PhysicsBody2D;
plane.RigidBody2D = RigidBody2D;
plane.StaticBody2D = StaticBody2D;
plane.CharacterBody2D = CharacterBody2D;
plane.CollisionShape2D = CollisionShape2D;
plane.CircleShape2D = CircleShape2D;
plane.RectangleShape2D = RectangleShape2D;
plane.CapsuleShape2D = CapsuleShape2D;