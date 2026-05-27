class Control extends Node2D {
    constructor() {
        super();
        this.name = "Control";
        this._rect = new Rect2(0, 0, 100, 20);
        this._anchor_left = 0;
        this._anchor_top = 0;
        this._anchor_right = 1;
        this._anchor_bottom = 1;
        this._margin_left = 0;
        this._margin_top = 0;
        this._margin_right = 0;
        this._margin_bottom = 0;
        this._custom_minimum_size = new Vector2(0, 0);
        this._focus_mode = 1;
        this._focus_neighbor_left = null;
        this._focus_neighbor_right = null;
        this._focus_neighbor_top = null;
        this._focus_neighbor_bottom = null;
        this._focused = false;
        this._mouse_filter = 2;
        this._cursor_shape = 0;
        this._visible = true;
        this._enabled = true;
    }

    get rect() { return this._rect.clone(); }
    get anchor_left() { return this._anchor_left; }
    get anchor_top() { return this._anchor_top; }
    get anchor_right() { return this._anchor_right; }
    get anchor_bottom() { return this._anchor_bottom; }
    get margin_left() { return this._margin_left; }
    get margin_top() { return this._margin_top; }
    get margin_right() { return this._margin_right; }
    get margin_bottom() { return this._margin_bottom; }
    get custom_minimum_size() { return this._custom_minimum_size.clone(); }
    get focused() { return this._focused; }
    get enabled() { return this._enabled; }

    set rect(value) { this._rect = value.clone(); }
    set anchor_left(value) { this._anchor_left = value; }
    set anchor_top(value) { this._anchor_top = value; }
    set anchor_right(value) { this._anchor_right = value; }
    set anchor_bottom(value) { this._anchor_bottom = value; }
    set margin_left(value) { this._margin_left = value; }
    set margin_top(value) { this._margin_top = value; }
    set margin_right(value) { this._margin_right = value; }
    set margin_bottom(value) { this._margin_bottom = value; }
    set custom_minimum_size(value) { this._custom_minimum_size = value.clone(); }
    set focused(value) { this._focused = value; }
    set enabled(value) { this._enabled = value; }

    _update_size() {
        if (this._parent && this._parent._rect) {
            const parent_rect = this._parent._rect;
            this._rect.x = parent_rect.width * this._anchor_left + this._margin_left;
            this._rect.y = parent_rect.height * this._anchor_top + this._margin_top;
            this._rect.width = parent_rect.width * (this._anchor_right - this._anchor_left) - this._margin_left - this._margin_right;
            this._rect.height = parent_rect.height * (this._anchor_bottom - this._anchor_top) - this._margin_top - this._margin_bottom;
        }
    }

    _ready() {
        super._ready();
        this._update_size();
    }

    draw(ctx, transform) {
        if (!this._visible) return;

        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        ctx.restore();
    }

    grab_focus() {
        this._focused = true;
    }

    release_focus() {
        this._focused = false;
    }

    has_focus() {
        return this._focused;
    }

    set_mouse_filter(filter) {
        this._mouse_filter = filter;
    }

    set_cursor_shape(shape) {
        this._cursor_shape = shape;
    }
}

class Button extends Control {
    constructor() {
        super();
        this.name = "Button";
        this._text = "Button";
        this._icon = null;
        this._disabled = false;
        this._toggle_mode = false;
        this._pressed = false;
        this._shortcut = null;
        this._focus_mode = 1;
        this._button_down = new Signal();
        this._button_up = new Signal();
        this._toggled = new Signal();
        this._clicked = new Signal();
        this._hovered = false;
    }

    get text() { return this._text; }
    get icon() { return this._icon; }
    get disabled() { return this._disabled; }
    get toggle_mode() { return this._toggle_mode; }
    get pressed() { return this._pressed; }

