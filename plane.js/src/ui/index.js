class Control extends Node2D {
    static MOUSE_FILTER_STOP = 0;
    static MOUSE_FILTER_PASS = 1;
    static MOUSE_FILTER_IGNORE = 2;

    static SIZE_EXPAND_FILL = 1;
    static SIZE_EXPAND_PREFER = 2;
    static SIZE_EXPAND_IGNORE = 3;
    static SIZE_SHRINK_CENTER = 4;
    static SIZE_SHRINK_END = 5;

    static ANCHOR_BEGIN = 0;
    static ANCHOR_END = 1;

    static LAYER_MODE_CANVAS = 0;
    static LAYER_MODE_LAYER = 1;

    static GROW_DIRECTION_BEGIN = 0;
    static GROW_DIRECTION_END = 1;
    static GROW_DIRECTION_BOTH = 2;

    constructor() {
        super();
        this._rect = new Rect2(0, 0, 100, 100);
        this._rect_min_size = new Vector2(0, 0);
        this._rect_rotation = 0;
        this._rect_pivot_offset = new Vector2(0, 0);
        this._rect_min_size_changed = false;
        this._anchor_left = 0;
        this._anchor_top = 0;
        this._anchor_right = 0;
        this._anchor_bottom = 0;
        this._margin_left = 0;
        this._margin_top = 0;
        this._margin_right = 100;
        this._margin_bottom = 100;
        this._orientation = 0;
        this._layout_dir = 0;
        this._layout_mode = 0;
        this._size_flags_horizontal = Control.SIZE_EXPAND_FILL;
        this._size_flags_vertical = Control.SIZE_EXPAND_IGNORE;
        this._stretch_ratio = 1.0;
        this._custom_minimum_size = new Vector2(0, 0);
        this._margins_forced_changed_execute_priority = 0;
        this._expense_container_dirty = false;
        this._sort_children_bottom_up = false;
        this._rotation = 0;
        this._scale = new Vector2(1, 1);
        this._pivot_offset = new Vector2(0, 0);
        this._z_index = 0;
        this._global_z_index = 0;
        this._top_level = false;
        this._mouse_filter = Control.MOUSE_FILTER_STOP;
        this._mouse_default_cursor_shape = 0;
        this._mouse_force_pass_scroll = false;
        this._accept_drag = false;
        this._drop_target = false;
        this._force_pass_scroll = false;
        this._is_window_root = false;
        this._theme = null;
        this._theme_type_variation = "";
        this._theme_owner = null;
        this._theme_type_variation_base = "";
        this._modulate = new Color(1, 1, 1, 1);
        this._self_modulate = new Color(1, 1, 1, 1);
        this._visible = true;
        this._draw_mode = Node2D.DRAW_MODE_CANVAS;
        this._clip_children = Control.CLIP_CHILDREN_DISABLED;
        this._grow_horizontal = Control.GROW_DIRECTION_END;
        this._grow_vertical = Control.GROW_DIRECTION_END;
        this._focus_mode = 0;
        this._focused = false;
        this._shortcut_context = null;
        this._handle_input_locally = true;
        this._script_instance = null;
        this._minimum_size_dirty = true;
    }

    get rect() { return this._rect.clone(); }
    get rect_min_size() { return this._rect_min_size.clone(); }
    get rect_global_position() { return this._get_global_position(); }
    get rect_size() { return this._rect.size.clone(); }
    get rect_position() { return this._rect.position.clone(); }
    get anchor_left() { return this._anchor_left; }
    get anchor_top() { return this._anchor_top; }
    get anchor_right() { return this._anchor_right; }
    get anchor_bottom() { return this._anchor_bottom; }
    get margin_left() { return this._margin_left; }
    get margin_top() { return this._margin_top; }
    get margin_right() { return this._margin_right; }
    get margin_bottom() { return this._margin_bottom; }
    get mouse_filter() { return this._mouse_filter; }
    get mouse_default_cursor_shape() { return this._mouse_default_cursor_shape; }
    get theme() { return this._theme; }
    get modulate() { return this._modulate.clone(); }
    get self_modulate() { return this._self_modulate.clone(); }
    get visible() { return this._visible; }
    get focus_mode() { return this._focus_mode; }
    get focused() { return this._focused; }

    set rect(value) { this._rect = value.clone(); }
    set rect_min_size(value) { this._rect_min_size = value.clone(); this._minimum_size_dirty = true; }
    set rect_size(value) { this._rect.size = value.clone(); this._update_transform(); }
    set rect_position(value) { this._rect.position = value.clone(); this._update_transform(); }
    set mouse_filter(value) { this._mouse_filter = value; }
    set mouse_default_cursor_shape(value) { this._mouse_default_cursor_shape = value; }
    set theme(value) { this._theme = value; }
    set modulate(value) { this._modulate = value.clone(); }
    set self_modulate(value) { this._self_modulate = value.clone(); }
    set visible(value) { this._visible = value; }
    set focus_mode(value) { this._focus_mode = value; }

    set_anchor(anchor, value) {
        switch (anchor) {
            case 0: this._anchor_left = value; break;
            case 1: this._anchor_top = value; break;
            case 2: this._anchor_right = value; break;
            case 3: this._anchor_bottom = value; break;
        }
        this._update_transform();
    }

    set_anchor_left(value) { this._anchor_left = value; this._update_transform(); }
    set_anchor_top(value) { this._anchor_top = value; this._update_transform(); }
    set_anchor_right(value) { this._anchor_right = value; this._update_transform(); }
    set_anchor_bottom(value) { this._anchor_bottom = value; this._update_transform(); }

    set_margin(margin, value) {
        switch (margin) {
            case 0: this._margin_left = value; break;
            case 1: this._margin_top = value; break;
            case 2: this._margin_right = value; break;
            case 3: this._margin_bottom = value; break;
        }
        this._update_transform();
    }

    set_margins(left, top, right, bottom) {
        this._margin_left = left;
        this._margin_top = top;
        this._margin_right = right;
        this._margin_bottom = bottom;
        this._update_transform();
    }

    set_position(position) {
        this._rect.position = position.clone();
        this._update_transform();
    }

    set_size(size) {
        this._rect.size = size.clone();
        this._update_transform();
    }

    set_global_position(position) {
        if (this._parent && this._parent instanceof Control) {
            this._rect.position = this._parent._rect_global_to_local(position);
        } else {
            this._rect.position = position.clone();
        }
        this._update_transform();
    }

    _rect_global_to_local(global_pos) {
        return global_pos.subtract(this._get_global_position());
    }

    _update_transform() {
        if (this._parent instanceof Control) {
            const parent_rect = this._parent._rect;
            const new_pos = new Vector2(
                parent_rect.position.x + this._margin_left,
                parent_rect.position.y + this._margin_top
            );
            const new_size = new Vector2(
                this._margin_right - this._margin_left,
                this._margin_bottom - this._margin_top
            );
            this._rect.position = new_pos;
            this._rect.size = new_size;
        }
        this._position = this._rect.position.clone();
        this._invalidate_global_transform();
    }

    _get_minimum_size() {
        return this._rect_min_size.clone();
    }

    _process(dt) {
        super._process(dt);
        if (this._minimum_size_dirty) {
            this._update_minimum_size();
        }
    }

    _update_minimum_size() {
        this._minimum_size_dirty = false;
    }

    _input(event) {
        super._input(event);
        if (this._mouse_filter === Control.MOUSE_FILTER_IGNORE) return;

        if (event.type === 'mousemove') {
            this._input_mouse_move(event);
        } else if (event.type === 'mousedown') {
            this._input_mouse_button(event);
        } else if (event.type === 'mouseup') {
            this._input_mouse_button(event);
        }
    }

    _input_mouse_move(event) {
        const local_pos = this._get_local_mouse_position();
        this.emit("mouse_enter");
        if (this._mouse_filter === Control.MOUSE_FILTER_STOP) {
            this.emit("mouse_move", local_pos);
        }
    }

    _input_mouse_button(event) {
        const local_pos = this._get_local_mouse_position();
        if (this._rect.has_point(local_pos)) {
            if (event.type === 'mousedown') {
                this.emit("button_down", event.button);
            } else {
                this.emit("button_up", event.button);
            }
        }
    }

    _get_local_mouse_position() {
        const viewport = this._get_viewport();
        if (!viewport) return new Vector2();
        const global_mouse = viewport.get_mouse_position();
        return this._rect_global_to_local(global_mouse);
    }

    grab_focus() {
        if (this._focus_mode === 0) return;
        global_events.emit("focus_entered", this);
        this._focused = true;
    }

    release_focus() {
        if (!this._focused) return;
        global_events.emit("focus_exited", this);
        this._focused = false;
    }

    has_focus() {
        return this._focused;
    }

    _draw(ctx, transform) {
    }

    draw(ctx, transform) {
        if (!this._visible) return;
        ctx.save();
        ctx.globalAlpha = this._modulate.a * this._self_modulate.a;
        this._draw(ctx, transform);
        ctx.restore();
    }
}

