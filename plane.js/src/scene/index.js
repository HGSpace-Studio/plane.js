class Viewport extends Node {
    static SIZE_2D = 0;
    static SIZE_2D_NO_SAMPLING = 1;
    static SIZE_3D = 2;
    static SIZE_3D_NO_SAMPLING = 3;

    static UPDATE_DISABLED = 0;
    static UPDATE_ONCE = 1;
    static UPDATE_WHEN_PAUSED = 2;
    static UPDATE_ALWAYS = 3;

    static TRANSPARENT_BG_DISABLED = 0;
    static TRANSPARENT_BG_ENABLED = 1;

    constructor() {
        super();
        this._size = new Vector2(1920, 1080);
        this._size_override_stretch = false;
        this._size_override_for_world_2d = false;
        this._aspect = Viewport.SIZE_2D;
        this._render_target_update_mode = Viewport.UPDATE_ALWAYS;
        this._render_target_v flip = false;
        this._render_target_clear_MODE = 0;
        this._physics_object_picking = false;
        this._world_2d = null;
        this._canvas = null;
        this._ctx = null;
        this._transparent_bg = Viewport.TRANSPARENT_BG_DISABLED;
        this._gui_embed_subwindows = false;
        this._debug_draw = 0;
        this._size_propagation = true;
        this._audio_listener = true;
        this._default_cursor = null;
        this._current_camera = null;
        this._render_callbacks = [];
    }

    get size() { return this._size.clone(); }
    get canvas() { return this._canvas; }
    get ctx() { return this._ctx; }
    get world_2d() { return this._world_2d; }
    get transparent_bg() { return this._transparent_bg; }
    get physics_object_picking() { return this._physics_object_picking; }

    set size(value) {
        this._size = value.clone();
        if (this._canvas) {
            this._canvas.width = this._size.x;
            this._canvas.height = this._size.y;
        }
    }

    set transparent_bg(value) {
        this._transparent_bg = value;
    }

    set physics_object_picking(value) {
        this._physics_object_picking = value;
    }

    _enter_tree() {
        super._enter_tree();
        this._setup_canvas();
    }

    _setup_canvas() {
        this._canvas = document.createElement('canvas');
        this._canvas.width = this._size.x;
        this._canvas.height = this._size.y;
        this._canvas.style.position = 'absolute';
        this._canvas.style.left = '0px';
        this._canvas.style.top = '0px';
        document.body.appendChild(this._canvas);
        this._ctx = this._canvas.getContext('2d');
        this._ctx.imageSmoothingEnabled = true;
        this._ctx.imageSmoothingQuality = 'high';
    }

    get_viewport_rect() {
        return new Rect2(0, 0, this._size.x, this._size.y);
    }

    get_visible_rect() {
        return new Rect2(0, 0, this._size.x, this._size.y);
    }

    get_mouse_position() {
        return this._mouse_pos ? this._mouse_pos.clone() : new Vector2();
    }

    get_viewport_transform() {
        return new Transform2D(0, new Vector2());
    }

    get_final_transform() {
        return this.get_viewport_transform();
    }

    get_canvas_transform() {
        return new Transform2D(0, new Vector2());
    }

    set_as_render_target(enable) {
        if (enable && !this._render_target) {
            this._render_target = document.createElement('canvas');
            this._render_target.width = this._size.x;
            this._render_target.height = this._size.y;
            this._render_target_ctx = this._render_target.getContext('2d');
        }
    }

    get_render_target_texture() {
        return this._render_target;
    }

    add_render_callback(callback) {
        this._render_callbacks.push(callback);
    }

    _render(dt) {
        if (!this._ctx) return;
        if (this._transparent_bg === Viewport.TRANSPARENT_BG_DISABLED) {
            this._ctx.fillStyle = '#000000';
            this._ctx.fillRect(0, 0, this._size.x, this._size.y);
        }
        for (const callback of this._render_callbacks) {
            callback(this._ctx, dt);
        }
    }

    input(event) {
        this._input(event);
    }

    _input(event) {
        this.emit("input", event);
    }

    set_current_camera(camera) {
        this._current_camera = camera;
    }

    get_current_camera() {
        return this._current_camera;
    }
}

