class SpriteRenderer {
    constructor() {
        this._sprite = null;
        this._texture = null;
        this._modulate = new Color(1, 1, 1, 1);
        this._opacity = 1.0;
        this._z_index = 0;
        this._z_as_relative = true;
        this._light_mask = 1;
        this._sort_children_bottom_up = false;
    }

    get sprite() { return this._sprite; }
    get texture() { return this._texture; }
    get modulate() { return this._modulate.clone(); }
    get opacity() { return this._opacity; }
    get z_index() { return this._z_index; }
    get z_as_relative() { return this._z_as_relative; }
    get light_mask() { return this._light_mask; }

    set sprite(value) { this._sprite = value; }
    set texture(value) { this._texture = value; if (this._sprite) this._sprite.texture = value; }
    set modulate(value) { this._modulate = value.clone(); if (this._sprite) this._sprite.modulate = value; }
    set opacity(value) { this._opacity = MathUtils.clamp(value, 0, 1); if (this._sprite) this._sprite.opacity = value; }
    set z_index(value) { this._z_index = value; if (this._sprite) this._sprite.z_index = value; }
    set z_as_relative(value) { this._z_as_relative = value; if (this._sprite) this._sprite.z_as_relative = value; }
    set light_mask(value) { this._light_mask = value; }
}

class RigidBodyComponent {
    constructor() {
        this._body = null;
        this._mass = 1.0;
        this._friction = 0.5;
        this._bounce = 0.0;
        this._gravity_scale = 1.0;
        this._linear_velocity = new Vector2(0, 0);
        this._angular_velocity = 0;
        this._max_linear_velocity = 1000;
        this._max_angular_velocity = 10;
        this._can_sleep = true;
        this._sleeping = false;
    }

    get body() { return this._body; }
    get mass() { return this._mass; }
    get friction() { return this._friction; }
    get bounce() { return this._bounce; }
    get gravity_scale() { return this._gravity_scale; }
    get linear_velocity() { return this._linear_velocity.clone(); }
    get angular_velocity() { return this._angular_velocity; }
    get sleeping() { return this._sleeping; }

    set body(value) { this._body = value; }
    set mass(value) { this._mass = value; if (this._body) this._body.mass = value; }
    set friction(value) { this._friction = value; if (this._body) this._body.friction = value; }
    set bounce(value) { this._bounce = value; if (this._body) this._body.bounce = value; }
    set gravity_scale(value) { this._gravity_scale = value; if (this._body) this._body.gravity_scale = value; }
    set linear_velocity(value) { this._linear_velocity = value.clone(); if (this._body) this._body.linear_velocity = value; }
    set angular_velocity(value) { this._angular_velocity = value; if (this._body) this._body.angular_velocity = value; }
    set sleeping(value) { this._sleeping = value; if (this._body) this._body.sleeping = value; }

    apply_force(force) {
        if (this._body) {
            this._body.apply_central_force(force);
        }
    }

    apply_impulse(impulse) {
        if (this._body) {
            this._body.apply_central_impulse(impulse);
        }
    }

    apply_torque(torque) {
        if (this._body) {
            this._body.apply_torque(torque);
        }
    }
}

class ColliderComponent {
    constructor() {
        this._shape = null;
        this._disabled = false;
        this._one_way_collision = false;
        this._one_way_collision_margin = 1.0;
        this._collision_layer = 1;
        this._collision_mask = 1;
    }

    get shape() { return this._shape; }
    get disabled() { return this._disabled; }
    get one_way_collision() { return this._one_way_collision; }
    get one_way_collision_margin() { return this._one_way_collision_margin; }
    get collision_layer() { return this._collision_layer; }
    get collision_mask() { return this._collision_mask; }

    set shape(value) { this._shape = value; }
    set disabled(value) { this._disabled = value; }
    set one_way_collision(value) { this._one_way_collision = value; }
    set one_way_collision_margin(value) { this._one_way_collision_margin = value; }
    set collision_layer(value) { this._collision_layer = value; }
    set collision_mask(value) { this._collision_mask = value; }
}

