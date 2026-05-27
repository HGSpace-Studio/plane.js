class Transform2D {
    constructor(rotation = 0, position = new Vector2()) {
        this.rotation = rotation;
        this.position = position.clone();
        this.scale = new Vector2(1, 1);
        this._update_matrix();
    }

    _update_matrix() {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        this._matrix = [
            [cos * this.scale.x, -sin * this.scale.y],
            [sin * this.scale.x, cos * this.scale.y]
        ];
    }

    get x() { return new Vector2(Math.cos(this.rotation) * this.scale.x, Math.sin(this.rotation) * this.scale.x); }
    get y() { return new Vector2(-Math.sin(this.rotation) * this.scale.y, Math.cos(this.rotation) * this.scale.y); }
    basis_x() { return this.x; }
    basis_y() { return this.y; }

    get_origin() { return this.position.clone(); }
    get_rotation() { return this.rotation; }
    get_scale() { return this.scale.clone(); }

    apply(point) {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        const scaledX = point.x * this.scale.x;
        const scaledY = point.y * this.scale.y;
        return new Vector2(
            scaledX * cos - scaledY * sin + this.position.x,
            scaledX * sin + scaledY * cos + this.position.y
        );
    }

    xform(point) { return this.apply(point); }

    inverse_apply(point) {
        const translated = point.subtract(this.position);
        const cos = Math.cos(-this.rotation);
        const sin = Math.sin(-this.rotation);
        const invScaleX = 1 / this.scale.x;
        const invScaleY = 1 / this.scale.y;
        const rotatedX = translated.x * cos - translated.y * sin;
        const rotatedY = translated.x * sin + translated.y * cos;
        return new Vector2(rotatedX * invScaleX, rotatedY * invScaleY);
    }

    xform_inv(point) { return this.inverse_apply(point); }

    translated(offset) {
        const t = new Transform2D(this.rotation, this.position);
        t.position = this.position.add(offset);
        return t;
    }

    scaled(scale) {
        const t = new Transform2D(this.rotation, this.position);
        t.scale = this.scale.multiply(scale);
        t._update_matrix();
        return t;
    }

    rotated(angle) { return new Transform2D(this.rotation + angle, this.position); }
    orthonormalized() { return this.rotated(this.rotation); }

    clone() {
        const t = new Transform2D(this.rotation, this.position);
        t.scale = this.scale.clone();
        t._update_matrix();
        return t;
    }

    to_string() { return `Transform2D(rot=${this.rotation}, pos=${this.position.to_string()}, scale=${this.scale.to_string()})`; }
}

plane.Transform2D = Transform2D;