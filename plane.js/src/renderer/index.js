class Renderer {
    static BLEND_MODE_NORMAL = 0;
    static BLEND_MODE_ADD = 1;
    static BLEND_MODE_MULTIPLY = 2;
    static BLEND_MODE_SCREEN = 3;

    static FILTER_NEAREST = 0;
    static FILTER_LINEAR = 1;

    constructor() {
        this._canvas = null;
        this._ctx = null;
        this._viewport = null;
        this._layers = {};
        this._layer_order = [];
        this._clear_color = new Color(0, 0, 0, 1);
        this._draw_paused = false;
        this._current_camera = null;
        this._debug_draw = false;
        this._blend_mode = Renderer.BLEND_MODE_NORMAL;
        this._filter = Renderer.FILTER_LINEAR;
        this._width = 1920;
        this._height = 1080;
    }

    get canvas() { return this._canvas; }
    get ctx() { return this._ctx; }
    get viewport() { return this._viewport; }
    get clear_color() { return this._clear_color.clone(); }
    get width() { return this._width; }
    get height() { return this._height; }

    set clear_color(value) { this._clear_color = value.clone(); }
    set width(value) { this._width = value; if (this._canvas) this._canvas.width = value; }
    set height(value) { this._height = value; if (this._canvas) this._canvas.height = value; }

    _setup(canvas) {
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        this._width = canvas.width;
        this._height = canvas.height;
        this._ctx.imageSmoothingEnabled = this._filter === Renderer.FILTER_LINEAR;
    }

    set_viewport(viewport) {
        this._viewport = viewport;
    }

    set_camera(camera) {
        this._current_camera = camera;
    }

    set_layer_order(order) {
        this._layer_order = order;
    }

    add_layer(name, z_index = 0) {
        if (!this._layers[name]) {
            this._layers[name] = { z_index, items: [] };
            this._layer_order.push(name);
            this._layer_order.sort((a, b) => this._layers[a].z_index - this._layers[b].z_index);
        }
    }

    remove_layer(name) {
        delete this._layers[name];
        const idx = this._layer_order.indexOf(name);
        if (idx !== -1) this._layer_order.splice(idx, 1);
    }

    add_to_layer(name, item) {
        if (this._layers[name]) {
            this._layers[name].items.push(item);
        }
    }

    clear_layer(name) {
        if (this._layers[name]) {
            this._layers[name].items = [];
        }
    }

    clear() {
        this._ctx.fillStyle = this._clear_color.to_rgba();
        this._ctx.fillRect(0, 0, this._width, this._height);
    }

    begin_frame() {
        this.clear();
        if (this._current_camera) {
            this._apply_camera_transform();
        }
    }

    end_frame() {
        if (this._current_camera) {
            this._ctx.restore();
        }
    }

    _apply_camera_transform() {
        if (!this._current_camera || !this._viewport) return;

        const camera = this._current_camera;
        const viewport_size = this._viewport._size;

        this._ctx.save();
        this._ctx.translate(viewport_size.x / 2, viewport_size.y / 2);
        this._ctx.scale(camera._zoom.x, camera._zoom.y);
        this._ctx.rotate(camera._rotation);
        this._ctx.translate(-camera._position.x, -camera._position.y);
    }

    draw_node(node) {
        if (!node || !node._visible) return;

        const transform = node._get_global_transform();

        this._ctx.save();
        this._ctx.transform(
            transform._matrix[0][0],
            transform._matrix[1][0],
            transform._matrix[0][1],
            transform._matrix[1][1],
            transform.position.x,
            transform.position.y
        );

        if (node.draw) {
            node.draw(this._ctx, transform);
        }

        for (const child of node._children) {
            this.draw_node(child);
        }

        this._ctx.restore();
    }

    draw_rect(rect, color, fill = true) {
        this._ctx.fillStyle = color.to_rgba();
        if (fill) {
            this._ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this._ctx.strokeStyle = color.to_rgba();
            this._ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        }
    }

    draw_circle(position, radius, color, fill = true) {
        this._ctx.beginPath();
        this._ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
        if (fill) {
            this._ctx.fillStyle = color.to_rgba();
            this._ctx.fill();
        } else {
            this._ctx.strokeStyle = color.to_rgba();
            this._ctx.stroke();
        }
    }

    draw_line(from, to, color, width = 1) {
        this._ctx.beginPath();
        this._ctx.strokeStyle = color.to_rgba();
        this._ctx.lineWidth = width;
        this._ctx.moveTo(from.x, from.y);
        this._ctx.lineTo(to.x, to.y);
        this._ctx.stroke();
    }

    draw_text(text, position, color, font_size = 16, align = 'left') {
        this._ctx.fillStyle = color.to_rgba();
        this._ctx.font = `${font_size}px sans-serif`;
        this._ctx.textAlign = align;
        this._ctx.textBaseline = 'top';
        this._ctx.fillText(text, position.x, position.y);
    }

    draw_image(image, position, size = null) {
        if (size) {
            this._ctx.drawImage(image, position.x, position.y, size.x, size.y);
        } else {
            this._ctx.drawImage(image, position.x, position.y);
        }
    }

    set_blend_mode(mode) {
        this._blend_mode = mode;
        switch (mode) {
            case Renderer.BLEND_MODE_NORMAL:
                this._ctx.globalCompositeOperation = 'source-over';
                break;
            case Renderer.BLEND_MODE_ADD:
                this._ctx.globalCompositeOperation = 'lighter';
                break;
            case Renderer.BLEND_MODE_MULTIPLY:
                this._ctx.globalCompositeOperation = 'multiply';
                break;
            case Renderer.BLEND_MODE_SCREEN:
                this._ctx.globalCompositeOperation = 'screen';
                break;
        }
    }

    set_filter(filter) {
        this._filter = filter;
        this._ctx.imageSmoothingEnabled = filter === Renderer.FILTER_LINEAR;
    }

    render_layers() {
        for (const layer_name of this._layer_order) {
            const layer = this._layers[layer_name];
            for (const item of layer.items) {
                this.draw_node(item);
            }
        }
    }

    _debug_draw_node(node) {
        if (!this._debug_draw) return;

        const rect = node.get_rect ? node.get_rect() : new Rect2(0, 0, 10, 10);
        const global_pos = node._get_global_position();

        this._ctx.strokeStyle = '#FF0000';
        this._ctx.strokeRect(global_pos.x + rect.x, global_pos.y + rect.y, rect.width, rect.height);

        this._ctx.fillStyle = '#00FF00';
        this._ctx.beginPath();
        this._ctx.arc(global_pos.x, global_pos.y, 3, 0, Math.PI * 2);
        this._ctx.fill();
    }

    set_debug_draw(enabled) {
        this._debug_draw = enabled;
    }
}

