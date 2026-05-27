class Camera2D extends Node {
    static DRAW_NONE = 0;
    static DRAW_PORTS = 1;
    static DRAW_LINES = 2;

    constructor() {
        super();
        this._position = new Vector2(0, 0);
        this._rotation = 0;
        this._zoom = new Vector2(1, 1);
        this._offset = new Vector2(0, 0);
        this._anchor_mode = Camera2D.ANCHOR_MODE_DRAG_CAMERA;
        this._rotating = false;
        this._current = false;
        this._zoom_hint = false;
        this._limits_have_changed = true;
        this._left_limit = -100000;
        this._right_limit = 100000;
        this._top_limit = -100000;
        this._bottom_limit = 100000;
        this._limit_margin_left = 0;
        this._limit_margin_top = 0;
        this._limit_margin_right = 0;
        this._limit_margin_bottom = 0;
        this._drag_margin_left = 0.2;
        this._drag_margin_top = 0.2;
        this._drag_margin_right = 0.2;
        this._drag_margin_bottom = 0.2;
        this._drag_offset = new Vector2(0, 0);
        this._drag_anchor = null;
        this._smoothing_enabled = false;
        this._smoothing_speed = 5;
        this._smoothing_active_pos = new Vector2(0, 0);
        this._smoothing_active_rot = 0;
        this._drag_margin_h_enabled = false;
        this._drag_margin_v_enabled = false;
        this._editor_draw_limits = false;
        this._editor_draw_ports = false;
        this._viewport_rect = new Rect2();
        this._canvas_layer = null;
        this._camera_make_current = true;
    }

    get position() { return this._position.clone(); }
    get rotation() { return this._rotation; }
    get zoom() { return this._zoom.clone(); }
    get offset() { return this._offset.clone(); }
    get anchor_mode() { return this._anchor_mode; }
    get rotating() { return this._rotating; }
    get current() { return this._current; }

    set position(value) { this._position = value.clone(); }
    set rotation(value) { this._rotation = value; }
    set zoom(value) { this._zoom = value.clone(); }
    set offset(value) { this._offset = value.clone(); }
    set anchor_mode(value) { this._anchor_mode = value; }
    set rotating(value) { this._rotating = value; }
    set current(value) { this._current = value; }

    set_limit_h(enabled) {
        this._drag_margin_h_enabled = enabled;
    }

    set_limit_v(enabled) {
        this._drag_margin_v_enabled = enabled;
    }

    _ready() {
        super._ready();
        if (this._current) {
            this.make_current();
        }
    }

    _enter_tree() {
        super._enter_tree();
        this._smoothing_active_pos = this._position.clone();
        this._smoothing_active_rot = this._rotation;
        if (this._viewport) {
            this._viewport_rect = this._viewport.get_viewport_rect();
        }
    }

    _process(dt) {
        if (this._smoothing_enabled) {
            const t = MathUtils.clamp(dt * this._smoothing_speed, 0, 1);
            this._smoothing_active_pos = this._smoothing_active_pos.lerp(this._position, t);
            this._smoothing_active_rot = MathUtils.lerp(this._smoothing_active_rot, this._rotation, t);
        } else {
            this._smoothing_active_pos = this._position.clone();
            this._smoothing_active_rot = this._rotation;
        }
    }

    _physics_process(dt) {
        if (this._drag_anchor) {
            this._drag_anchor.x = MathUtils.lerp(
                this._drag_anchor.x,
                this._drag_margin_left * this._viewport_rect.size.x,
                0.1
            );
            this._drag_anchor.y = MathUtils.lerp(
                this._drag_anchor.y,
                this._drag_margin_top * this._viewport_rect.size.y,
                0.1
            );
        }
    }

    make_current() {
        if (this._viewport) {
            this._viewport.set_current_camera(this);
        }
        this._camera_make_current = true;
    }

    clear_current() {
        this._camera_make_current = false;
    }

    update(delta) {
        if (this._viewport) {
            this._viewport_rect = this._viewport.get_viewport_rect();
        }
    }

    apply_transform(transform) {
        const pos = this._smoothing_enabled ? this._smoothing_active_pos : this._position;
        transform.apply(this._offset.add(pos).negate());
        transform.scale(this._zoom);
        transform.rotate(-this._rotation);
    }

    get_camera_transform() {
        const transform = new Transform2D(-this._rotation, this._offset.add(this._smoothing_enabled ? this._smoothing_active_pos : this._position).negate());
        transform.scale = this._zoom;
        return transform;
    }

    get_drag_anchor() {
        return this._drag_anchor ? this._drag_anchor.clone() : new Vector2();
    }

    set_drag_anchor(anchor) {
        this._drag_anchor = anchor ? anchor.clone() : null;
    }

    set_zoom_h(enabled) {
        this._drag_margin_h_enabled = enabled;
    }

    set_zoom_v(enabled) {
        this._drag_margin_v_enabled = enabled;
    }

    set_limit(limit, value) {
        switch (limit) {
            case 0: this._left_limit = value; break;
            case 1: this._top_limit = value; break;
            case 2: this._right_limit = value; break;
            case 3: this._bottom_limit = value; break;
        }
        this._limits_have_changed = true;
    }

    set_limit_margin(margin, value) {
        switch (margin) {
            case 0: this._limit_margin_left = value; break;
            case 1: this._limit_margin_top = value; break;
            case 2: this._limit_margin_right = value; break;
            case 3: this._limit_margin_bottom = value; break;
        }
    }

    set_drag_margin(margin, value) {
        switch (margin) {
            case 0: this._drag_margin_left = value; break;
            case 1: this._drag_margin_top = value; break;
            case 2: this._drag_margin_right = value; break;
            case 3: this._drag_margin_bottom = value; break;
        }
    }

    force_update_transform() {
        this._smoothing_active_pos = this._position.clone();
        this._smoothing_active_rot = this._rotation;
    }

    get_screen_transform() {
        const transform = new Transform2D(
            this._rotation,
            new Vector2(
                this._viewport_rect.size.x * 0.5 + this._offset.x,
                this._viewport_rect.size.y * 0.5 + this._offset.y
            )
        );
        return transform;
    }

    get_camera_screen_center() {
        const center = new Vector2(
            this._viewport_rect.size.x * 0.5,
            this._viewport_rect.size.y * 0.5
        );
        return center;
    }
}

Camera2D.ANCHOR_MODE_FIXED_TOP_LEFT = 0;
Camera2D.ANCHOR_MODE_DRAG_CAMERA = 1;
Camera2D.ANCHOR_MODE_ANCHOR_OPPOSITE = 2;
Camera2D.ANCHOR_MODE_CENTER = 3;

plane.Camera2D = Camera2D;