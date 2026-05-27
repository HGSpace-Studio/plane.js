class Animation {
    static LOOP_NONE = 0;
    static LOOP_DISABLED = 0;
    static LOOP_FORWARD = 1;
    static LOOP_PING_PONG = 2;
    static LOOP_BACKWARD = 3;

    constructor() {
        this._name = "";
        this._length = 1.0;
        this._loop_mode = Animation.LOOP_NONE;
        this._tracks = [];
        this._step = 0.0;
        this._track_count = 0;
    }

    get name() { return this._name; }
    get length() { return this._length; }
    get loop_mode() { return this._loop_mode; }
    get track_count() { return this._tracks.length; }

    set name(value) { this._name = value.toString(); }
    set length(value) { this._length = value; }
    set loop_mode(value) { this._loop_mode = value; }

    add_track(type) {
        const track = { type, keyframes: [], path: "" };
        this._tracks.push(track);
        return this._tracks.length - 1;
    }

    track_set_path(track_idx, path) {
        if (track_idx < this._tracks.length) {
            this._tracks[track_idx].path = path;
        }
    }

    track_get_path(track_idx) {
        if (track_idx < this._tracks.length) {
            return this._tracks[track_idx].path;
        }
        return "";
    }

    track_insert_key(track_idx, time, key_data) {
        if (track_idx < this._tracks.length) {
            const track = this._tracks[track_idx];
            const kf = { time, data: key_data };
            let inserted = false;
            for (let i = 0; i < track.keyframes.length; i++) {
                if (track.keyframes[i].time > time) {
                    track.keyframes.splice(i, 0, kf);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                track.keyframes.push(kf);
            }
        }
    }

    track_set_type(track_idx, type) {
        if (track_idx < this._tracks.length) {
            this._tracks[track_idx].type = type;
        }
    }

    track_get_type(track_idx) {
        if (track_idx < this._tracks.length) {
            return this._tracks[track_idx].type;
        }
        return -1;
    }

    get_track(track_idx) {
        return this._tracks[track_idx] || null;
    }

    clear_track(track_idx) {
        if (track_idx < this._tracks.length) {
            this._tracks[track_idx].keyframes = [];
        }
    }

    remove_track(track_idx) {
        if (track_idx < this._tracks.length) {
            this._tracks.splice(track_idx, 1);
        }
    }
}

Animation.TYPE_VALUE = 0;
Animation.TYPE_TRANSFORM = 1;
Animation.TYPE_CALL = 2;
Animation.TYPE_BEZIER = 3;

class AnimationPlayer extends Node {
    static UPDATE_PROCESS = 0;
    static UPDATE_PHYSICS = 1;
    static UPDATE_DISABLED = 2;

    constructor() {
        super();
        this._animations = {};
        this._current_animation = null;
        this._current_animation_name = "";
        this._playback_pos = 0;
        this._playback_speed = 1.0;
        this._playback_blend_time = 0;
        this._playing = false;
        this._queue = [];
        this._blend_times = {};
        this._root_node = null;
        this._method_cache = {};
        this._update_mode = AnimationPlayer.UPDATE_PROCESS;
        this._speed_scale = 1.0;
        this._autoplay = "";
        this._assigned_animation = "";
        this._on_finished_callback = null;
    }

    get current_animation() { return this._current_animation_name; }
    get playback_pos() { return this._playback_pos; }
    get playback_speed() { return this._playback_speed; }
    get playing() { return this._playing; }
    get speed_scale() { return this._speed_scale; }
    get autoplay() { return this._autoplay; }

    set playback_speed(value) { this._playback_speed = value; }
    set speed_scale(value) { this._speed_scale = value; }
    set autoplay(value) { this._autoplay = value.toString(); }

    _ready() {
        super._ready();
        if (this._autoplay) {
            this.play(this._autoplay);
        }
    }

    add_animation(name, animation) {
        this._animations[name] = animation;
    }

    remove_animation(name) {
        delete this._animations[name];
    }

    get_animation(name) {
        return this._animations[name] || null;
    }

    has_animation(name) {
        return !!this._animations[name];
    }

    get_animation_list() {
        return Object.keys(this._animations);
    }

    play(name = "", now = false, custom_blend = -1, custom_speed = 1.0) {
        if (name && this._animations[name]) {
            this._current_animation = this._animations[name];
            this._current_animation_name = name;
            this._assigned_animation = name;
        }
        if (now) {
            this._playback_pos = 0;
        }
        if (custom_speed !== 1.0) {
            this._playback_speed = custom_speed;
        }
        this._playing = true;
        this.emit("animation_started", name);
    }

    play_backwards(name = "") {
        this._playback_speed = -Math.abs(this._playback_speed);
        this.play(name);
    }

    stop() {
        this._playing = false;
        this._playback_pos = 0;
    }

    pause() {
        this._playing = false;
    }

    resume() {
        if (this._current_animation) {
            this._playing = true;
        }
    }

    is_playing() {
        return this._playing;
    }

    set_animation(animation) {
        if (typeof animation === 'string') {
            this._current_animation_name = animation;
            this._current_animation = this._animations[animation] || null;
        } else {
            this._current_animation = animation;
        }
    }

    get_current_animation() {
        return this._current_animation;
    }

    set_pos(pos) {
        this._playback_pos = pos;
    }

    seek(pos) {
        this._playback_pos = pos;
        this._update_properties(pos);
    }

    _process(dt) {
        super._process(dt);
        if (this._update_mode !== AnimationPlayer.UPDATE_PROCESS) return;
        if (!this._playing || !this._current_animation) return;
        this._advance(dt * this._playback_speed * this._speed_scale);
    }

    _physics_process(dt) {
        super._physics_process(dt);
        if (this._update_mode !== AnimationPlayer.UPDATE_PHYSICS) return;
        if (!this._playing || !this._current_animation) return;
        this._advance(dt * this._playback_speed * this._speed_scale);
    }

    _advance(dt) {
        this._playback_pos += dt;
        const anim_len = this._current_animation._length;

        if (this._playback_pos >= anim_len) {
            if (this._current_animation._loop_mode === Animation.LOOP_FORWARD) {
                this._playback_pos = this._playback_pos % anim_len;
            } else if (this._current_animation._loop_mode === Animation.LOOP_PING_PONG) {
                this._playback_pos = anim_len - (this._playback_pos - anim_len);
            } else {
                this._playback_pos = anim_len;
                this._playing = false;
                this.emit("animation_finished");
            }
        } else if (this._playback_pos < 0) {
            if (this._current_animation._loop_mode === Animation.LOOP_PING_PONG) {
                this._playback_pos = -this._playback_pos;
            } else {
                this._playback_pos = 0;
            }
        }

        this._update_properties(this._playback_pos);
    }

    _update_properties(pos) {
        if (!this._current_animation || !this._root_node) return;

        for (const track of this._current_animation._tracks) {
            const node = this._root_node.get_node_or_null(track.path);
            if (!node) continue;

            const keyframes = track.keyframes;
            if (keyframes.length === 0) continue;

            let kf_idx = 0;
            for (let i = 0; i < keyframes.length; i++) {
                if (keyframes[i].time <= pos) {
                    kf_idx = i;
                } else {
                    break;
                }
            }

            const kf = keyframes[kf_idx];
            if (kf) {
                this._apply_track_value(node, track.type, kf.data);
            }
        }
    }

    _apply_track_value(node, type, value) {
        switch (type) {
            case Animation.TYPE_VALUE:
                if (node.position !== undefined && value.position) {
                    node.position = value.position;
                }
                if (node.scale !== undefined && value.scale) {
                    node.scale = value.scale;
                }
                if (node.rotation !== undefined && value.rotation !== undefined) {
                    node.rotation = value.rotation;
                }
                if (node.modulate !== undefined && value.modulate) {
                    node.modulate = value.modulate;
                }
                if (node.opacity !== undefined && value.opacity !== undefined) {
                    node.opacity = value.opacity;
                }
                break;
            case Animation.TYPE_TRANSFORM:
                if (value.position) node.position = value.position;
                if (value.rotation !== undefined) node.rotation = value.rotation;
                if (value.scale) node.scale = value.scale;
                break;
            case Animation.TYPE_CALL:
                if (typeof value === 'function') {
                    value.call(node);
                }
                break;
        }
    }

    set_blend_time(anim_from, anim_to, time) {
        this._blend_times[`${anim_from}:${anim_to}`] = time;
    }

    set_on_finished(callback) {
        this._on_finished_callback = callback;
    }

    get_current_pos() {
        return this._playback_pos;
    }

    get_length() {
        return this._current_animation ? this._current_animation._length : 0;
    }
}

class Tween {
    static TRANS_LINEAR = 0;
    static TRANS_SINE = 1;
    static TRANS_QUINT = 2;
    static TRANS_QUART = 3;
    static TRANS_QUAD = 4;
    static TRANS_EXPO = 5;
    static TRANS_ELASTIC = 6;
    static TRANS_CUBIC = 7;
    static TRANS_CIRC = 8;
    static TRANS_BOUNCE = 9;
    static TRANS_BACK = 10;

    static EASE_IN = 0;
    static EASE_OUT = 1;
    static EASE_IN_OUT = 2;
    static EASE_OUT_IN = 3;

    constructor() {
        this._tweens = [];
        this._paused = false;
        this._active = false;
        this._speed = 1.0;
        this._start_time = 0;
    }

    _ease(t, trans, ease_type) {
        const et = MathUtils.ease(t, trans === 0 ? 'linear' : this._get_trans_name(trans));
        switch (ease_type) {
            case Tween.EASE_IN: return et;
            case Tween.EASE_OUT: return et;
            case Tween.EASE_IN_OUT: return et < 0.5 ? et * 2 : et * 2 - 1;
            case Tween.EASE_OUT_IN: return et < 0.5 ? et * 2 : et * 2 - 1;
            default: return et;
        }
    }

    _get_trans_name(trans) {
        const names = ['linear', 'ease_in', 'ease_out', 'ease_in_out', 'ease_in_cubic', 'ease_out_cubic', 'ease_in_out_cubic'];
        return names[trans] || 'linear';
    }

    interpolate(obj, property, from, to, duration, trans = Tween.TRANS_LINEAR, ease = Tween.EASE_IN_OUT) {
        const tween_data = {
            obj,
            property,
            from: from.clone ? from.clone() : from,
            to: to.clone ? to.clone() : to,
            duration,
            trans,
            ease,
            elapsed: 0,
            finished: false
        };
        this._tweens.push(tween_data);
        this._active = true;
        return this;
    }

    _process(dt) {
        if (this._paused || !this._active) return;
        for (const tween of this._tweens) {
            if (tween.finished) continue;
            tween.elapsed += dt * this._speed;
            const t = Math.min(tween.elapsed / tween.duration, 1);
            const eased_t = this._ease(t, tween.trans, tween.ease);

            const value = tween.from.lerp(tween.to, eased_t);
            tween.obj[tween.property] = value;

            if (t >= 1) {
                tween.finished = true;
                global_events.emit("tween_completed", tween.obj, tween.property);
            }
        }
        this._tweens = this._tweens.filter(t => !t.finished);
        if (this._tweens.length === 0) {
            this._active = false;
        }
    }

    pause() {
        this._paused = true;
    }

    resume() {
        this._paused = false;
    }

    stop() {
        this._tweens = [];
        this._active = false;
    }

    is_active() {
        return this._active;
    }

    set_speed(speed) {
        this._speed = speed;
    }

    parallel() {
        return this;
    }

    chain() {
        return this;
    }
}

class SpriteFrameAnimation {
    constructor() {
        this._frames = [];
        this._fps = 10;
        this._loop = true;
    }

    get frames() { return this._frames.slice(); }
    get fps() { return this._fps; }
    get loop() { return this._loop; }

    set fps(value) { this._fps = value; }
    set loop(value) { this._loop = value; }

    add_frame(frame_data, duration = 0.1) {
        this._frames.push({ texture: frame_data, duration });
    }

    clear() {
        this._frames = [];
    }
}

plane.Animation = Animation;
plane.AnimationPlayer = AnimationPlayer;
plane.Tween = Tween;
plane.SpriteFrameAnimation = SpriteFrameAnimation;
plane.Animation = Animation;
plane.AnimationPlayer = AnimationPlayer;