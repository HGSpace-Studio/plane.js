class TextureRect extends Node2D {
    constructor() {
        super();
        this.name = "TextureRect";
        this._texture = null;
        this._rect = new Rect2(0, 0, 100, 100);
        this._flip_h = false;
        this._flip_v = false;
        this._tile_mode = 0;
        this._stretch_mode = 0;
        this._modulate = new Color(1, 1, 1, 1);
        this._visible = true;
    }

    get texture() { return this._texture; }
    get rect() { return this._rect.clone(); }
    get flip_h() { return this._flip_h; }
    get flip_v() { return this._flip_v; }
    get tile_mode() { return this._tile_mode; }
    get stretch_mode() { return this._stretch_mode; }
    get modulate() { return this._modulate.clone(); }

    set texture(value) { this._texture = value; }
    set rect(value) { this._rect = value.clone(); }
    set flip_h(value) { this._flip_h = value; }
    set flip_v(value) { this._flip_v = value; }
    set tile_mode(value) { this._tile_mode = value; }
    set stretch_mode(value) { this._stretch_mode = value; }
    set modulate(value) { this._modulate = value.clone(); }

    draw(ctx, transform) {
        if (!this._visible || !this._texture) return;

        ctx.save();
        ctx.globalAlpha = this._modulate.a;

        if (this._flip_h) ctx.scale(-1, 1);
        if (this._flip_v) ctx.scale(1, -1);

        if (this._tile_mode === 1) {
            const pattern = ctx.createPattern(this._texture, 'repeat');
            ctx.fillStyle = pattern;
            ctx.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        } else {
            ctx.drawImage(this._texture, this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        }

        ctx.restore();
    }
}

plane.TextureRect = TextureRect;