    set text(value) { this._text = value; }
    set icon(value) { this._icon = value; }
    set disabled(value) { this._disabled = value; }
    set toggle_mode(value) { this._toggle_mode = value; }
    set pressed(value) { this._pressed = value; }

    _ready() {
        super._ready();
        this._setup_events();
    }

    _setup_events() {
        this._mouse_down = (e) => {
            if (this._disabled) return;
            this._pressed = true;
            this._button_down.emit();
            if (this._toggle_mode) {
                this._toggled.emit(this._pressed);
            }
        };

        this._mouse_up = (e) => {
            if (this._disabled) return;
            if (!this._toggle_mode) {
                this._pressed = false;
            }
            this._button_up.emit();
            if (this._hovered) {
                this._clicked.emit();
            }
        };

        this._mouse_enter = (e) => {
            this._hovered = true;
        };

        this._mouse_leave = (e) => {
            this._hovered = false;
            if (!this._toggle_mode) {
                this._pressed = false;
            }
        };
    }

    draw(ctx, transform) {
        if (!this._visible) return;

        ctx.save();

        ctx.fillStyle = this._pressed ? "#4a5568" : (this._hovered ? "#4299e1" : "#2b6cb0");
        if (this._disabled) {
            ctx.fillStyle = "#a0aec0";
        }

        ctx.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);

        ctx.strokeStyle = "#1a365d";
        ctx.lineWidth = 2;
        ctx.strokeRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this._text, this._rect.x + this._rect.width / 2, this._rect.y + this._rect.height / 2);

        ctx.restore();
    }

    emit_signal(signal_name) {
        if (signal_name === "button_down") this._button_down.emit();
        else if (signal_name === "button_up") this._button_up.emit();
        else if (signal_name === "toggled") this._toggled.emit(this._pressed);
        else if (signal_name === "clicked") this._clicked.emit();
    }
}

class ProgressBar extends Control {
    constructor() {
        super();
        this.name = "ProgressBar";
        this._value = 0;
        this._min_value = 0;
        this._max_value = 100;
        this._percent_visible = true;
        this._text_visible = true;
        this._tint_over = false;
        this._fill_mode = 0;
        this._progress_changed = new Signal();
    }

    get value() { return this._value; }
    get min_value() { return this._min_value; }
    get max_value() { return this._max_value; }
    get percent_visible() { return this._percent_visible; }
    get text_visible() { return this._text_visible; }

    set value(value) {
        this._value = Math.max(this._min_value, Math.min(this._max_value, value));
        this._progress_changed.emit(this._value);
    }

    set min_value(value) { this._min_value = value; }
    set max_value(value) { this._max_value = value; }
    set percent_visible(value) { this._percent_visible = value; }
    set text_visible(value) { this._text_visible = value; }

    get_percent() {
        if (this._max_value === this._min_value) return 0;
        return (this._value - this._min_value) / (this._max_value - this._min_value);
    }

    draw(ctx, transform) {
        if (!this._visible) return;

        ctx.save();

        ctx.fillStyle = "#2d3748";
        ctx.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);

        const percent = this.get_percent();
        const fillWidth = this._rect.width * percent;

        ctx.fillStyle = "#48bb78";
        ctx.fillRect(this._rect.x, this._rect.y, fillWidth, this._rect.height);

        ctx.strokeStyle = "#1a202c";
        ctx.lineWidth = 2;
        ctx.strokeRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);

        if (this._text_visible) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let text = "";
            if (this._percent_visible) {
                text = `${Math.round(percent * 100)}%`;
            } else {
                text = `${this._value} / ${this._max_value}`;
            }

            ctx.fillText(text, this._rect.x + this._rect.width / 2, this._rect.y + this._rect.height / 2);
        }

        ctx.restore();
    }
}