class World2D {
    constructor() {
        this._canvas = null;
        this._ctx = null;
        this._layers = {};
        this._default_layer = 1;
        this._sorted_nodes = [];
    }

    get canvas() { return this._canvas; }
    get ctx() { return this._ctx; }

    set_default_layer(layer) {
        this._default_layer = layer;
    }

    get_default_layer() {
        return this._default_layer;
    }

    add_node_to_layer(node, layer = 1) {
        if (!this._layers[layer]) {
            this._layers[layer] = [];
        }
        if (!this._layers[layer].includes(node)) {
            this._layers[layer].push(node);
            this._resort_nodes();
        }
    }

    remove_node_from_layer(node, layer = 1) {
        if (this._layers[layer]) {
            const idx = this._layers[layer].indexOf(node);
            if (idx !== -1) {
                this._layers[layer].splice(idx, 1);
            }
        }
    }

    _resort_nodes() {
        this._sorted_nodes = [];
        const layers = Object.keys(this._layers).sort((a, b) => parseInt(a) - parseInt(b));
        for (const layer of layers) {
            const layer_nodes = this._layers[layer].slice();
            layer_nodes.sort((a, b) => a.z_index - b.z_index);
            this._sorted_nodes.push(...layer_nodes);
        }
    }

    get_sorted_nodes() {
        return this._sorted_nodes.slice();
    }
}

class SceneTree extends Node {
    static TIMER_SLOT_SCALE_MODE_COUNT = 3;

    constructor() {
        super();
        this._root_viewport = null;
        this._current_scene = null;
        this._paused = false;
        this._input_event_count = 0;
        this._notification_count = 0;
        this._timer_pool = [];
    }

    get root_viewport() { return this._root_viewport; }
    get paused() { return this._paused; }

    set paused(value) {
        this._paused = value;
        Engine.paused = value;
    }

    _enter_tree() {
        super._enter_tree();
        this._root_viewport = new Viewport();
        this._root_viewport._scene_tree = this;
        this.add_child(this._root_viewport);
        Engine.set_root_node(this);
    }

    _ready() {
        super._ready();
        global_events.emit("scene_tree_ready");
    }

    _process(dt) {
        this._process_input();
        this._notification(Node.NOTIFICATION_PROCESS);
    }

    _physics_process(dt) {
        this._notification(Node.NOTIFICATION_PHYSICS_PROCESS);
    }

    _notification(code) {
        super._notification(code);
        if (code === Node.NOTIFICATION_PROCESS || code === Node.NOTIFICATION_PHYSICS_PROCESS) {
            for (const child of this._children) {
                if (child === this._root_viewport) continue;
                if (child._notification) {
                    child._notification(code);
                }
            }
        }
    }

    _process_input() {
        for (const child of this._children) {
            if (child === this._root_viewport) continue;
            if (child._set_input) {
                child._set_input(Engine.last_input_event);
            }
        }
    }

    get_root() {
        return this._root_viewport;
    }

    get_current_scene() {
        return this._current_scene;
    }

    change_scene(scene) {
        if (this._current_scene) {
            this._current_scene._exit_tree();
            this.remove_child(this._current_scene);
        }
        this._current_scene = scene;
        if (scene) {
            this.add_child(scene);
            scene._enter_tree();
            scene.notification(Node.NOTIFICATION_READY);
        }
    }

    reload_current_scene() {
        if (this._current_scene) {
            const path = this._current_scene._filename;
            this.change_scene(null);
            if (path) {
                this.load_scene(path);
            }
        }
    }

    load_scene(path) {
        return new Promise((resolve, reject) => {
            console.log(`Loading scene from ${path}`);
            resolve();
        });
    }

    get_nodes_in_group(group) {
        return Engine.get_nodes_in_group(group);
    }

    queue_remove(node) {
        Engine.queue_free(node);
    }
}

plane.Viewport = Viewport;
plane.World2D = World2D;
plane.SceneTree = SceneTree;