class Button extends Control {
    static BUTTON_NORMAL = 0;
    static BUTTON_HOVER = 1;
    static BUTTON_PRESSED = 2;
    static BUTTON_DISABLED = 3;

    constructor() {
        super();
        this._text = "";
        this._icon = null;
        this._button_state = Button.BUTTON_NORMAL;
        this._action_mode = 0;
        this._button_mask = 1;
        this._shortcut = null;
        this._toggle_mode = false;
        this._pressed = false;
        this._expand_icon = false;
        this._flat = false;
        this._align = Button.BUTTON_NORMAL;
        this._text_align = Label.ALIGN_CENTER;
        this._clip_text = false;
        this._text_size = 14;
        this._uppercase = false;
    }

    get text() { return this._text; }
    get icon() { return this._icon; }
    get pressed() { return this._pressed; }
    get flat() { return this._flat; }

    set text(value) { this._text = value.toString(); }
    set icon(value) { this._icon = value; }
    set pressed(value) { this._pressed = value; }
    set flat(value) { this._flat = value; }

    _ready() {
        super._ready();
        this.connect("button_down", () => this._on_button_down());
        this.connect("button_up", () => this._on_button_up());
    }

    _on_button_down() {
        if (this._toggle_mode) {
            this._pressed = !this._pressed;
        } else {
            this._button_state = Button.BUTTON_PRESSED;
        }
        this.emit("pressed");
    }

