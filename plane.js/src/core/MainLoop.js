class MainLoop {
    constructor() {
        this._iterations_per_second = 60;
        this._physics_ticks_per_second = 60;
        this._fixed_delta = 1 / this._physics_ticks_per_second;
        this._accumulator = 0;
        this._current_frame = 0;
        this._time = 0;
        this._delta = 0;
        this._paused = false;
        this._time_scale = 1;
        this._frames = 0;
        this._fps_time = 0;
        this._fps = 0;
        this._root = null;
        this._running = false;
        this._last_time = 0;
        this._max_physics_steps = 8;
        this._idle_frames = 0;
    }

    get fixed_delta() { return this._fixed_delta; }
    get time() { return this._time; }
    get delta() { return this._delta; }
    get paused() { return this._paused; }
    get time_scale() { return this._time_scale; }
    get frames() { return this._fps; }
    get root() { return this._root; }

    set paused(value) { this._paused = value; }
    set time_scale(value) { this._time_scale = value; }

    initialize(root) {
        this._root = root;
        this._last_time = performance.now();
        this._running = true;
        if (this._root && typeof this._root._enter_tree === 'function') {
            this._root._enter_tree();
        }
    }

    _process_frame(current_time) {
        if (!this._running) return;

        const raw_delta = (current_time - this._last_time) / 1000;
        this._last_time = current_time;

        this._frames++;
        this._fps_time += raw_delta;
        if (this._fps_time >= 1) {
            this._fps = this._frames;
            this._frames = 0;
            this._fps_time -= 1;
        }

        if (this._paused) {
            requestAnimationFrame(t => this._process_frame(t));
            return;
        }

        this._delta = raw_delta * this._time_scale;
        this._time += this._delta;

        this._accumulator += this._delta;
        const max_steps = this._max_physics_steps;
        let steps = 0;

        while (this._accumulator >= this._fixed_delta && steps < max_steps) {
            this._physics_process(this._fixed_delta);
            this._accumulator -= this._fixed_delta;
            steps++;
        }

        const alpha = this._accumulator / this._fixed_delta;
        this._process(this._delta, alpha);

        requestAnimationFrame(t => this._process_frame(t));
    }

    _process(delta, alpha) {
        if (this._root && typeof this._root._process === 'function') {
            this._root._process(delta);
        }
    }

    _physics_process(delta) {
        if (this._root && typeof this._root._physics_process === 'function') {
            this._root._physics_process(delta);
        }
    }

    start() {
        this._running = true;
        requestAnimationFrame(t => this._process_frame(t));
    }

    quit() {
        this._running = false;
    }

    get_delta_time() { return this._delta; }
    get_fixed_time() { return this._time; }
    get_frame_count() { return this._current_frame; }
}

plane.MainLoop = MainLoop;