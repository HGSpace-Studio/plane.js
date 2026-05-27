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
        this._format = 0;
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

    set_custom_data_layer_count(count) {
        while (this._custom_data.length < count) {
            this._custom_data.push({});
        }
        while (this._custom_data.length > count) {
            this._custom_data.pop();
        }
    }

    get_custom_data_layer_count() {
        return this._custom_data.length;
    }
}

class TileMap extends Node2D {
    static CELL_AUTO_TILE = 0;
    static CELL_TILE = 1;

    static LAYER_TYPE_TILE = 0;
    static LAYER_TYPE_AUTO_TILE = 1;
    static LAYER_TYPE_OBJECTS = 2;

    constructor() {
        super();
        this._tile_set = null;
        this._cell_size = new Vector2(32, 32);
        this._cell_origin = new Vector2(0, 0);
        this._tile_size = new Vector2(32, 32);
        this._layers = [];
        this._current_layer = 0;
        this._use_own_vertices = false;
        this._vertex_offset = new Vector2(0, 0);
        this._navigation_enabled = false;
        this._navigation_layer = 1;
        this._navigation_polygon_mode = 0;
        this._collision_layer = 1;
        this._collision_mask = 1;
        this._physics_body_mode = 0;
        this._physics_material = null;
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
            layer_type: TileMap.LAYER_TYPE_TILE,
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
            this._layers[layer_id] = { data: [], offset: new Vector2(0, 0) };
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
        ctx.transform(transform._matrix[0][0], transform._matrix[1][0], transform._matrix[0][1], transform._matrix[1][1], transform.position.x, transform.position.y);

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
                    ctx.scale(-1, 1);
                    ctx.translate(-this._cell_size.x, 0);
                }
                if (cell_data.flip_v) {
                    ctx.scale(1, -1);
                    ctx.translate(0, -this._cell_size.y);
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

class Particle2D extends Node2D {
    static EMISSION_SHAPE_POINT = 0;
    static EMISSION_SHAPE_CIRCLE = 1;
    static EMISSION_SHAPE_RECTANGLE = 2;
    static EMISSION_SHAPE_LINE = 3;

    static EMISSION_FILL_WEDGE = 0;
    static EMISSION_FILL_RECT = 1;

    static DIRECTION_FIXED = 0;
    static DIRECTION_VELOCITY = 1;
    static DIRECTION_GRAVITY = 2;

    constructor() {
        super();
        this._particles = [];
        this._emitting = false;
        this._amount = 100;
        this._lifetime = 1.0;
        this._lifetime_random = 0;
        this._speed = 100;
        this._speed_random = 0;
        this._direction = -Math.PI / 2;
        this._direction_random = 0;
        this._gravity = new Vector2(0, 980);
        this._radial_accel = 0;
        this._tangential_accel = 0;
        this._damping = 0;
        this._angle = 0;
        this._angle_random = 0;
        this._rotate_speed = 0;
        this._rotate_speed_random = 0;
        this._scale = 1;
        this._scale_random = 0;
        this._scale_over_lifetime = null;
        this._color_over_lifetime = null;
        this._texture = null;
        this._region_rect = new Rect2();
        this._emission_shape = Particle2D.EMISSION_SHAPE_POINT;
        this._emission_shape_radius = 0;
        this._emission_angle = Math.PI * 2;
        this._emission_fill_mode = Particle2D.EMISSION_FILL_WEDGE;
        this._direction_mode = Particle2D.DIRECTION_FIXED;
        this._custom_emit_callback = null;
        this._pre_process_callback = null;
        this._post_process_callback = null;
        this._emission_interval = 0.01;
        this._emission_timer = 0;
        this._local_coords = false;
        this._one_shot = false;
        this._explosiveness = 0;
        this._randomness = 0.5;
        this._continuous = true;
        this._active = true;
    }

    get emitting() { return this._emitting; }
    get amount() { return this._amount; }
    get lifetime() { return this._lifetime; }
    get speed() { return this._speed; }
    get direction() { return this._direction; }
    get gravity() { return this._gravity.clone(); }

    set emitting(value) { this._emitting = value; }
    set amount(value) { this._amount = value; }
    set lifetime(value) { this._lifetime = value; }
    set speed(value) { this._speed = value; }
    set direction(value) { this._direction = value; }
    set gravity(value) { this._gravity = value.clone(); }

    _ready() {
        super._ready();
        if (this._emitting) {
            this.start_emitting();
        }
    }

    start_emitting() {
        this._emitting = true;
        this._emission_timer = 0;
    }

    stop_emitting() {
        this._emitting = false;
    }

    clear() {
        this._particles = [];
    }

    _emit(count = 1) {
        for (let i = 0; i < count; i++) {
            const particle = this._create_particle();
            if (particle) {
                this._particles.push(particle);
            }
        }
    }

    _create_particle() {
        const lifetime = this._lifetime + (Math.random() - 0.5) * this._lifetime_random * 2;
        if (lifetime <= 0) return null;

        let pos = new Vector2(0, 0);

        switch (this._emission_shape) {
            case Particle2D.EMISSION_SHAPE_POINT:
                pos = new Vector2(0, 0);
                break;
            case Particle2D.EMISSION_SHAPE_CIRCLE:
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * this._emission_shape_radius;
                pos = new Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius);
                break;
            case Particle2D.EMISSION_SHAPE_RECTANGLE:
                pos = new Vector2(
                    (Math.random() - 0.5) * this._region_rect.width,
                    (Math.random() - 0.5) * this._region_rect.height
                );
                break;
        }

        let direction = this._direction + (Math.random() - 0.5) * this._direction_random * 2;
        const speed = this._speed + (Math.random() - 0.5) * this._speed_random * 2;

        const vel = new Vector2(Math.cos(direction) * speed, Math.sin(direction) * speed);

        const angle = this._angle + (Math.random() - 0.5) * this._angle_random * 2;
        const rotate_speed = this._rotate_speed + (Math.random() - 0.5) * this._rotate_speed_random * 2;
        const scale = this._scale + (Math.random() - 0.5) * this._scale_random * 2;

        return {
            position: pos,
            velocity: vel,
            lifetime: lifetime,
            max_lifetime: lifetime,
            angle: angle,
            rotate_speed: rotate_speed,
            scale: scale,
            color: this._color_over_lifetime ? this._color_over_lifetime.clone() : new Color(1, 1, 1, 1)
        };
    }

    _process(dt) {
        super._process(dt);

        if (this._emitting && this._continuous) {
            this._emission_timer += dt;
            const interval = this._emission_interval * (1 - this._explosiveness);
            while (this._emission_timer >= interval) {
                this._emission_timer -= interval;
                this._emit(1);
            }
        }

        this._particles = this._particles.filter(p => p.lifetime > 0);

        for (const particle of this._particles) {
            particle.lifetime -= dt;

            const t = 1 - particle.lifetime / particle.max_lifetime;

            particle.velocity = particle.velocity.add(this._gravity.multiply(dt));

            const radial_dir = particle.position.normalized();
            particle.velocity = particle.velocity.add(radial_dir.multiply(this._radial_accel * dt));

            const tangential_dir = new Vector2(-radial_dir.y, radial_dir.x);
            particle.velocity = particle.velocity.add(tangential_dir.multiply(this._tangential_accel * dt));

            particle.velocity = particle.velocity.multiply(1 - this._damping * dt);

            particle.position = particle.position.add(particle.velocity.multiply(dt));

            particle.angle += particle.rotate_speed * dt;

            if (this._scale_over_lifetime) {
                particle.scale = this._scale * (1 - t * this._scale_over_lifetime);
            }

            if (this._color_over_lifetime) {
                particle.color = new Color(
                    particle.color.r,
                    particle.color.g,
                    particle.color.b,
                    1 - t
                );
            }
        }
    }

    draw(ctx, transform) {
        ctx.save();
        ctx.transform(transform._matrix[0][0], transform._matrix[1][0], transform._matrix[0][1], transform._matrix[1][1], transform.position.x, transform.position.y);

        for (const particle of this._particles) {
            ctx.save();
            ctx.translate(particle.position.x, particle.position.y);
            ctx.rotate(particle.angle);
            ctx.scale(particle.scale, particle.scale);
            ctx.globalAlpha = particle.color.a;

            if (this._texture) {
                ctx.drawImage(this._texture, -this._texture.width / 2, -this._texture.height / 2);
            } else {
                ctx.fillStyle = particle.color.to_rgba();
                ctx.fillRect(-4, -4, 8, 8);
            }

            ctx.restore();
        }

        ctx.restore();
    }

    get_active_particles() {
        return this._particles.length;
    }

    set_emission_shape(shape) {
        this._emission_shape = shape;
    }

    set_emission_shape_radius(radius) {
        this._emission_shape_radius = radius;
    }

    set_emission_rect(rect) {
        this._region_rect = rect.clone();
    }
}

class GDExtension {
    static TYPE_NONE = 0;
    static TYPE_OBJECT = 1;
    static TYPE_INT = 2;
    static TYPE_REAL = 3;
    static TYPE_STRING = 4;
    static TYPE_VECTOR2 = 5;
    static TYPE_RECT2 = 6;
    static TYPE_COLOR = 7;
    static TYPE_BOOL = 8;

    constructor() {
        this._extension = null;
        this._name = "";
        this._version = "1.0";
        this._initialization = null;
        this._deinitialization = null;
        this._api_major = 1;
        this._api_minor = 0;
    }

    initialize() {
        if (this._initialization) {
            this._initialization();
        }
    }

    deinitialize() {
        if (this._deinitialization) {
            this._deinitialization();
        }
    }

    get_name() {
        return this._name;
    }

    get_version() {
        return this._version;
    }
}

plane.TileSet = TileSet;
plane.TileMap = TileMap;
plane.Particle2D = Particle2D;
plane.GDExtension = GDExtension;