    _on_button_up() {
        if (!this._toggle_mode) {
            this._button_state = Button.BUTTON_NORMAL;
        }
        this.emit("button_up");
    }

    _draw(ctx, transform) {
        const color = this._flat ? this._get_button_color() : new Color(0.2, 0.2, 0.2, 1);
        ctx.fillStyle = color.to_rgba();
        ctx.fillRect(0, 0, this._rect.width, this._rect.height);

        if (this._text) {
            ctx.fillStyle = "#FFFFFF";
            ctx.font = `${this._text_size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this._text, this._rect.width / 2, this._rect.height / 2);
        }
    }

    _get_button_color() {
        switch (this._button_state) {
            case Button.BUTTON_NORMAL: return new Color(0.3, 0.3, 0.3, 1);
            case Button.BUTTON_HOVER: return new Color(0.4, 0.4, 0.4, 1);
            case Button.BUTTON_PRESSED: return new Color(0.2, 0.2, 0.5, 1);
            case Button.BUTTON_DISABLED: return new Color(0.2, 0.2, 0.2, 0.5);
            default: return new Color(0.3, 0.3, 0.3, 1);
        }
    }

    _input_mouse_button(event) {
        super._input_mouse_button(event);
        if (event.type === 'mousedown') {
            this._button_state = Button.BUTTON_PRESSED;
        } else {
            this._button_state = Button.BUTTON_NORMAL;
        }
    }
}

class ProgressBar extends Control {
    constructor() {
        super();
        this._value = 0.5;
        this._min_value = 0;
        this._max_value = 1;
        this._step = 0.01;
        this._percentage_visible = true;
        this._fill_mode = 0;
        this._bar_offset = new Vector2(0, 0);
        this._bar_size = new Vector2(0, 0);
        this._tint_fill = new Color(0.3, 0.8, 0.3, 1);
        this._tint_bg = new Color(0.2, 0.2, 0.2, 1);
        this._is_integer = false;
    }

    get value() { return this._value; }
    get min_value() { return this._min_value; }
    get max_value() { return this._max_value; }
    get step() { return this._step; }

    set value(v) {
        this._value = MathUtils.clamp(v, this._min_value, this._max_value);
    }
    set min_value(v) { this._min_value = v; }
    set max_value(v) { this._max_value = v; }
    set step(v) { this._step = v; }

    get_as_ratio() {
        const range = this._max_value - this._min_value;
        if (range === 0) return 0;
        return (this._value - this._min_value) / range;
    }

    _draw(ctx, transform) {
        ctx.fillStyle = this._tint_bg.to_rgba();
        ctx.fillRect(0, 0, this._rect.width, this._rect.height);

        const ratio = this.get_as_ratio();
        const fill_width = this._rect.width * ratio;

        ctx.fillStyle = this._tint_fill.to_rgba();
        ctx.fillRect(0, 0, fill_width, this._rect.height);

        if (this._percentage_visible) {
            const percentage = Math.round(ratio * 100);
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "12px sans-serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${percentage}%`, this._rect.width / 2, this._rect.height / 2);
        }
    }
}

