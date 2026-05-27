class Engine {
    constructor() {
        this._active = false;
        this._paused = false;
        this._quit = false;
        this._root = null;
        this._main_loop = null;
        this._last_tick = 0;
        this._delta_time = 0;
        this._physics_delta_time = 0;
        this._time_scale = 1.0;
        this._fps = 0;
        this._frames = 0;
        this._fps_update_time = 0;
        this._fps_frames = 0;
        this._frame = 0;
        this._physics_jitter_fix = true;
        this._physics_max_substeps = 4;
        this._fixed_physics_delta = 1.0 / 60.0;
        this._max_delta = 0.1;
        this._last_input_event = null;
        this._queue_free_list = [];
        this._groups = {};
        this._rootNodes = [];
        this._instance = null;
    }

    get active() { return this._active; }
    get paused() { return this._paused; }
    get quit() { return this._quit; }
    get delta_time() { return this._delta_time; }
    get physics_delta_time() { return this._physics_delta_time; }
    get time_scale() { return this._time_scale; }
    get fps() { return this._fps; }
    get root() { return this._root; }
    get main_loop() { return this._main_loop; }
    get last_input_event() { return this._last_input_event; }

    set time_scale(value) { this._time_scale = value; }
    set paused(value) { this._paused = value; }

    static get_instance() {
        if (!Engine._instance) {
            Engine._instance = new Engine();
        }
        return Engine._instance;
    }

    static get_singleton() {
        return Engine.get_instance();
    }

    get_delta_time() {
        return this._delta_time * this._time_scale;
    }

    get_physics_delta_time() {
        return this._physics_delta_time * this._time_scale;
    }

    get_fixed_time() {
        return this._frame * this._fixed_physics_delta;
    }

    initialize(root_viewport) {
        this._root = root_viewport;
        this._active = true;
        this._last_tick = performance.now();
        this._fps_frames = 0;
        this._frame = 0;
        global_events.emit("engine_initialized");
    }

    start(main_loop) {
        if (!this._active) {
            console.error("Engine not initialized. Call initialize() first.");
            return;
        }
        this._main_loop = main_loop;
        this._active = true;
        this._quit = false;
        this._frames = 0;
        this._fps_update_time = 0;
        this._fps_frames = 0;
        global_events.emit("engine_started");

        this._main_loop._enter_tree();
        this._tick_loop();
    }

    _tick_loop() {
        if (this._quit) return;
        requestAnimationFrame(() => this._tick_loop());
        this._tick();
    }

    _tick() {
        const now = performance.now();
        this._delta_time = Math.min((now - this._last_tick) / 1000.0, this._max_delta);
        this._last_tick = now;

        this._fps_frames++;
        this._fps_update_time += this._delta_time;
        if (this._fps_update_time >= 1.0) {
            this._fps = this._fps_frames;
            this._fps_frames = 0;
            this._fps_update_time = 0;
        }

        this._frame++;

        this._process_physics();
        this._process_update();
        this._process_queue_free();
    }

    _process_physics() {
        if (!this._main_loop) return;
        if (this._paused) return;

        let accumulated = this._delta_time;
        let steps = 0;

        while (accumulated >= this._fixed_physics_delta) {
            this._call_physics_process(this._main_loop, this._fixed_physics_delta);
            accumulated -= this._fixed_physics_delta;
            steps++;
            if (steps >= this._physics_max_substeps) break;
        }
        this._physics_delta_time = this._fixed_physics_delta;
    }

    _call_physics_process(node, dt) {
        if (!node || !node._visible) return;

        if (typeof node._physics_process === 'function' && node._physics_processing !== false) {
            node._physics_process(dt);
        }

        if (node._children) {
            for (const child of node._children) {
                this._call_physics_process(child, dt);
            }
        }
    }

    _process_update() {
        if (!this._main_loop) return;

        const dt = this.get_delta_time();

        if (!this._paused) {
            this._call_process(this._main_loop, dt);
        }
    }

    _call_process(node, dt) {
        if (!node || !node._visible) return;

        if (typeof node._process === 'function' && node._processing !== false) {
            node._process(dt);
        }

        if (node._children) {
            for (const child of node._children) {
                this._call_process(child, dt);
            }
        }
    }

    _process_queue_free() {
        for (const node of this._queue_free_list) {
            this._remove_node_recursive(node);
        }
        this._queue_free_list = [];
    }

    _remove_node_recursive(node) {
        if (!node) return;
        const children = node._children ? node._children.slice() : [];
        for (const child of children) {
            this._remove_node_recursive(child);
        }
        if (node._parent) {
            node._parent.remove_child(node);
        }
    }

    queue_free(node) {
        if (!this._queue_free_list.includes(node)) {
            this._queue_free_list.push(node);
        }
    }

    quit() {
        this._quit = true;
        global_events.emit("engine_quit");
    }

    set_root_node(node) {
        this._root = node;
    }

    add_to_group(node, group, persistent = false) {
        if (!this._groups[group]) {
            this._groups[group] = [];
        }
        if (!this._groups[group].includes(node)) {
            this._groups[group].push(node);
        }
    }

    remove_from_group(node, group) {
        if (this._groups[group]) {
            const idx = this._groups[group].indexOf(node);
            if (idx !== -1) {
                this._groups[group].splice(idx, 1);
            }
        }
    }

    get_nodes_in_group(group) {
        return this._groups[group] ? this._groups[group].slice() : [];
    }

    get_realtime_elapsed() {
        return performance.now() / 1000.0;
    }

    get_root() {
        return this._root;
    }
}

Engine._instance = null;
Engine._fps_frames = 0;
Engine._frame = 0;

plane.Engine = Engine;