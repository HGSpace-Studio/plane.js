class Node2D extends Node {
    constructor() {
        super();
        this.name = "Node2D";
        this._position = new Vector2(0, 0);
        this._rotation = 0;
        this._scale = new Vector2(1, 1);
        this._transform = new Transform2D();
        this._visible = true;
        this._z_index = 0;
        this._global_position = new Vector2(0, 0);
        this._global_rotation = 0;
        this._global_scale = new Vector2(1, 1);
    }

    get position() { return this._position.clone(); }
    get rotation() { return this._rotation; }
    get scale() { return this._scale.clone(); }
    get z_index() { return this._z_index; }
    get visible() { return this._visible; }
    get global_position() { return this._calculate_global_position(); }
    get global_rotation() { return this._calculate_global_rotation(); }
    get global_scale() { return this._calculate_global_scale(); }

    set position(value) { this._position = value.clone(); this._update_transform(); }
    set rotation(value) { this._rotation = value; this._update_transform(); }
    set scale(value) { this._scale = value.clone(); this._update_transform(); }
    set z_index(value) { this._z_index = value; }
    set visible(value) { this._visible = value; }

    _update_transform() {
        this._transform = new Transform2D(this._rotation, this._position);
        this._transform.scale = this._scale.clone();
    }

    _calculate_global_position() {
        if (!this._parent || !(this._parent instanceof Node2D)) {
            return this._position.clone();
        }
        return this._parent.global_position.add(this._transform.apply(new Vector2(0, 0)));
    }

    _calculate_global_rotation() {
        if (!this._parent || !(this._parent instanceof Node2D)) {
            return this._rotation;
        }
        return this._parent.global_rotation + this._rotation;
    }

    _calculate_global_scale() {
        if (!this._parent || !(this._parent instanceof Node2D)) {
            return this._scale.clone();
        }
        return this._parent.global_scale.multiply(this._scale);
    }

    move_and_slide(velocity, floor_normal = new Vector2(0, 1)) {
        this.position = this.position.add(velocity);
        return velocity;
    }

    move_and_collide(motion) {
        this.position = this.position.add(motion);
        return null;
    }

    rotate(angle) {
        this._rotation += angle;
        this._update_transform();
    }

    scale_by(factor) {
        this._scale = this._scale.multiply(factor);
        this._update_transform();
    }

    translate(offset) {
        this._position = this._position.add(offset);
        this._update_transform();
    }

    look_at(target) {
        const direction = target.subtract(this._position);
        this._rotation = direction.angle();
        this._update_transform();
    }

    look_at_position(target) {
        this.look_at(target);
    }

    get_angle_to(target) {
        const direction = target.subtract(this._position);
        return direction.angle();
    }

    get_distance_to(target) {
        return this._position.distance_to(target);
    }

    is_position_inside(rect) {
        return rect.has_point(this._position);
    }

    _process(dt) {
        super._process(dt);
        this._update_transform();
    }

    draw(ctx, transform) {
    }

    _draw() {
    }
}

plane.Node2D = Node2D;