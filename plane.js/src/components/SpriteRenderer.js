class Component {
    constructor() {
        this._node = null;
        this._enabled = true;
        this._name = "Component";
    }

    get node() { return this._node; }
    get enabled() { return this._enabled; }
    get name() { return this._name; }

    set enabled(value) { this._enabled = value; }
    set name(value) { this._name = value; }

    _ready() {}
    _process(dt) {}
    _physics_process(dt) {}
}

class SpriteRenderer extends Component {
    constructor() {
        super();
        this._name = "SpriteRenderer";
        this._sprite = null;
        this._texture = null;
        this._color = new Color(1, 1, 1, 1);
        this._flip_h = false;
        this._flip_v = false;
    }

    get sprite() { return this._sprite; }
    get texture() { return this._texture; }
    get color() { return this._color.clone(); }
    get flip_h() { return this._flip_h; }
    get flip_v() { return this._flip_v; }

    set sprite(value) { this._sprite = value; }
    set texture(value) { this._texture = value; }
    set color(value) { this._color = value.clone(); }
    set flip_h(value) { this._flip_h = value; }
    set flip_v(value) { this._flip_v = value; }

    _ready() {
        if (!this._sprite && this._node) {
            this._sprite = new Sprite();
            this._sprite.texture = this._texture;
            this._sprite.modulate = this._color;
            this._node.add_child(this._sprite);
        }
    }

    _process(dt) {
        if (this._sprite) {
            this._sprite.modulate = this._color;
            this._sprite.flip_h = this._flip_h;
            this._sprite.flip_v = this._flip_v;
            if (this._texture !== this._sprite.texture) {
                this._sprite.texture = this._texture;
            }
        }
    }
}

class RigidBodyComponent extends Component {
    constructor() {
        super();
        this._name = "RigidBodyComponent";
        this._body = null;
        this._mass = 1;
        this._friction = 0.1;
        this._bounce = 0;
        this._gravity_scale = 1;
        this._linear_velocity = new Vector2(0, 0);
        this._angular_velocity = 0;
        this._freeze_rotation = false;
        this._is_kinematic = false;
    }

    get body() { return this._body; }
    get mass() { return this._mass; }
    get friction() { return this._friction; }
    get bounce() { return this._bounce; }
    get gravity_scale() { return this._gravity_scale; }
    get linear_velocity() { return this._linear_velocity.clone(); }
    get angular_velocity() { return this._angular_velocity; }
    get freeze_rotation() { return this._freeze_rotation; }
    get is_kinematic() { return this._is_kinematic; }

    set mass(value) { this._mass = value; }
    set friction(value) { this._friction = value; }
    set bounce(value) { this._bounce = value; }
    set gravity_scale(value) { this._gravity_scale = value; }
    set linear_velocity(value) { this._linear_velocity = value.clone(); }
    set angular_velocity(value) { this._angular_velocity = value; }
    set freeze_rotation(value) { this._freeze_rotation = value; }
    set is_kinematic(value) { this._is_kinematic = value; }

    _ready() {
        if (!this._body && this._node) {
            this._body = new RigidBody2D();
            this._body.mass = this._mass;
            this._body.friction = this._friction;
            this._body.bounce = this._bounce;
            this._body.gravity_scale = this._gravity_scale;
            this._node.add_child(this._body);
        }
    }

    add_force(force) {
        if (this._body) {
            this._body.add_force(force);
        }
    }

    add_impulse(impulse) {
        if (this._body) {
            this._body.add_impulse(impulse);
        }
    }

    set_velocity(velocity) {
        if (this._body) {
            this._body.linear_velocity = velocity;
        }
    }
}

class ColliderComponent extends Component {
    constructor() {
        super();
        this._name = "ColliderComponent";
        this._collider = null;
        this._shape = null;
        this._is_trigger = false;
        this._collision_layer = 1;
        this._collision_mask = 1;
    }

    get collider() { return this._collider; }
    get shape() { return this._shape; }
    get is_trigger() { return this._is_trigger; }
    get collision_layer() { return this._collision_layer; }
    get collision_mask() { return this._collision_mask; }

    set shape(value) { this._shape = value; }
    set is_trigger(value) { this._is_trigger = value; }
    set collision_layer(value) { this._collision_layer = value; }
    set collision_mask(value) { this._collision_mask = value; }

    _ready() {
        if (!this._collider && this._node) {
            this._collider = new Area2D();
            this._collider.monitoring = true;
            this._collider.monitorable = true;
            if (this._shape) {
                const shape_node = new CollisionShape2D();
                shape_node.shape = this._shape;
                this._collider.add_child(shape_node);
            }
            this._node.add_child(this._collider);
        }
    }
}

class ScriptComponent extends Component {
    constructor() {
        super();
        this._name = "ScriptComponent";
        this._script = null;
        this._properties = {};
    }

    get script() { return this._script; }
    get properties() { return { ...this._properties }; }

    set script(value) { this._script = value; }
    set properties(value) { this._properties = { ...value }; }

    _ready() {
        if (this._script && typeof this._script._ready === 'function') {
            this._script._ready.call(this._node);
        }
    }

    _process(dt) {
        if (this._script && typeof this._script._process === 'function') {
            this._script._process.call(this._node, dt);
        }
    }

    _physics_process(dt) {
        if (this._script && typeof this._script._physics_process === 'function') {
            this._script._physics_process.call(this._node, dt);
        }
    }
}

plane.Component = Component;
plane.SpriteRenderer = SpriteRenderer;
plane.RigidBodyComponent = RigidBodyComponent;
plane.ColliderComponent = ColliderComponent;
plane.ScriptComponent = ScriptComponent;