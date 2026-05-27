class Sprite extends Node2D {
    constructor() {
        super();
        this.name = "Sprite";
        this._texture = null;
        this._rect = new Rect2();
        this._flip_h = false;
        this._flip_v = false;
        this._centered = true;
        this._offset = new Vector2(0, 0);
        this._scale_mode = 0;
        this._stretch_mode = 0;
        this._modulate = new Color(1, 1, 1, 1);
        this._visible = true;
    }

    get texture() { return this._texture; }
    get rect() { return this._rect.clone(); }
    get flip_h() { return this._flip_h; }
    get flip_v() { return this._flip_v; }
    get centered() { return this._centered; }
    get offset() { return this._offset.clone(); }
    get modulate() { return this._modulate.clone(); }

    set texture(value) { this._texture = value; }
    set rect(value) { this._rect = value.clone(); }
    set flip_h(value) { this._flip_h = value; }
    set flip_v(value) { this._flip_v = value; }
    set centered(value) { this._centered = value; }
    set offset(value) { this._offset = value.clone(); }
    set modulate(value) { this._modulate = value.clone(); }

    set_flip_h(flip) { this._flip_h = flip; }
    set_flip_v(flip) { this._flip_v = flip; }

    _ready() {
        super._ready();
        if (this._texture && !this._rect.size.x && !this._rect.size.y) {
            this._rect = new Rect2(0, 0, this._texture.width, this._texture.height);
        }
    }

    draw(ctx, transform) {
        if (!this._visible || !this._texture) return;

        ctx.save();
        ctx.globalAlpha = this._modulate.a;

        const pos = this._centered ?
            new Vector2(-this._rect.width / 2, -this._rect.height / 2) :
            new Vector2(0, 0);

        ctx.translate(pos.x + this._offset.x, pos.y + this._offset.y);

        if (this._flip_h) ctx.scale(-1, 1);
        if (this._flip_v) ctx.scale(1, -1);

        ctx.drawImage(
            this._texture,
            this._rect.x, this._rect.y,
            this._rect.width, this._rect.height,
            0, 0,
            this._rect.width * this.scale.x,
            this._rect.height * this.scale.y
        );

        ctx.restore();
    }
}

plane.Sprite = Sprite;