class Panel extends Control {
    constructor() {
        super();
        this._panel_style = null;
    }

    _draw(ctx, transform) {
        ctx.fillStyle = "rgba(0.2, 0.2, 0.2, 0.8)";
        ctx.fillRect(0, 0, this._rect.width, this._rect.height);
    }
}

class TextEdit extends Control {
    constructor() {
        super();
        this._text = "";
        this._placeholder = "";
        this._editable = true;
        this._max_length = 0;
        this._cursor_position = 0;
        this._selection_start = -1;
        this._selection_end = -1;
        this._secret = false;
        this._text_color = new Color(1, 1, 1, 1);
        this._placeholder_color = new Color(0.5, 0.5, 0.5, 1);
        this._caret_blink_enabled = false;
        this._caret_blink_speed = 0.5;
    }

    get text() { return this._text; }
    get editable() { return this._editable; }
    get cursor_position() { return this._cursor_position; }

    set text(value) { this._text = value.toString(); }
    set editable(value) { this._editable = value; }

    _input(event) {
        super._input(event);
        if (!this._editable) return;

        if (event.type === 'keydown') {
            this._handle_key(event);
        }
    }

    _handle_key(event) {
        if (event.key === 'Backspace') {
            if (this._text.length > 0 && this._cursor_position > 0) {
                this._text = this._text.slice(0, this._cursor_position - 1) + this._text.slice(this._cursor_position);
                this._cursor_position--;
            }
        } else if (event.key === 'Delete') {
            if (this._cursor_position < this._text.length) {
                this._text = this._text.slice(0, this._cursor_position) + this._text.slice(this._cursor_position + 1);
            }
        } else if (event.key === 'ArrowLeft') {
            if (this._cursor_position > 0) this._cursor_position--;
        } else if (event.key === 'ArrowRight') {
            if (this._cursor_position < this._text.length) this._cursor_position++;
        }
    }

    _draw(ctx, transform) {
        ctx.fillStyle = "rgba(0.1, 0.1, 0.1, 1)";
        ctx.fillRect(0, 0, this._rect.width, this._rect.height);

        ctx.fillStyle = "rgba(0.3, 0.3, 0.3, 1)";
        ctx.fillRect(0, 0, this._rect.width, this._rect.height);

        ctx.fillStyle = this._text_color.to_rgba();
        ctx.font = "14px sans-serif";
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        const display_text = this._secret ? '*'.repeat(this._text.length) : this._text;
        ctx.fillText(display_text, 4, 4);

        if (this._text.length === 0 && this._placeholder) {
            ctx.fillStyle = this._placeholder_color.to_rgba();
            ctx.fillText(this._placeholder, 4, 4);
        }
    }
}

class ScrollBar extends Control {
    static VERTICAL = 0;
    static HORIZONTAL = 1;

    constructor() {
        super();
        this._orientation = ScrollBar.VERTICAL;
        this._value = 0;
        this._min_value = 0;
        this._max_value = 1;
        this._page = 0;
        this._step = 0.01;
        this._scrollable = true;
        this._custom_step = -1;
    }

    get value() { return this._value; }
    get min_value() { return this._min_value; }
    get max_value() { return this._max_value; }
    get orientation() { return this._orientation; }

    set value(v) { this._value = MathUtils.clamp(v, this._min_value, this._max_value); }
    set min_value(v) { this._min_value = v; }
    set max_value(v) { this._max_value = v; }
    set orientation(v) { this._orientation = v; }

    _draw(ctx, transform) {
        ctx.fillStyle = "rgba(0.2, 0.2, 0.2, 1)";
        ctx.fillRect(0, 0, this._rect.width, this._rect.height);

        const ratio = (this._value - this._min_value) / (this._max_value - this._min_value);

        if (this._orientation === ScrollBar.VERTICAL) {
            const handle_height = Math.max(20, this._rect.height * ratio);
            ctx.fillStyle = "rgba(0.5, 0.5, 0.5, 1)";
            ctx.fillRect(4, 4, this._rect.width - 8, handle_height);
        } else {
            const handle_width = Math.max(20, this._rect.width * ratio);
            ctx.fillStyle = "rgba(0.5, 0.5, 0.5, 1)";
            ctx.fillRect(4, 4, handle_width, this._rect.height - 8);
        }
    }
}

plane.Control = Control;
plane.Button = Button;
plane.ProgressBar = ProgressBar;
plane.Panel = Panel;
plane.TextEdit = TextEdit;
plane.ScrollBar = ScrollBar;