class Panel extends Control {
    constructor() {
        super();
        this.name = "Panel";
        this._background_color = new Color(0.15, 0.15, 0.2, 1);
        this._border_color = new Color(0.3, 0.3, 0.4, 1);
        this._border_width = 2;
        this._shadow = false;
        this._shadow_color = new Color(0, 0, 0, 0.5);
        this._shadow_offset = new Vector2(4, 4);
        this._shadow_blur = 8;
    }

    get background_color() { return this._background_color.clone(); }
    get border_color() { return this._border_color.clone(); }
    get border_width() { return this._border_width; }
    get shadow() { return this._shadow; }

    set background_color(value) { this._background_color = value.clone(); }
    set border_color(value) { this._border_color = value.clone(); }
    set border_width(value) { this._border_width = value; }
    set shadow(value) { this._shadow = value; }

    draw(ctx, transform) {
        if (!this._visible) return;

        ctx.save();

        if (this._shadow) {
            ctx.shadowColor = this._shadow_color.to_rgba();
            ctx.shadowOffsetX = this._shadow_offset.x;
            ctx.shadowOffsetY = this._shadow_offset.y;
            ctx.shadowBlur = this._shadow_blur;
        }

        ctx.fillStyle = this._background_color.to_rgba();
        ctx.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);

        if (this._border_width > 0) {
            ctx.strokeStyle = this._border_color.to_rgba();
            ctx.lineWidth = this._border_width;
            ctx.strokeRect(this._rect.x + this._border_width / 2, this._rect.y + this._border_width / 2, this._rect.width - this._border_width, this._rect.height - this._border_width);
        }

        ctx.restore();
    }
}

class TextEdit extends Control {
    constructor() {
        super();
        this.name = "TextEdit";
        this._text = "";
        this._placeholder = "";
        this._editable = true;
        this._password_mode = false;
        this._max_length = 0;
        this._cursor_position = 0;
        this._selection_start = 0;
        this._selection_end = 0;
        this._readonly = false;
        this._focus_mode = 2;
        this._text_changed = new Signal();
        this._cursor_position_changed = new Signal();
        this._focus_entered = new Signal();
        this._focus_exited = new Signal();
        this._input = null;
    }

    get text() { return this._text; }
    get placeholder() { return this._placeholder; }
    get editable() { return this._editable; }
    get password_mode() { return this._password_mode; }
    get max_length() { return this._max_length; }
    get cursor_position() { return this._cursor_position; }
    get readonly() { return this._readonly; }

    set text(value) {
        this._text = value;
        this._text_changed.emit(value);
    }

    set placeholder(value) { this._placeholder = value; }
    set editable(value) { this._editable = value; }
    set password_mode(value) { this._password_mode = value; }
    set max_length(value) { this._max_length = value; }
    set cursor_position(value) {
        this._cursor_position = Math.max(0, Math.min(this._text.length, value));
        this._cursor_position_changed.emit(this._cursor_position);
    }
    set readonly(value) { this._readonly = value; }

    _ready() {
        super._ready();
        this._setup_input();
    }

    _setup_input() {
        this._input = document.createElement('input');
        this._input.type = this._password_mode ? 'password' : 'text';
        this._input.placeholder = this._placeholder;
        this._input.maxLength = this._max_length || null;
        this._input.readOnly = this._readonly;
        this._input.style.position = 'absolute';
        this._input.style.left = this._rect.x + 'px';
        this._input.style.top = this._rect.y + 'px';
        this._input.style.width = this._rect.width + 'px';
        this._input.style.height = this._rect.height + 'px';
        this._input.style.opacity = 0;
        this._input.style.cursor = 'text';

        this._input.addEventListener('input', (e) => {
            this._text = e.target.value;
        });

        this._input.addEventListener('focus', () => {
            this._focused = true;
            this._focus_entered.emit();
        });

        this._input.addEventListener('blur', () => {
            this._focused = false;
            this._focus_exited.emit();
        });
    }

    draw(ctx, transform) {
        if (!this._visible) return;

        ctx.save();

        ctx.fillStyle = "#2d3748";
        ctx.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);

