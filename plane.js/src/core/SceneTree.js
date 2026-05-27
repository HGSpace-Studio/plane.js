class SceneTree extends Node {
    constructor() {
        super();
        this.name = "SceneTree";
        this._current_scene = null;
        this._root_viewport = null;
        this._auto_accept_quit = true;
        this._quit_on_go_back = false;
        this._paused = false;
        this._time_scale = 1;
        this._input_handled = false;
    }

    get current_scene() { return this._current_scene; }
    get root_viewport() { return this._root_viewport; }
    get paused() { return this._paused; }
    get time_scale() { return this._time_scale; }

    set paused(value) { this._paused = value; }
    set time_scale(value) { this._time_scale = value; }

    set_root_viewport(viewport) {
        this._root_viewport = viewport;
        this.add_child(viewport);
    }

    get_root_viewport() { return this._root_viewport; }

    change_scene(scene) {
        if (this._current_scene) {
            this._current_scene.queue_free();
        }
        this._current_scene = scene;
        this.add_child(scene);
    }

    reload_current_scene() {
        if (this._current_scene) {
            const scene = this._current_scene;
            this._current_scene = null;
            scene.queue_free();
            const new_scene = scene.duplicate();
            this.change_scene(new_scene);
        }
    }

    quit() {
        global_events.emit("quit_request");
    }

    set_auto_accept_quit(value) { this._auto_accept_quit = value; }
    set_quit_on_go_back(value) { this._quit_on_go_back = value; }

    _process(dt) {
        super._process(dt);
        global_events.emit("process_frame", dt);
    }

    _physics_process(dt) {
        super._physics_process(dt);
        global_events.emit("physics_frame", dt);
    }
}

plane.SceneTree = SceneTree;