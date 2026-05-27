class Particle2D extends Node2D {
    static EMISSION_SHAPE_POINT = 0;
    static EMISSION_SHAPE_CIRCLE = 1;
    static EMISSION_SHAPE_RECTANGLE = 2;

    static DIRECTION_FIXED = 0;
    static DIRECTION_VELOCITY = 1;
    static DIRECTION_GRAVITY = 2;

    constructor() {
        super();
        this.name = "Particle2D";
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
        this._texture = null;
        this._emission_shape = Particle2D.EMISSION_SHAPE_POINT;
        this._emission_shape_radius = 0;
        this._emission_interval = 0.01;
        this._emission_timer = 0;
        this._local_coords = false;
        this._one_shot = false;
        this._continuous = true;
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
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 100
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
            color: new Color(1, 1, 1, 1)
        };
    }

    _process(dt) {
        super._process(dt);

        if (this._emitting && this._continuous && this._particles.length < this._amount) {
            this._emission_timer += dt;
            while (this._emission_timer >= this._emission_interval) {
                this._emission_timer -= this._emission_interval;
                this._emit(1);
            }
        }

        this._particles = this._particles.filter(p => p.lifetime > 0);

        for (const particle of this._particles) {
            particle.lifetime -= dt;

            particle.velocity = particle.velocity.add(this._gravity.multiply(dt));

            const radial_dir = particle.position.length() > 0 ? particle.position.normalized() : new Vector2(0, 0);
            particle.velocity = particle.velocity.add(radial_dir.multiply(this._radial_accel * dt));

            const tangential_dir = new Vector2(-radial_dir.y, radial_dir.x);
            particle.velocity = particle.velocity.add(tangential_dir.multiply(this._tangential_accel * dt));

            particle.velocity = particle.velocity.multiply(1 - this._damping * dt);

            particle.position = particle.position.add(particle.velocity.multiply(dt));

            particle.angle += particle.rotate_speed * dt;

            const t = 1 - particle.lifetime / particle.max_lifetime;
            particle.color.a = 1 - t;
        }
    }

    draw(ctx, transform) {
        ctx.save();
        ctx.transform(
            transform._matrix[0][0],
            transform._matrix[1][0],
            transform._matrix[0][1],
            transform._matrix[1][1],
            transform.position.x,
            transform.position.y
        );

        for (const particle of this._particles) {
            ctx.save();
            ctx.translate(particle.position.x, particle.position.y);
            ctx.rotate(particle.angle);
            ctx.scale(particle.scale, particle.scale);
            ctx.globalAlpha = particle.color.a;

            if (this._texture) {
                ctx.drawImage(this._texture, -this._texture.width / 2, -this._texture.height / 2);
            } else {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(-4, -4, 8, 8);
            }

            ctx.restore();
        }

        ctx.restore();
    }

    get_active_particles() {
        return this._particles.length;
    }
}

plane.Particle2D = Particle2D;