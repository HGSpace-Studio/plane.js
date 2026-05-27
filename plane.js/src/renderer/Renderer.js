class Renderer {
    constructor(canvas) {
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        this._width = canvas.width;
        this._height = canvas.height;
        this._layers = {};
        this._current_layer = 0;
        this._blend_mode = 'normal';
        this._filter_mode = 'nearest';
        this._clear_color = new Color(0, 0, 0, 1);
        this._viewport = new Rect2(0, 0, this._width, this._height);
        this._transform = new Transform2D();
        this._camera = null;
        this._target_fps = 60;
        this._frame_time = 0;
        this._batches = [];
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get clear_color() { return this._clear_color.clone(); }
    get blend_mode() { return this._blend_mode; }
    get filter_mode() { return this._filter_mode; }
    get viewport() { return this._viewport.clone(); }

    set clear_color(value) { this._clear_color = value.clone(); }
    set blend_mode(value) { this._blend_mode = value; }
    set filter_mode(value) { this._filter_mode = value; }
    set viewport(value) { this._viewport = value.clone(); }
    set camera(value) { this._camera = value; }

    _set_blend_mode(mode) {
        switch (mode) {
            case 'add': this._ctx.globalCompositeOperation = 'lighter'; break;
            case 'multiply': this._ctx.globalCompositeOperation = 'multiply'; break;
            case 'screen': this._ctx.globalCompositeOperation = 'screen'; break;
            default: this._ctx.globalCompositeOperation = 'source-over';
        }
    }

    _set_filter_mode(mode) {
        this._ctx.imageSmoothingEnabled = mode === 'linear';
    }

    clear() {
        this._ctx.fillStyle = this._clear_color.to_rgba();
        this._ctx.fillRect(0, 0, this._width, this._height);
    }

    begin_frame() {
        this.clear();
        this._ctx.save();
        if (this._camera) {
            const center = new Vector2(this._width / 2, this._height / 2);
            this._ctx.translate(center.x, center.y);
            this._ctx.scale(this._camera.zoom.x, this._camera.zoom.y);
            this._ctx.rotate(this._camera.rotation);
            this._ctx.translate(-this._camera.position.x, -this._camera.position.y);
        }
    }

    end_frame() {
        this._ctx.restore();
    }

    draw_rect(rect, color) {
        this._ctx.fillStyle = color.to_rgba();
        this._ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    draw_rect_outline(rect, color, line_width = 1) {
        this._ctx.strokeStyle = color.to_rgba();
        this._ctx.lineWidth = line_width;
        this._ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }

    draw_circle(center, radius, color) {
        this._ctx.fillStyle = color.to_rgba();
        this._ctx.beginPath();
        this._ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        this._ctx.fill();
    }

    draw_circle_outline(center, radius, color, line_width = 1) {
        this._ctx.strokeStyle = color.to_rgba();
        this._ctx.lineWidth = line_width;
        this._ctx.beginPath();
        this._ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        this._ctx.stroke();
    }

    draw_line(start, end, color, line_width = 1) {
        this._ctx.strokeStyle = color.to_rgba();
        this._ctx.lineWidth = line_width;
        this._ctx.beginPath();
        this._ctx.moveTo(start.x, start.y);
        this._ctx.lineTo(end.x, end.y);
        this._ctx.stroke();
    }

    draw_text(text, position, color, font_size = 16, font_family = 'sans-serif') {
        this._ctx.fillStyle = color.to_rgba();
        this._ctx.font = `${font_size}px ${font_family}`;
        this._ctx.fillText(text, position.x, position.y);
    }

    draw_image(image, position, scale = 1) {
        this._ctx.drawImage(image, position.x, position.y, image.width * scale, image.height * scale);
    }

    draw_image_part(image, src_rect, dest_pos, scale = 1) {
        this._ctx.drawImage(image, src_rect.x, src_rect.y, src_rect.width, src_rect.height, dest_pos.x, dest_pos.y, src_rect.width * scale, src_rect.height * scale);
    }

    draw_polygon(points, color) {
        if (points.length < 3) return;
        this._ctx.fillStyle = color.to_rgba();
        this._ctx.beginPath();
        this._ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this._ctx.lineTo(points[i].x, points[i].y);
        }
        this._ctx.closePath();
        this._ctx.fill();
    }

    draw_polyline(points, color, line_width = 1) {
        if (points.length < 2) return;
        this._ctx.strokeStyle = color.to_rgba();
        this._ctx.lineWidth = line_width;
        this._ctx.beginPath();
        this._ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this._ctx.lineTo(points[i].x, points[i].y);
        }
        this._ctx.stroke();
    }

    set_layer(layer) {
        this._current_layer = layer;
        if (!this._layers[layer]) {
            this._layers[layer] = [];
        }
    }

    get_layer(layer) {
        return this._layers[layer] || [];
    }

    add_to_batch(draw_call) {
        if (!this._layers[this._current_layer]) {
            this._layers[this._current_layer] = [];
        }
        this._layers[this._current_layer].push(draw_call);
    }

    flush_batches() {
        const layers = Object.keys(this._layers).map(Number).sort((a, b) => a - b);
        for (const layer of layers) {
            for (const call of this._layers[layer]) {
                call(this._ctx);
            }
            this._layers[layer] = [];
        }
    }

    resize(width, height) {
        this._width = width;
        this._height = height;
        this._canvas.width = width;
        this._canvas.height = height;
        this._viewport = new Rect2(0, 0, width, height);
    }

    set_transform(transform) {
        this._ctx.setTransform(
            transform._matrix[0][0],
            transform._matrix[1][0],
            transform._matrix[0][1],
            transform._matrix[1][1],
            transform.position.x,
            transform.position.y
        );
    }
}

plane.Renderer = Renderer;