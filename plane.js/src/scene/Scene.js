class Scene {
    constructor() {
        this._root_node = new Node();
        this._name = "Scene";
        this._path = "";
        this._loaded = false;
        this._active = false;
    }

    get root_node() { return this._root_node; }
    get name() { return this._name; }
    get path() { return this._path; }
    get loaded() { return this._loaded; }
    get active() { return this._active; }

    set name(value) { this._name = value; }
    set path(value) { this._path = value; }
    set active(value) { this._active = value; }

    load() {
        this._loaded = true;
        this._root_node._enter_tree();
    }

    unload() {
        this._root_node._exit_tree();
        this._loaded = false;
        this._active = false;
    }

    add_child(node) {
        this._root_node.add_child(node);
    }

    remove_child(node) {
        this._root_node.remove_child(node);
    }

    find_node(name, recursive = true, owned_only = true) {
        return this._root_node.find_node(name, recursive, owned_only);
    }

    get_node(path) {
        return this._root_node.get_node(path);
    }

    _process(dt) {
        if (this._loaded && this._active) {
            this._root_node._process(dt);
        }
    }

    _physics_process(dt) {
        if (this._loaded && this._active) {
            this._root_node._physics_process(dt);
        }
    }
}

class Viewport extends Node2D {
    constructor() {
        super();
        this.name = "Viewport";
        this._canvas = null;
        this._renderer = null;
        this._world_2d = null;
        this._camera = null;
        this._size = new Vector2(800, 600);
        this._transparent_background = false;
        this._clear_color = new Color(0.1, 0.1, 0.15, 1);
        this._render_target = null;
        this._screen_rect = new Rect2(0, 0, 800, 600);
        this._stretch_mode = 0;
        this._stretch_aspect = 0;
        this._visible = true;
    }

    get canvas() { return this._canvas; }
    get renderer() { return this._renderer; }
    get world_2d() { return this._world_2d; }
    get camera() { return this._camera; }
    get size() { return this._size.clone(); }
    get transparent_background() { return this._transparent_background; }
    get clear_color() { return this._clear_color.clone(); }

    set camera(value) { this._camera = value; }
    set size(value) { this._size = value.clone(); }
    set transparent_background(value) { this._transparent_background = value; }
    set clear_color(value) { this._clear_color = value.clone(); }

    _setup_canvas() {
        this._canvas = document.createElement('canvas');
        this._canvas.id = 'plane-canvas';
        this._canvas.width = this._size.x;
        this._canvas.height = this._size.y;
        this._canvas.style.display = 'block';
        document.body.appendChild(this._canvas);

        this._renderer = new Renderer(this._canvas);
        this._renderer.clear_color = this._clear_color;
    }

    _ready() {
        super._ready();
        if (!this._world_2d) {
            this._world_2d = new World2D();
        }
    }

    _process(dt) {
        super._process(dt);

        if (!this._renderer || !this._visible) return;

        this._renderer.clear_color = this._clear_color;
        this._renderer.begin_frame();

        if (this._camera) {
            this._renderer.camera = this._camera;
        }

        this._draw_tree(this, this._renderer._ctx);

        this._renderer.end_frame();
    }

    _draw_tree(node, ctx) {
        if (!node._visible) return;

        if (typeof node.draw === 'function') {
            ctx.save();
            ctx.translate(node._position.x, node._position.y);
            ctx.rotate(node._rotation);
            ctx.scale(node._scale.x, node._scale.y);
            node.draw(ctx, node._transform);
            ctx.restore();
        }

        for (const child of node._children) {
            this._draw_tree(child, ctx);
        }
    }

    set_camera(camera) {
        this._camera = camera;
        if (this._renderer) {
            this._renderer.camera = camera;
        }
    }

    get_camera() {
        return this._camera;
    }

    resize(width, height) {
        this._size = new Vector2(width, height);
        if (this._canvas) {
            this._canvas.width = width;
            this._canvas.height = height;
        }
        if (this._renderer) {
            this._renderer.resize(width, height);
        }
    }
}

class World2D {
    constructor() {
        this._physics_space = null;
        this._navigation_map = null;
        this._layers = [];
        this._layer_count = 32;
        this._physics_direct_space_state = null;
    }

    get physics_space() { return this._physics_space; }
    get navigation_map() { return this._navigation_map; }
    get layer_count() { return this._layer_count; }

    set physics_space(value) { this._physics_space = value; }
    set navigation_map(value) { this._navigation_map = value; }

    get_direct_space_state() {
        if (!this._physics_direct_space_state) {
            this._physics_direct_space_state = new PhysicsDirectSpaceState2D();
        }
        return this._physics_direct_space_state;
    }

    set_layer_name(layer, name) {
        if (layer >= 0 && layer < this._layer_count) {
            if (!this._layers[layer]) {
                this._layers[layer] = {};
            }
            this._layers[layer].name = name;
        }
    }

    get_layer_name(layer) {
        return this._layers[layer] ? this._layers[layer].name : "";
    }
}

class PhysicsDirectSpaceState2D {
    constructor() {
        this._manager = Physics2DManager.get_singleton();
    }

    intersect_point(position, collision_mask = 1) {
        const results = [];
        for (const body of this._manager._bodies) {
            if (!body._active) continue;
            if ((body._collision_mask & collision_mask) === 0) continue;

            const collision = this._manager._test_collision_point(position, body);
            if (collision) {
                results.push(collision);
            }
        }
        return results;
    }

    intersect_shape(shape, transform, collision_mask = 1) {
        const results = [];
        for (const body of this._manager._bodies) {
            if (!body._active) continue;
            if ((body._collision_mask & collision_mask) === 0) continue;

            const collision = this._manager._test_collision_shape(shape, transform, body);
            if (collision) {
                results.push(collision);
            }
        }
        return results;
    }

    cast_motion(shape, start, end, collision_mask = 1) {
        const motion = end.subtract(start);
        const results = [];

        for (const body of this._manager._bodies) {
            if (!body._active) continue;
            if ((body._collision_mask & collision_mask) === 0) continue;

            const collision = this._manager._test_motion(shape, start, motion, body);
            if (collision) {
                collision.position = start.add(motion.multiply(collision.fraction));
                results.push(collision);
            }
        }

        results.sort((a, b) => a.fraction - b.fraction);
        return results;
    }

    get_rest_info(shape, transform, collision_mask = 1) {
        for (const body of this._manager._bodies) {
            if (!body._active) continue;
            if ((body._collision_mask & collision_mask) === 0) continue;

            const collision = this._manager._test_collision_shape(shape, transform, body);
            if (collision) {
                return collision;
            }
        }
        return null;
    }
}

plane.Scene = Scene;
plane.Viewport = Viewport;
plane.World2D = World2D;
plane.PhysicsDirectSpaceState2D = PhysicsDirectSpaceState2D;