class AnimationPlayerComponent {
    constructor() {
        this._player = null;
        this._current_animation = "";
        this._playing = false;
        this._speed_scale = 1.0;
    }

    get player() { return this._player; }
    get current_animation() { return this._current_animation; }
    get playing() { return this._playing; }
    get speed_scale() { return this._speed_scale; }

    set player(value) { this._player = value; }
    set speed_scale(value) { this._speed_scale = value; if (this._player) this._player.speed_scale = value; }

    play(animation = "") {
        if (this._player) {
            this._player.play(animation);
            this._playing = true;
            this._current_animation = animation;
        }
    }

    stop() {
        if (this._player) {
            this._player.stop();
            this._playing = false;
        }
    }

    pause() {
        if (this._player) {
            this._player.pause();
            this._playing = false;
        }
    }

    seek(time) {
        if (this._player) {
            this._player.seek(time);
        }
    }

    add_animation(name, animation) {
        if (this._player) {
            this._player.add_animation(name, animation);
        }
    }

    get_animation(name) {
        if (this._player) {
            return this._player.get_animation(name);
        }
        return null;
    }
}

class AudioPlayerComponent {
    constructor() {
        this._stream_player = null;
        this._volume = 1.0;
        this._pitch_scale = 1.0;
        this._loop = false;
        this._autoplay = false;
    }

    get stream_player() { return this._stream_player; }
    get volume() { return this._volume; }
    get pitch_scale() { return this._pitch_scale; }
    get loop() { return this._loop; }
    get autoplay() { return this._autoplay; }

    set stream_player(value) { this._stream_player = value; }
    set volume(value) { this._volume = value; if (this._stream_player) this._stream_player.volume = value; }
    set pitch_scale(value) { this._pitch_scale = value; if (this._stream_player) this._stream_player.pitch_scale = value; }
    set loop(value) { this._loop = value; if (this._stream_player) this._stream_player.loop = value; }
    set autoplay(value) { this._autoplay = value; if (this._stream_player) this._stream_player.autoplay = value; }

    play() {
        if (this._stream_player) {
            this._stream_player.play();
        }
    }

    stop() {
        if (this._stream_player) {
            this._stream_player.stop();
        }
    }

    pause() {
        if (this._stream_player) {
            this._stream_player.pause();
        }
    }

    resume() {
        if (this._stream_player) {
            this._stream_player.resume();
        }
    }
}

class ScriptComponent {
    constructor() {
        this._script = null;
        this._script_instance = null;
    }

    get script() { return this._script; }

    set script(value) {
        this._script = value;
        if (value && typeof value === 'function') {
            this._script_instance = value;
        }
    }

    execute(method_name, ...args) {
        if (this._script_instance && typeof this._script_instance[method_name] === 'function') {
            return this._script_instance[method_name](...args);
        }
        return null;
    }

    _call_ready() {
        if (this._script_instance && typeof this._script_instance._ready === 'function') {
            this._script_instance._ready();
        }
    }

    _call_process(dt) {
        if (this._script_instance && typeof this._script_instance._process === 'function') {
            this._script_instance._process(dt);
        }
    }

    _call_physics_process(dt) {
        if (this._script_instance && typeof this._script_instance._physics_process === 'function') {
            this._script_instance._physics_process(dt);
        }
    }

    _call_input(event) {
        if (this._script_instance && typeof this._script_instance._input === 'function') {
            this._script_instance._input(event);
        }
    }
}

plane.SpriteRenderer = SpriteRenderer;
plane.RigidBodyComponent = RigidBodyComponent;
plane.ColliderComponent = ColliderComponent;
plane.AnimationPlayerComponent = AnimationPlayerComponent;
plane.AudioPlayerComponent = AudioPlayerComponent;
plane.ScriptComponent = ScriptComponent;