class RenderServer {
    static CANVAS_ITEM_VISIBILITY_INHERIT = 0;
    static CANVAS_ITEM_VISIBILITY_VISIBLE = 1;
    static CANVAS_ITEM_VISIBILITY_HIDDEN = 2;

    static CANVAS_ITEM_UPDATE_INVALIDATE = 0;
    static CANVAS_ITEM_UPDATE_THROTTLE = 1;

    static LIGHT_MASK_MAX = 32;
    static CANVAS_ITEM_LAYER_MAX = 32;

    static BLEND_MODE_MIX = 0;
    static BLEND_MODE_ADD = 1;
    static BLEND_MODE_SUB = 2;
    static BLEND_MODE_MUL = 3;
    static BLEND_MODE_PREMULT_ALPHA = 4;
    static BLEND_MODE_DISABLED = 5;

    static LIGHT_TYPE_DIRECTIONAL = 0;
    static LIGHT_TYPE_OMNI = 1;
    static LIGHT_TYPE_SPOT = 2;

    static SHADER_MODE_SPRITE = 0;
    static SHADER_MODE_CANVAS_ITEM = 1;
    static SHADER_MODE_PARTICLES = 2;

    constructor() {
        this._default_canvas = null;
        this._default_canvas_size = new Vector2(1920, 1080);
        this._canvas_viewport_count = 0;
        this._canvas_render_target_count = 0;
        this._canvas_usage_count = 0;
        this._canvas_lightmap_count = 0;
        this._viewport_to_canvas = {};
        this._viewport_to_canvas_id = {};
        this._current_canvas = null;
        this._canvas_data = {};
        this._canvas_items = {};
        this._canvas_lights = {};
        this._canvas_materials = {};
        this._canvas_textures = {};
        this._canvas_shaders = {};
        this._canvas_cameras = {};
        this._frame_number = 0;
        this._time = 0;
        this._paused = false;
        this._debug_draw_enabled = false;
        this._debug_draw_colors = {};
    }

