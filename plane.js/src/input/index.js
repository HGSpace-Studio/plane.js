class Input {
    constructor() {
        this._keys = {};
        this._mouse_buttons = {};
        this._mouse_position = new Vector2(0, 0);
        this._mouse_motion = new Vector2(0, 0);
        this._mouse_button_mask = 0;
        this._action_map = {};
        this._axis_map = {};
        this._custom_mouse_cursor = null;
        this._last_mouse_position = new Vector2(0, 0);
        this._accumulated_mouse_motion = new Vector2(0, 0);
        this._in_relative_mode = false;
    }

    static get_singleton() {
        if (!Input._instance) {
            Input._instance = new Input();
        }
        return Input._instance;
    }

    _init() {
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', (e) => this._on_key_down(e));
            window.addEventListener('keyup', (e) => this._on_key_up(e));
            window.addEventListener('mousedown', (e) => this._on_mouse_down(e));
            window.addEventListener('mouseup', (e) => this._on_mouse_up(e));
            window.addEventListener('mousemove', (e) => this._on_mouse_move(e));
            window.addEventListener('wheel', (e) => this._on_mouse_wheel(e));
            window.addEventListener('contextmenu', (e) => e.preventDefault());

            if ('ontouchstart' in window) {
                window.addEventListener('touchstart', (e) => this._on_touch_start(e));
                window.addEventListener('touchend', (e) => this._on_touch_end(e));
                window.addEventListener('touchmove', (e) => this._on_touch_move(e));
            }
        }
    }

    _on_key_down(event) {
        const key = event.code || event.key;
        this._keys[key] = true;
        global_events.emit("key_down", key, event);
        this._emit_action("key_" + key.toLowerCase(), true);
    }

    _on_key_up(event) {
        const key = event.code || event.key;
        this._keys[key] = false;
        global_events.emit("key_up", key, event);
        this._emit_action("key_" + key.toLowerCase(), false);
    }

    _on_mouse_down(event) {
        const button = event.button;
        this._mouse_buttons[button] = true;
        this._mouse_button_mask |= (1 << button);
        this._update_mouse_position(event);
        global_events.emit("mouse_down", button, this._mouse_position.clone(), event);
    }

    _on_mouse_up(event) {
        const button = event.button;
        this._mouse_buttons[button] = false;
        this._mouse_button_mask &= ~(1 << button);
        this._update_mouse_position(event);
        global_events.emit("mouse_up", button, this._mouse_position.clone(), event);
    }

    _on_mouse_move(event) {
        this._update_mouse_position(event);
        const motion = new Vector2(event.movementX || 0, event.movementY || 0);
        this._mouse_motion = motion;
        this._accumulated_mouse_motion = this._accumulated_mouse_motion.add(motion);
        global_events.emit("mouse_motion", this._mouse_position.clone(), motion, event);
    }

    _on_mouse_wheel(event) {
        const delta = event.deltaY || event.detail || 0;
        global_events.emit("mouse_wheel", delta, event);
    }

    _on_touch_start(event) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            this._mouse_buttons[touch.identifier] = true;
            this._update_mouse_position_from_touch(touch);
            global_events.emit("touch_start", touch.identifier, this._mouse_position.clone());
        }
    }

    _on_touch_end(event) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            this._mouse_buttons[touch.identifier] = false;
            this._update_mouse_position_from_touch(touch);
            global_events.emit("touch_end", touch.identifier, this._mouse_position.clone());
        }
    }

    _on_touch_move(event) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            this._update_mouse_position_from_touch(touch);
            global_events.emit("touch_move", touch.identifier, this._mouse_position.clone());
        }
    }

    _update_mouse_position(event) {
        this._last_mouse_position = this._mouse_position.clone();
        this._mouse_position = new Vector2(event.clientX, event.clientY);
    }

    _update_mouse_position_from_touch(touch) {
        this._last_mouse_position = this._mouse_position.clone();
        this._mouse_position = new Vector2(touch.clientX, touch.clientY);
    }

    _emit_action(action, pressed) {
        if (this._action_map[action]) {
            global_events.emit("action", action, pressed);
        }
    }

    is_key_pressed(key) {
        return !!this._keys[key];
    }

    is_key_down(key) {
        return !!this._keys[key];
    }

    is_key_up(key) {
        return !this._keys[key];
    }

    is_mouse_button_pressed(button) {
        return !!this._mouse_buttons[button];
    }

    is_mouse_button_down(button) {
        return !!this._mouse_buttons[button];
    }

    is_mouse_button_up(button) {
        return !this._mouse_buttons[button];
    }

    get_mouse_position() {
        return this._mouse_position.clone();
    }

    get_last_mouse_position() {
        return this._last_mouse_position.clone();
    }

    get_mouse_motion() {
        const motion = this._accumulated_mouse_motion.clone();
        if (!this._in_relative_mode) {
            this._accumulated_mouse_motion = new Vector2(0, 0);
        }
        return motion;
    }

    get_mouse_button_mask() {
        return this._mouse_button_mask;
    }

    set_mouse_mode(mode) {
    }

    get_mouse_mode() {
        return 0;
    }

    warp_mouse_position(pos) {
        this._mouse_position = pos.clone();
    }

    action_press(action) {
        this._emit_action(action, true);
    }

    action_release(action) {
        this._emit_action(action, false);
    }

    is_action_pressed(action) {
        if (this._action_map[action]) {
            const inputs = this._action_map[action];
            for (const input of inputs) {
                if (input.type === 'key') {
                    if (this.is_key_pressed(input.key)) return true;
                } else if (input.type === 'button') {
                    if (this.is_mouse_button_pressed(input.button)) return true;
                }
            }
        }
        return false;
    }

    is_action_just_pressed(action) {
        if (this._action_map[action]) {
            const inputs = this._action_map[action];
            for (const input of inputs) {
                if (input.type === 'key') {
                    if (this._keys[input.key] && !input._was_pressed) {
                        input._was_pressed = true;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    is_action_just_released(action) {
        if (this._action_map[action]) {
            const inputs = this._action_map[action];
            for (const input of inputs) {
                if (input.type === 'key') {
                    if (!this._keys[input.key] && input._was_pressed) {
                        input._was_pressed = false;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    get_axis(action_left, action_right) {
        let axis = 0;
        if (this.is_action_pressed(action_left)) axis -= 1;
        if (this.is_action_pressed(action_right)) axis += 1;
        return axis;
    }

    get_vector(action_left, action_right, action_up, action_down) {
        return new Vector2(
            this.get_axis(action_left, action_right),
            this.get_axis(action_up, action_down)
        );
    }

    add_action(action, key, as_positive = true) {
        if (!this._action_map[action]) {
            this._action_map[action] = [];
        }
        this._action_map[action].push({ type: 'key', key: key, _was_pressed: false });
    }

    remove_action(action) {
        delete this._action_map[action];
    }

    add_joy_mapping(mapping) {
    }

    joy_get_axis(device, axis) {
        return 0;
    }

    joy_get_button_count(device) {
        return 0;
    }

    joy_has_mapping(device, mapping) {
        return false;
    }

    is_joy_connected(device) {
        return false;
    }
}

Input._instance = null;

const Input = Input.get_singleton();

plane.Input = Input;
plane.Input = Input;