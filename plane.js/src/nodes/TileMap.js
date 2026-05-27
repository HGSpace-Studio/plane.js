class TileSet {
    static FLIP_X = 1;
    static FLIP_Y = 2;
    static TRANSPOSE = 4;

    constructor() {
        this._texture = null;
        this._tile_size = new Vector2(32, 32);
        this._tile_origin = new Vector2(0, 0);
        this._tile_count = 0;
        this._tile_data = {};
        this._custom_data = [];
    }

    get texture() { return this._texture; }
    get tile_size() { return this._tile_size.clone(); }
    get tile_origin() { return this._tile_origin.clone(); }

    set texture(value) { this._texture = value; }
    set tile_size(value) { this._tile_size = value.clone(); }
    set tile_origin(value) { this._tile_origin = value.clone(); }

    _get_tile_rect(tile_id) {
        const tiles_per_row = Math.floor(this._texture.width / this._tile_size.x);
        const col = tile_id % tiles_per_row;
        const row = Math.floor(tile_id / tiles_per_row);
        return new Rect2(
            col * this._tile_size.x,
            row * this._tile_size.y,
            this._tile_size.x,
            this._tile_size.y
        );
    }

    get_tile_texture_region(tile_id) {
        return this._get_tile_rect(tile_id);
    }

    has_tile(tile_id) {
        return tile_id >= 0 && tile_id < this._tile_count;
    }

    set_tile_count(count) {
        this._tile_count = count;
    }

    get_tile_count() {
        return this._tile_count;
    }
}

class TileMap extends Node2D {
    constructor() {
        super();
        this.name = "TileMap";
        this._tile_set = null;
        this._cell_size = new Vector2(32, 32);
        this._cell_origin = new Vector2(0, 0);
        this._tile_size = new Vector2(32, 32);
        this._layers = [];
        this._current_layer = 0;
        this._collision_layer = 1;
        this._collision_mask = 1;
    }

    get tile_set() { return this._tile_set; }
    get cell_size() { return this._cell_size.clone(); }
    get cell_origin() { return this._cell_origin.clone(); }
    get tile_size() { return this._tile_size.clone(); }

    set tile_set(value) { this._tile_set = value; }
    set cell_size(value) { this._cell_size = value.clone(); }
    set cell_origin(value) { this._cell_origin = value.clone(); }
    set tile_size(value) { this._tile_size = value.clone(); }

    add_layer() {
        this._layers.push({
            data: [],
            offset: new Vector2(0, 0),
            tile_set: this._tile_set,
            visible: true,
            z_index: this._layers.length
        });
    }

    remove_layer(index) {
        if (index >= 0 && index < this._layers.length) {
            this._layers.splice(index, 1);
        }
    }

    set_cell(layer_id, x, y, tile_id, flip_h = false, flip_v = false, transpose = false) {
        if (!this._layers[layer_id]) {
            this._layers[layer_id] = { data: {}, offset: new Vector2(0, 0) };
        }
        const key = `${x},${y}`;
        this._layers[layer_id].data[key] = {
            tile_id,
            flip_h,
            flip_v,
            transpose
        };
    }

    get_cell(layer_id, x, y) {
        if (!this._layers[layer_id]) return null;
        const key = `${x},${y}`;
        return this._layers[layer_id].data[key] || null;
    }

    clear_cell(layer_id, x, y) {
        if (!this._layers[layer_id]) return;
        const key = `${x},${y}`;
        delete this._layers[layer_id].data[key];
    }

    _get_cell_position(x, y) {
        return new Vector2(
            x * this._cell_size.x + this._cell_origin.x,
            y * this._cell_size.y + this._cell_origin.y
        );
    }

    _get_cell_at_position(pos) {
        return new Vector2(
            Math.floor((pos.x - this._cell_origin.x) / this._cell_size.x),
            Math.floor((pos.y - this._cell_origin.y) / this._cell_size.y)
        );
    }

    draw(ctx, transform) {
        if (!this._tile_set || !this._tile_set._texture) return;

        ctx.save();
        ctx.transform(
            transform._matrix[0][0],
            transform._matrix[1][0],
            transform._matrix[0][1],
            transform._matrix[1][1],
            transform.position.x,
            transform.position.y
        );

        for (const layer of this._layers) {
            if (!layer.visible) continue;

            for (const key in layer.data) {
                const parts = key.split(',');
                const x = parseInt(parts[0]);
                const y = parseInt(parts[1]);
                const cell_data = layer.data[key];

                if (!cell_data || cell_data.tile_id < 0) continue;

                const pos = this._get_cell_position(x, y);
                const tile_rect = layer.tile_set._get_tile_rect(cell_data.tile_id);

                ctx.save();

                if (cell_data.flip_h) {
                    ctx.translate(this._cell_size.x, 0);
                    ctx.scale(-1, 1);
                }
                if (cell_data.flip_v) {
                    ctx.translate(0, this._cell_size.y);
                    ctx.scale(1, -1);
                }

                ctx.drawImage(
                    layer.tile_set._texture,
                    tile_rect.x, tile_rect.y,
                    tile_rect.width, tile_rect.height,
                    pos.x, pos.y,
                    this._cell_size.x, this._cell_size.y
                );

                ctx.restore();
            }
        }

        ctx.restore();
    }

    get_layer_count() {
        return this._layers.length;
    }
}

plane.TileSet = TileSet;
plane.TileMap = TileMap;