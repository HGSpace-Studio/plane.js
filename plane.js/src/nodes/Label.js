class Label extends plane.Node2D {
    constructor() {
        super();
        this.name = "Label";
        this._text = "";
        this._font_size = 16;
        this._font_family = "sans-serif";
        this._color = new plane.Color(1, 1, 1, 1);
        this._centered = false;
        this._autowrap = false;
        this._max_lines_visible = -1;
        this._line_spacing = 0;
        this._align = 0;
        this._valign = 0;
        this._outline_color = new plane.Color(0, 0, 0, 0);
        this._outline_size = 0;
        this._shadow_color = new plane.Color(0, 0, 0, 0);
        this._shadow_offset = new plane.Vector2(2, 2);
        this._bold = false;
        this._italic = false;
        this._underline = false;
        this._strikethrough = false;
    }

    get text() { return this._text; }
    get font_size() { return this._font_size; }
    get font_family() { return this._font_family; }
    get color() { return this._color.clone(); }
    get centered() { return this._centered; }
    get autowrap() { return this._autowrap; }
    get align() { return this._align; }
    get valign() { return this._valign; }
    get outline_color() { return this._outline_color.clone(); }
    get outline_size() { return this._outline_size; }
    get shadow_color() { return this._shadow_color.clone(); }
    get shadow_offset() { return this._shadow_offset.clone(); }
    get bold() { return this._bold; }
    get italic() { return this._italic; }

    set text(value) { this._text = value; }
    set font_size(value) { this._font_size = value; }
    set font_family(value) { this._font_family = value; }
    set color(value) { this._color = value.clone(); }
    set centered(value) { this._centered = value; }
    set autowrap(value) { this._autowrap = value; }
    set align(value) { this._align = value; }
    set valign(value) { this._valign = value; }
    set outline_color(value) { this._outline_color = value.clone(); }
    set outline_size(value) { this._outline_size = value; }
    set shadow_color(value) { this._shadow_color = value.clone(); }
    set shadow_offset(value) { this._shadow_offset = value.clone(); }
    set bold(value) { this._bold = value; }
    set italic(value) { this._italic = value; }

    draw(ctx, transform) {
        if (!this._visible || !this._text) return;

        ctx.save();

        let font_style = "";
        if (this._bold) font_style += "bold ";
        if (this._italic) font_style += "italic ";
        font_style += `${this._font_size}px ${this._font_family}`;

        ctx.font = font_style;
        ctx.fillStyle = this._color.to_rgba();
        ctx.textAlign = this._centered ? "center" : "left";
        ctx.textBaseline = "top";

        if (this._shadow_color.a > 0) {
            ctx.shadowColor = this._shadow_color.to_rgba();
            ctx.shadowBlur = this._outline_size;
            ctx.shadowOffsetX = this._shadow_offset.x;
            ctx.shadowOffsetY = this._shadow_offset.y;
        }

        const lines = this._text.split("\n");
        let y = 0;
        for (let i = 0; i < lines.length; i++) {
            if (this._max_lines_visible > 0 && i >= this._max_lines_visible) break;
            ctx.fillText(lines[i], 0, y);
            y += this._font_size + this._line_spacing;
        }

        ctx.restore();
    }
}

plane.Label = Label;