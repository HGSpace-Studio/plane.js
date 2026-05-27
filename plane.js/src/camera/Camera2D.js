class Camera2D extends Node2D {
    constructor() {
        super();
        this.name = "Camera2D";
        this._zoom = new Vector2(1, 1);
        this._offset = new Vector2(0, 0);
        this._rotation = 0;
        this._current_position = new Vector2(0, 0);
        this._smooth_enabled = false;
        this._smooth_speed = 5;
        this._follow_mode = 0;
        this._follow_target = null;
        this._limit_enabled = false;
        this._limit_rect = new Rect2(0, 0, 1000, 1000);
        this._viewport_rect = new Rect2(0, 0, 800, 600);
        this._drag_margin = new Rect2(0, 0, 0, 0);
        this._drag_speed = new Vector2(1, 1);
        this._current_zoom = new Vector2(1, 1);
        this._shake_enabled = false;
        this._shake_amount = 0;
        this._shake_speed = 10;
        this._shake_duration = 0;
        this._is_current = false;
        this._projection = new Vector2(1, 1);
    }

    get zoom() { return this._zoom.clone(); }
    get offset() { return this._offset.clone(); }
    get rotation() { return this._rotation; }
    get smooth_enabled() { return this._smooth_enabled; }
    get smooth_speed() { return this._smooth_speed; }
    get follow_mode() { return this._follow_mode; }
    get limit_enabled() { return this._limit_enabled; }
    get limit_rect() { return this._limit_rect.clone(); }
    get viewport_rect() { return this._viewport_rect.clone(); }
    get is_current() { return this._is_current; }
    get projection() { return this._projection.clone(); }

    set zoom(value) { this._zoom = value.clone(); }
    set offset(value) { this._offset = value.clone(); }
    set rotation(value) { this._rotation = value; }
    set smooth_enabled(value) { this._smooth_enabled = value; }
    set smooth_speed(value) { this._smooth_speed = value; }
    set follow_mode(value) { this._follow_mode = value; }
    set limit_enabled(value) { this._limit_enabled = value; }
    set limit_rect(value) { this._limit_rect = value.clone(); }
    set viewport_rect(value) { this._viewport_rect = value.clone(); }
    set is_current(value) { this._is_current = value; }
    set projection(value) { this._projection = value.clone(); }

    set_follow_target(target) { this._follow_target = target; }
    get_follow_target() { return this._follow_target; }

    _ready() {
        super._ready();
        this._current_position = this.position.clone();
        this._current_zoom = this._zoom.clone();
    }

    _process(dt) {
        super._process(dt);

        if (this._follow_target) {
            const target_pos = this._follow_target.global_position;
            const desired_pos = target_pos.add(this._offset);

            if (this._smooth_enabled) {
                this._current_position = this._current_position.lerp(desired_pos, dt * this._smooth_speed);
            } else {
                this._current_position = desired_pos.clone();
            }
        }

        if (this._limit_enabled) {
            const halfViewport = this._viewport_rect.size.divide(2).divide(this._zoom);
            this._current_position.x = Math.max(this._limit_rect.x + halfViewport.x, Math.min(this._limit_rect.x + this._limit_rect.width - halfViewport.x, this._current_position.x));
            this._current_position.y = Math.max(this._limit_rect.y + halfViewport.y, Math.min(this._limit_rect.y + this._limit_rect.height - halfViewport.y, this._current_position.y));
        }

        if (this._shake_enabled && this._shake_duration > 0) {
            this._shake_duration -= dt;
            if (this._shake_duration <= 0) {
                this._shake_enabled = false;
            }
        }

        this.position = this._current_position.clone();
    }

    shake(amount, duration) {
        this._shake_amount = amount;
        this._shake_duration = duration;
        this._shake_enabled = true;
    }

    get_screen_center_position() {
        return this._viewport_rect.size.divide(2);
    }

    world_to_screen(world_position) {
        const offset = world_position.subtract(this._current_position);
        const zoomed = offset.multiply(this._zoom);
        return zoomed.add(this.get_screen_center_position());
    }

    screen_to_world(screen_position) {
        const offset = screen_position.subtract(this.get_screen_center_position());
        const zoomed = offset.divide(this._zoom);
        return zoomed.add(this._current_position);
    }

    set_zoom(value) {
        this._zoom = value.clone();
        if (this._zoom.x < 0.1) this._zoom.x = 0.1;
        if (this._zoom.y < 0.1) this._zoom.y = 0.1;
    }

    zoom_in(amount = 0.1) {
        this._zoom = this._zoom.multiply(1 + amount);
    }

    zoom_out(amount = 0.1) {
        this._zoom = this._zoom.divide(1 + amount);
        if (this._zoom.x < 0.1) this._zoom.x = 0.1;
        if (this._zoom.y < 0.1) this._zoom.y = 0.1;
    }

    reset_zoom() {
        this._zoom = new Vector2(1, 1);
    }
}

plane.Camera2D = Camera2D;