    static get_singleton() {
        if (!RenderServer._instance) {
            RenderServer._instance = new RenderServer();
        }
        return RenderServer._instance;
    }

    set_default_canvas(canvas) {
        this._default_canvas = canvas;
    }

    get_default_canvas() {
        return this._default_canvas;
    }

    set_canvas_size(width, height) {
        this._default_canvas_size = new Vector2(width, height);
    }

    get_canvas_size() {
        return this._default_canvas_size.clone();
    }

    canvas_clear(canvas_id) {
        const canvas = this._canvas_data[canvas_id];
        if (canvas && canvas.ctx) {
            canvas.ctx.fillStyle = '#000000';
            canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    canvas_begin_frame(canvas_id) {
        this._current_canvas = canvas_id;
    }

    canvas_end_frame() {
        this._current_canvas = null;
    }

    canvas_add_item(canvas_id, item) {
        if (!this._canvas_items[canvas_id]) {
            this._canvas_items[canvas_id] = [];
        }
        this._canvas_items[canvas_id].push(item);
    }

    canvas_remove_item(canvas_id, item) {
        if (this._canvas_items[canvas_id]) {
            const idx = this._canvas_items[canvas_id].indexOf(item);
            if (idx !== -1) {
                this._canvas_items[canvas_id].splice(idx, 1);
            }
        }
    }

    canvas_draw_items(canvas_id) {
        const items = this._canvas_items[canvas_id];
        if (!items) return;

        const canvas = this._canvas_data[canvas_id];
        if (!canvas || !canvas.ctx) return;

        items.sort((a, b) => a.z_index - b.z_index);

        for (const item of items) {
            if (item.draw) {
                item.draw(canvas.ctx);
            }
        }
    }

    canvas_set_transform(canvas_id, transform) {
        const canvas = this._canvas_data[canvas_id];
        if (canvas && canvas.ctx) {
            canvas.ctx.setTransform(
                transform._matrix[0][0],
                transform._matrix[1][0],
                transform._matrix[0][1],
                transform._matrix[1][1],
                transform.position.x,
                transform.position.y
            );
        }
    }

    canvas_draw_text(canvas_id, text, position, color, font_size) {
        const canvas = this._canvas_data[canvas_id];
        if (canvas && canvas.ctx) {
            canvas.ctx.fillStyle = color.to_rgba();
            canvas.ctx.font = `${font_size}px sans-serif`;
            canvas.ctx.fillText(text, position.x, position.y);
        }
    }

    canvas_draw_rect(canvas_id, rect, color) {
        const canvas = this._canvas_data[canvas_id];
        if (canvas && canvas.ctx) {
            canvas.ctx.fillStyle = color.to_rgba();
            canvas.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        }
    }

    canvas_draw_circle(canvas_id, position, radius, color) {
        const canvas = this._canvas_data[canvas_id];
        if (canvas && canvas.ctx) {
            canvas.ctx.beginPath();
            canvas.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
            canvas.ctx.fillStyle = color.to_rgba();
            canvas.ctx.fill();
        }
    }

    canvas_draw_line(canvas_id, from, to, color) {
        const canvas = this._canvas_data[canvas_id];
        if (canvas && canvas.ctx) {
            canvas.ctx.beginPath();
            canvas.ctx.strokeStyle = color.to_rgba();
            canvas.ctx.moveTo(from.x, from.y);
            canvas.ctx.lineTo(to.x, to.y);
            canvas.ctx.stroke();
        }
    }
}

RenderServer._instance = null;

plane.Renderer = Renderer;
plane.RenderServer = RenderServer;