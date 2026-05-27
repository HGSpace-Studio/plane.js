class Animation {
    constructor() {
        this._name = "";
        this._length = 1.0;
        this._loop = true;
        this._speed = 1.0;
        this._tracks = [];
        this._step = 0;
    }

    get name() { return this._name; }
    get length() { return this._length; }
    get loop() { return this._loop; }
    get speed() { return this._speed; }

    set name(value) { this._name = value; }
    set length(value) { this._length = value; }
    set loop(value) { this._loop = value; }
    set speed(value) { this._speed = value; }

    add_track(property, type = 'value') {
        this._tracks.push({
            property,
            type,
            keyframes: []
        });
        return this._tracks.length - 1;
    }

    add_keyframe(track_index, time, value, transition = 'linear') {
        if (!this._tracks[track_index]) return;

        this._tracks[track_index].keyframes.push({
            time,
            value,
            transition
        });

        this._tracks[track_index].keyframes.sort((a, b) => a.time - b.time);

        if (time > this._length) {
            this._length = time;
        }
    }

    remove_track(track_index) {
        if (track_index >= 0 && track_index < this._tracks.length) {
            this._tracks.splice(track_index, 1);
        }
    }

    get_value(track_index, time) {
        const track = this._tracks[track_index];
        if (!track || track.keyframes.length === 0) return null;

        if (track.keyframes.length === 1) {
            return track.keyframes[0].value;
        }

        time = this._loop ? time % this._length : Math.min(time, this._length);

        let prev_key = track.keyframes[0];
        let next_key = track.keyframes[track.keyframes.length - 1];

        for (let i = 0; i < track.keyframes.length - 1; i++) {
            if (track.keyframes[i].time <= time && track.keyframes[i + 1].time >= time) {
                prev_key = track.keyframes[i];
                next_key = track.keyframes[i + 1];
                break;
            }
        }

        if (prev_key.time === next_key.time) {
            return prev_key.value;
        }

        const t = (time - prev_key.time) / (next_key.time - prev_key.time);

        if (track.type === 'value') {
            if (prev_key.value instanceof Vector2) {
                return prev_key.value.lerp(next_key.value, t);
            } else if (prev_key.value instanceof Color) {
                return prev_key.value.linear_interpolate(next_key.value, t);
            } else if (typeof prev_key.value === 'number') {
                return MathUtils.lerp(prev_key.value, next_key.value, t);
            }
        }

        return prev_key.value;
    }

    get_track_count() {
        return this._tracks.length;
    }

    get_track(track_index) {
        return this._tracks[track_index] || null;
    }

    reset() {
        this._step = 0;
    }
}

class AnimationPlayer extends Node2D {
    constructor() {
        super();
        this.name = "AnimationPlayer";
        this._animations = {};
        this._current_animation = null;
        this._current_time = 0;
        this._playing = false;
        this._speed = 1.0;
        this._loop = true;
        this._autoplay = "";
        this._animation_finished = new Signal();
        this._animation_changed = new Signal();
        this._seeked = new Signal();
        this._blend_time = 0;
        this._current_blend = 0;
        this._blending = false;
        this._blend_from = null;
        this._blend_from_time = 0;
    }

    get current_animation() { return this._current_animation; }
    get current_time() { return this._current_time; }
    get playing() { return this._playing; }
    get speed() { return this._speed; }
    get loop() { return this._loop; }

    set speed(value) { this._speed = value; }
    set loop(value) { this._loop = value; }

    add_animation(name, animation) {
        this._animations[name] = animation;
    }

    play(name = "") {
        if (!name && !this._current_animation) {
            const first_key = Object.keys(this._animations)[0];
            if (first_key) {
                name = first_key;
            } else {
                return;
            }
        }

        const new_animation = name ? this._animations[name] : this._animations[this._current_animation];

        if (!new_animation) return;

        this._current_animation = name;
        this._current_time = 0;
        this._playing = true;
        this._animation_changed.emit(name);
    }

    play_backwards(name = "") {
        if (!name) {
            name = this._current_animation;
        }

        if (!this._animations[name]) return;

        this._current_animation = name;
        this._current_time = this._animations[name].length;
        this._playing = true;
        this._animation_changed.emit(name);
    }

    pause() {
        this._playing = false;
    }

    stop() {
        this._playing = false;
        this._current_time = 0;
    }

    resume() {
        this._playing = true;
    }

    seek(time, update = true) {
        const anim = this._animations[this._current_animation];
        if (!anim) return;

        this._current_time = Math.max(0, Math.min(time, anim.length));
        this._seeked.emit(this._current_time);

        if (update) {
            this._apply_animation(this._current_time);
        }
    }

    advance(time) {
        this.seek(this._current_time + time, true);
    }

    set_current_animation(name) {
        if (this._animations[name]) {
            this._current_animation = name;
            this._current_time = 0;
        }
    }

    _process(dt) {
        super._process(dt);

        if (!this._playing || !this._current_animation) return;

        const anim = this._animations[this._current_animation];
        if (!anim) return;

        this._current_time += dt * this._speed * anim.speed;

        if (this._current_time >= anim.length) {
            if (this._loop) {
                this._current_time = 0;
            } else {
                this._current_time = anim.length;
                this._playing = false;
                this._animation_finished.emit(this._current_animation);
            }
        }

        this._apply_animation(this._current_time);
    }

