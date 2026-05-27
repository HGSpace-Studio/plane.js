const plane = {
    version: "1.0.0",
    author: "plane.js Team",
    license: "MIT",

    _initialized: false,
    _main_loop: null,
    _root_node: null,

    get initialized() { return this._initialized; },
    get main_loop() { return this._main_loop; },
    get root_node() { return this._root_node; }
};

window.plane = plane;

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        plane._init();
    });
}

plane._init = function() {
    if (this._initialized) return;
    this._initialized = true;

    console.log(`plane.js v${this.version} - 2D Game Engine`);
    console.log(`Author: ${this.author}`);
    console.log(`License: ${this.license}`);

    if (typeof Audio !== 'undefined') {
        plane.AudioManager.get_singleton()._init();
    }

    plane.Input._init();

    global_events.emit("plane_ready");
};

plane.start = function(main_loop) {
    this._main_loop = main_loop || new plane.SceneTree();

    const viewport = new plane.Viewport();
    viewport._setup_canvas();

    this._root_node = this._main_loop;
    this._main_loop.add_child(viewport);

    Engine.initialize(viewport);
    Engine.start(this._main_loop);

    global_events.emit("engine_started");
};

plane.get_world_2d = function() {
    if (this._main_loop) {
        const root = this._main_loop.get_root_viewport();
        if (root && root._world_2d) {
            return root._world_2d;
        }
        if (!root._world_2d) {
            root._world_2d = new plane.World2D();
        }
        return root._world_2d;
    }
    return null;
};

plane.load_scene = async function(path) {
    return await plane.ResourceLoader.get_singleton().load_async(path);
};

plane.load_image = async function(path) {
    return await plane.ResourceLoader.get_singleton().load_async(path, "ImageTexture");
};

plane.play_sound = function(path, volume = 1.0, loop = false) {
    return plane.AudioManager.get_singleton().play_sound(path, volume, loop);
};

plane.stop_sound = function(audio) {
    plane.AudioManager.get_singleton().stop_sound(audio);
};

plane.stop_all_sounds = function() {
    plane.AudioManager.get_singleton().stop_all_sounds();
};

plane.quit = function() {
    Engine.quit();
};

plane.get_frames = function() {
    return Engine.fps;
};

plane.get_delta = function() {
    return Engine.get_delta_time();
};

plane.get_time = function() {
    return Engine.get_fixed_time();
};

plane.get_root = function() {
    return Engine.get_root();
};

plane.get_main_loop = function() {
    return this._main_loop;
};

plane.get_input = function() {
    return plane.Input;
};

plane.create_timer = function(time, callback) {
    let elapsed = 0;
    const timer = {
        _running: true,
        get time_left() { return Math.max(0, time - elapsed); },
        stop() { this._running = false; },
        is_stopped() { return !this._running; }
    };

    const node = new plane.Node();
    node._process = function(dt) {
        if (!timer._running) return;
        elapsed += dt;
        if (elapsed >= time) {
            timer._running = false;
            if (callback) callback();
            node.queue_free();
        }
    };

    if (this._main_loop) {
        this._main_loop.add_child(node);
    }

    return timer;
};

plane.pause = function() {
    Engine.paused = true;
};

plane.resume = function() {
    Engine.paused = false;
};

plane.set_time_scale = function(scale) {
    Engine.time_scale = scale;
};

plane.get_time_scale = function() {
    return Engine.time_scale;
};

plane.get_tree = function() {
    return this._main_loop;
};

plane.reload_current_scene = function() {
    if (this._main_loop && this._main_loop.reload_current_scene) {
        this._main_loop.reload_current_scene();
    }
};

plane.change_scene = function(scene) {
    if (this._main_loop && this._main_loop.change_scene) {
        this._main_loop.change_scene(scene);
    }
};

global_events.emit("plane_initialized");

export default plane;
export { plane };