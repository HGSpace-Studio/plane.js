class AnimatedSprite extends Sprite {
    constructor() {
        super();
        this.name = "AnimatedSprite";
        this._frames = [];
        this._frame_duration = 0.1;
        this._current_frame = 0;
        this._playing = false;
        this._loop = true;
        this._speed_scale = 1;
        this._animation = "";
        this._animations = {};
        this._frame_timer = 0;
        this._reverse = false;
        this._on_frame_change = null;
        this._on_animation_finished = null;
    }

    get frames() { return [...this._frames]; }
    get frame_duration() { return this._frame_duration; }
    get current_frame() { return this._current_frame; }
    get playing() { return this._playing; }
    get loop() { return this._loop; }
    get speed_scale() { return this._speed_scale; }
    get animation() { return this._animation; }
    get reverse() { return this._reverse; }

    set frame_duration(value) { this._frame_duration = value; }
    set loop(value) { this._loop = value; }
    set speed_scale(value) { this._speed_scale = value; }
    set reverse(value) { this._reverse = value; }

    add_animation(name, frames, frame_duration = 0.1) {
        this._animations[name] = { frames, frame_duration };
    }

    play(animation_name = "") {
        if (animation_name && this._animations[animation_name]) {
            this._animation = animation_name;
            const anim = this._animations[animation_name];
            this._frames = anim.frames;
            this._frame_duration = anim.frame_duration;
            this._current_frame = this._reverse ? this._frames.length - 1 : 0;
        } else if (!this._frames.length && animation_name) {
            return;
        }

        this._playing = true;
        this._frame_timer = 0;
        this._set_frame(this._current_frame);
    }

    stop() {
        this._playing = false;
    }

    pause() {
        this._playing = false;
    }

    resume() {
        this._playing = true;
    }

    set_frame(frame) {
        this._current_frame = frame;
        this._set_frame(frame);
    }

    _set_frame(frame) {
        if (this._frames[frame]) {
            this._texture = this._frames[frame];
            if (this._on_frame_change) {
                this._on_frame_change(frame);
            }
        }
    }

    _process(dt) {
        super._process(dt);

        if (!this._playing || !this._frames.length) return;

        this._frame_timer += dt * this._speed_scale;

        if (this._frame_timer >= this._frame_duration) {
            this._frame_timer -= this._frame_duration;

            if (this._reverse) {
                this._current_frame--;
                if (this._current_frame < 0) {
                    if (this._loop) {
                        this._current_frame = this._frames.length - 1;
                    } else {
                        this._current_frame = 0;
                        this.stop();
                        if (this._on_animation_finished) {
                            this._on_animation_finished();
                        }
                    }
                }
            } else {
                this._current_frame++;
                if (this._current_frame >= this._frames.length) {
                    if (this._loop) {
                        this._current_frame = 0;
                    } else {
                        this._current_frame = this._frames.length - 1;
                        this.stop();
                        if (this._on_animation_finished) {
                            this._on_animation_finished();
                        }
                    }
                }
            }

            this._set_frame(this._current_frame);
        }
    }

    get_frame_count() {
        return this._frames.length;
    }

    get_animation_names() {
        return Object.keys(this._animations);
    }

    is_playing() {
        return this._playing;
    }
}

plane.AnimatedSprite = AnimatedSprite;