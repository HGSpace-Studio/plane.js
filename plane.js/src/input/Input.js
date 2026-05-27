class Input {
    static _instance = null;

    constructor() {
        this._key_states = {};
        this._key_prev_states = {};
        this._mouse_position = new Vector2(0, 0);
        this._mouse_prev_position = new Vector2(0, 0);
        this._mouse_button_states = {};
        this._mouse_button_prev_states = {};
        this._scroll_delta = new Vector2(0, 0);
        this._actions = {};
        this._touch_positions = {};
        this._touch_ids = [];
        this._captured_events = false;
        this._window_size = new Vector2(800, 600);
    }

    static get_singleton() {
        if (!Input._instance) {
            Input._instance = new Input();
        }
        return Input._instance;
    }

    static _init() {
        const input = Input.get_singleton();
        input._setup_listeners();
    }

    _setup_listeners() {
        window.addEventListener('keydown', (e) => {
            this._key_states[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this._key_states[e.code] = false;
        });

        window.addEventListener('mousemove', (e) => {
            this._mouse_position = new Vector2(e.clientX, e.clientY);
        });

        window.addEventListener('mousedown', (e) => {
            this._mouse_button_states[e.button] = true;
        });

        window.addEventListener('mouseup', (e) => {
            this._mouse_button_states[e.button] = false;
        });

        window.addEventListener('wheel', (e) => {
            this._scroll_delta = new Vector2(e.deltaX, e.deltaY);
        });

        window.addEventListener('touchstart', (e) => {
            for (const touch of e.changedTouches) {
                this._touch_positions[touch.identifier] = new Vector2(touch.clientX, touch.clientY);
                if (!this._touch_ids.includes(touch.identifier)) {
                    this._touch_ids.push(touch.identifier);
                }
            }
        });

        window.addEventListener('touchmove', (e) => {
            for (const touch of e.changedTouches) {
                this._touch_positions[touch.identifier] = new Vector2(touch.clientX, touch.clientY);
            }
        });

        window.addEventListener('touchend', (e) => {
            for (const touch of e.changedTouches) {
                delete this._touch_positions[touch.identifier];
                const index = this._touch_ids.indexOf(touch.identifier);
                if (index !== -1) {
                    this._touch_ids.splice(index, 1);
                }
            }
        });

        window.addEventListener('resize', (e) => {
            this._window_size = new Vector2(window.innerWidth, window.innerHeight);
        });
    }

    _update() {
        this._key_prev_states = { ...this._key_states };
        this._mouse_button_prev_states = { ...this._mouse_button_states };
        this._mouse_prev_position = this._mouse_position.clone();
        this._scroll_delta = new Vector2(0, 0);
    }

    is_key_pressed(key) {
        return !!this._key_states[key];
    }

    is_key_just_pressed(key) {
        return this._key_states[key] && !this._key_prev_states[key];
    }

    is_key_just_released(key) {
        return !this._key_states[key] && this._key_prev_states[key];
    }

    is_mouse_button_pressed(button) {
        return !!this._mouse_button_states[button];
    }

    is_mouse_button_just_pressed(button) {
        return this._mouse_button_states[button] && !this._mouse_button_prev_states[button];
    }

    is_mouse_button_just_released(button) {
        return !this._mouse_button_states[button] && this._mouse_button_prev_states[button];
    }

    get_mouse_position() {
        return this._mouse_position.clone();
    }

    get_mouse_delta() {
        return this._mouse_position.subtract(this._mouse_prev_position);
    }

    get_scroll_delta() {
        return this._scroll_delta.clone();
    }

    add_action(name, primary_key) {
        if (!this._actions[name]) {
            this._actions[name] = {
                keys: [primary_key],
                deadzone: 0.5,
                sensitivity: 1.0,
                type: 'key'
            };
        }
    }

    add_action_multiple(name, keys) {
        if (!this._actions[name]) {
            this._actions[name] = {
                keys: [...keys],
                deadzone: 0.5,
                sensitivity: 1.0,
                type: 'key'
            };
        }
    }

    is_action_pressed(name) {
        const action = this._actions[name];
        if (!action) return false;

        for (const key of action.keys) {
            if (this.is_key_pressed(key)) {
                return true;
            }
        }

        return false;
    }

    is_action_just_pressed(name) {
        const action = this._actions[name];
        if (!action) return false;

        for (const key of action.keys) {
            if (this.is_key_just_pressed(key)) {
                return true;
            }
        }

        return false;
    }

    is_action_just_released(name) {
        const action = this._actions[name];
        if (!action) return false;

        for (const key of action.keys) {
            if (this.is_key_just_released(key)) {
                return true;
            }
        }

        return false;
    }

    get_action_strength(name) {
        return this.is_action_pressed(name) ? 1.0 : 0.0;
    }

    get_axis(negative_action, positive_action) {
        const negative = this.is_action_pressed(negative_action) ? -1 : 0;
        const positive = this.is_action_pressed(positive_action) ? 1 : 0;
        return negative + positive;
    }

    get_axis_deadzone(negative_action, positive_action, deadzone = 0.5) {
        const axis = this.get_axis(negative_action, positive_action);
        return Math.abs(axis) < deadzone ? 0 : axis;
    }

    is_touching() {
        return this._touch_ids.length > 0;
    }

    get_touch_position(index = 0) {
        if (index < this._touch_ids.length) {
            return this._touch_positions[this._touch_ids[index]] || new Vector2(0, 0);
        }
        return new Vector2(0, 0);
    }

    get_touch_count() {
        return this._touch_ids.length;
    }

    set_capture_events(enabled) {
        this._captured_events = enabled;
    }

    is_event_captured() {
        return this._captured_events;
    }

    get_window_size() {
        return this._window_size.clone();
    }
}

plane.Input = Input;