        ctx.strokeStyle = this._focused ? "#4299e1" : "#4a5568";
        ctx.lineWidth = this._focused ? 2 : 1;
        ctx.strokeRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);

        const display_text = this._password_mode ? '*'.repeat(this._text.length) : this._text;

        if (display_text || !this._placeholder) {
            ctx.fillStyle = "#ffffff";
        } else {
            ctx.fillStyle = "#718096";
        }

        ctx.font = "14px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        const padding = 8;
        ctx.fillText(display_text || this._placeholder, this._rect.x + padding, this._rect.y + this._rect.height / 2);

        ctx.restore();
    }

    append_text(text) {
        this._text += text;
    }

    clear() {
        this._text = "";
    }

    insert_text(text, position = -1) {
        const pos = position >= 0 ? position : this._cursor_position;
        this._text = this._text.substring(0, pos) + text + this._text.substring(pos);
    }

    delete_text(position, length) {
        this._text = this._text.substring(0, position) + this._text.substring(position + length);
    }

    select_all() {
        this._selection_start = 0;
        this._selection_end = this._text.length;
    }
}

class ScrollBar extends Control {
    constructor() {
        super();
        this.name = "ScrollBar";
        this._value = 0;
        this._min_value = 0;
        this._max_value = 100;
        this._page_size = 10;
        this._step = 1;
        this._orientation = 0;
        this._inverted = false;
        this._value_changed = new Signal();
        this._drag_begin = new Signal();
        this._drag_end = new Signal();
        this._dragging = false;
    }

    get value() { return this._value; }
    get min_value() { return this._min_value; }
    get max_value() { return this._max_value; }
    get page_size() { return this._page_size; }
    get step() { return this._step; }
    get orientation() { return this._orientation; }
    get inverted() { return this._inverted; }

    set value(value) {
        this._value = Math.max(this._min_value, Math.min(this._max_value - this._page_size, value));
        this._value_changed.emit(this._value);
    }

    set min_value(value) { this._min_value = value; }
    set max_value(value) { this._max_value = value; }
    set page_size(value) { this._page_size = value; }
    set step(value) { this._step = value; }
    set orientation(value) { this._orientation = value; }
    set inverted(value) { this._inverted = value; }

    get_percent() {
        const range = this._max_value - this._page_size - this._min_value;
        if (range <= 0) return 0;
        return (this._value - this._min_value) / range;
    }

    draw(ctx, transform) {
        if (!this._visible) return;

        ctx.save();

        ctx.fillStyle = "#2d3748";
        if (this._orientation === 0) {
            ctx.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        } else {
            ctx.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        }

        const percent = this.get_percent();
        const slider_size = Math.max(20, this._rect.width * 0.2);

        ctx.fillStyle = this._dragging ? "#4299e1" : "#4a5568";
        if (this._orientation === 0) {
            const slider_x = this._rect.x + percent * (this._rect.width - slider_size);
            ctx.fillRect(slider_x, this._rect.y, slider_size, this._rect.height);
        } else {
            const slider_y = this._rect.y + percent * (this._rect.height - slider_size);
            ctx.fillRect(this._rect.x, slider_y, this._rect.width, slider_size);
        }

        ctx.strokeStyle = "#1a202c";
        ctx.lineWidth = 1;
        ctx.strokeRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);

        ctx.restore();
    }

    set(value) {
        this.value = value;
    }

    add(value) {
        this.value = this._value + value;
    }

    subtract(value) {
        this.value = this._value - value;
    }

    set_as_ratio(ratio) {
        this.value = this._min_value + ratio * (this._max_value - this._page_size - this._min_value);
    }
}

plane.Control = Control;
plane.Button = Button;
plane.ProgressBar = ProgressBar;
plane.Panel = Panel;
plane.TextEdit = TextEdit;
plane.ScrollBar = ScrollBar;