class ColorRect extends plane.Node2D {
    constructor() {
        super();
        this.name = "ColorRect";
        this._color = new plane.Color(1, 1, 1, 1);
        this._rect = new plane.Rect2(0, 0, 100, 100);
        this._draw_center = false;
    }

    get color() { return this._color.clone(); }
    get rect() { return this._rect.clone(); }
    get draw_center() { return this._draw_center; }

    set color(value) { this._color = value.clone(); }
    set rect(value) { this._rect = value.clone(); }
    set draw_center(value) { this._draw_center = value; }

    draw(ctx, transform) {
        if (!this._visible) return;

        ctx.save();
        ctx.fillStyle = this._color.to_rgba();

        const pos = this._draw_center ?
            new plane.Vector2(-this._rect.width / 2, -this._rect.height / 2) :
            new plane.Vector2(this._rect.x, this._rect.y);

        ctx.fillRect(pos.x, pos.y, this._rect.width, this._rect.height);
        ctx.restore();
    }
}

plane.ColorRect = ColorRect;