    _apply_animation(time) {
        const anim = this._animations[this._current_animation];
        if (!anim || !this._parent) return;

        for (let i = 0; i < anim.get_track_count(); i++) {
            const track = anim.get_track(i);
            const value = anim.get_value(i, time);

            if (value !== null) {
                this._apply_property(track.property, value);
            }
        }
    }

    _apply_property(property, value) {
        if (!this._parent) return;

        const parts = property.split('.');
        let target = this._parent;

        for (let i = 0; i < parts.length - 1; i++) {
            target = target[parts[i]];
            if (!target) return;
        }

        const last_part = parts[parts.length - 1];
        target[last_part] = value;
    }

    get_animation_names() {
        return Object.keys(this._animations);
    }

    has_animation(name) {
        return !!this._animations[name];
    }

    remove_animation(name) {
        delete this._animations[name];
    }

    is_playing() {
        return this._playing;
    }

    get_current_animation_length() {
        const anim = this._animations[this._current_animation];
        return anim ? anim.length : 0;
    }
}

class Tween extends Node {
    constructor() {
        super();
        this.name = "Tween";
        this._tweens = [];
        this._active = true;
        this._completed = new Signal();
        this._tween_completed = new Signal();
        this._tween_started = new Signal();
    }

    get active() { return this._active; }

    set active(value) { this._active = value; }

    interpolate_property(object, property, initial_value, final_value, duration, trans_type = 'linear', ease_type = 'in_out') {
        const tween = {
            object,
            property,
            initial: initial_value,
            final: final_value,
            duration,
            elapsed: 0,
            trans_type,
            ease_type,
            active: true,
            started: false
        };

        this._tweens.push(tween);
        return tween;
    }

    interpolate_value(initial_value, final_value, duration, callback, trans_type = 'linear', ease_type = 'in_out') {
        const tween = {
            callback,
            initial: initial_value,
            final: final_value,
            duration,
            elapsed: 0,
            trans_type,
            ease_type,
            active: true,
            started: false,
            is_callback: true
        };

        this._tweens.push(tween);
        return tween;
    }

    interpolate_callback(duration, callback, trans_type = 'linear', ease_type = 'in_out') {
        const tween = {
            callback,
            duration,
            elapsed: 0,
            trans_type,
            ease_type,
            active: true,
            started: false,
            is_callback_only: true
        };

        this._tweens.push(tween);
        return tween;
    }

    _process(dt) {
        super._process(dt);

        if (!this._active) return;

        for (let i = this._tweens.length - 1; i >= 0; i--) {
            const tween = this._tweens[i];

            if (!tween.started) {
                tween.started = true;
                this._tween_started.emit(tween);
            }

            tween.elapsed += dt;

            if (tween.elapsed >= tween.duration) {
                tween.elapsed = tween.duration;
                tween.active = false;

                if (tween.is_callback_only) {
                    tween.callback(1);
                } else if (tween.is_callback) {
                    tween.callback(tween.final);
                } else {
                    this._set_property(tween.object, tween.property, tween.final);
                }

                this._tween_completed.emit(tween);
                this._tweens.splice(i, 1);

                if (this._tweens.length === 0) {
                    this._completed.emit();
                }
            } else {
                const t = tween.elapsed / tween.duration;
                const eased_t = this._apply_ease(t, tween.trans_type, tween.ease_type);

                if (tween.is_callback_only) {
                    tween.callback(eased_t);
                } else if (tween.is_callback) {
                    const value = this._interpolate(tween.initial, tween.final, eased_t);
                    tween.callback(value);
                } else {
                    const value = this._interpolate(tween.initial, tween.final, eased_t);
                    this._set_property(tween.object, tween.property, value);
                }
            }
        }
    }

    _interpolate(initial, final, t) {
        if (initial instanceof Vector2) {
            return initial.lerp(final, t);
        } else if (initial instanceof Color) {
            return initial.linear_interpolate(final, t);
        } else if (typeof initial === 'number') {
            return MathUtils.lerp(initial, final, t);
        }
        return final;
    }

    _apply_ease(t, trans_type, ease_type) {
        return MathUtils.ease(t, ease_type);
    }

    _set_property(object, property, value) {
        const parts = property.split('.');
        let target = object;

        for (let i = 0; i < parts.length - 1; i++) {
            target = target[parts[i]];
            if (!target) return;
        }

        target[parts[parts.length - 1]] = value;
    }

    stop(object = null, property = "") {
        if (object) {
            this._tweens = this._tweens.filter(t => {
                if (t.object === object) {
                    if (!property || t.property === property) {
                        return false;
                    }
                }
                return true;
            });
        } else {
            this._tweens = [];
        }
    }

    stop_all() {
        this._tweens = [];
    }

    is_active() {
        return this._tweens.length > 0;
    }

    get_running_tweens_count() {
        return this._tweens.length;
    }

    set_speed_scale(scale) {
        for (const tween of this._tweens) {
            tween.duration /= scale;
        }
    }
}

plane.Animation = Animation;
plane.AnimationPlayer = AnimationPlayer;
plane.Tween = Tween;