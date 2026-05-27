class Container extends Node2D {
    constructor() {
        super();
        this.name = "Container";
        this._alignment = 0;
        this._custom_minimum_size = new Vector2(0, 0);
        this._rect = new Rect2(0, 0, 200, 200);
        this._fit_content = false;
        this._margin_left = 0;
        this._margin_right = 0;
        this._margin_top = 0;
        this._margin_bottom = 0;
    }

    get alignment() { return this._alignment; }
    get custom_minimum_size() { return this._custom_minimum_size.clone(); }
    get rect() { return this._rect.clone(); }
    get fit_content() { return this._fit_content; }

    set alignment(value) { this._alignment = value; }
    set custom_minimum_size(value) { this._custom_minimum_size = value.clone(); }
    set rect(value) { this._rect = value.clone(); }
    set fit_content(value) { this._fit_content = value; }

    _ready() {
        super._ready();
        this._update_layout();
    }

    _update_layout() {
        if (!this._fit_content) return;

        let maxWidth = 0;
        let totalHeight = 0;

        for (const child of this._children) {
            if (child._rect) {
                maxWidth = Math.max(maxWidth, child._rect.width);
                totalHeight += child._rect.height;
            }
        }

        this._rect.width = Math.max(maxWidth, this._custom_minimum_size.x);
        this._rect.height = Math.max(totalHeight, this._custom_minimum_size.y);
    }

    draw(ctx, transform) {
        if (!this._visible) return;

        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        ctx.restore();
    }
}

class VBoxContainer extends Container {
    constructor() {
        super();
        this.name = "VBoxContainer";
        this._spacing = 4;
    }

    get spacing() { return this._spacing; }
    set spacing(value) { this._spacing = value; }

    _update_layout() {
        let y = this._margin_top;

        for (const child of this._children) {
            if (child._rect) {
                child._rect.y = y;
                child._rect.x = this._margin_left;

                if (this._alignment === 1) {
                    child._rect.x = (this._rect.width - child._rect.width) / 2;
                } else if (this._alignment === 2) {
                    child._rect.x = this._rect.width - child._rect.width - this._margin_right;
                }

                y += child._rect.height + this._spacing;
            }
        }

        if (this._fit_content) {
            this._rect.height = Math.max(y - this._spacing + this._margin_bottom, this._custom_minimum_size.y);
        }
    }
}

class HBoxContainer extends Container {
    constructor() {
        super();
        this.name = "HBoxContainer";
        this._spacing = 4;
    }

    get spacing() { return this._spacing; }
    set spacing(value) { this._spacing = value; }

    _update_layout() {
        let x = this._margin_left;

        for (const child of this._children) {
            if (child._rect) {
                child._rect.x = x;
                child._rect.y = this._margin_top;

                if (this._alignment === 1) {
                    child._rect.y = (this._rect.height - child._rect.height) / 2;
                } else if (this._alignment === 2) {
                    child._rect.y = this._rect.height - child._rect.height - this._margin_bottom;
                }

                x += child._rect.width + this._spacing;
            }
        }

        if (this._fit_content) {
            this._rect.width = Math.max(x - this._spacing + this._margin_right, this._custom_minimum_size.x);
        }
    }
}

plane.Container = Container;
plane.VBoxContainer = VBoxContainer;
plane.HBoxContainer = HBoxContainer;