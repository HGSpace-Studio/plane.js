class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static ZERO = new Vector2(0, 0);
    static UP = new Vector2(0, -1);
    static DOWN = new Vector2(0, 1);
    static LEFT = new Vector2(-1, 0);
    static RIGHT = new Vector2(1, 0);
    static ONE = new Vector2(1, 1);

    clone() { return new Vector2(this.x, this.y); }
    copyFrom(v) { this.x = v.x; this.y = v.y; return this; }
    set(x, y) { this.x = x; this.y = y; return this; }
    add(v) { return new Vector2(this.x + v.x, this.y + v.y); }
    addScalar(s) { return new Vector2(this.x + s, this.y + s); }
    subtract(v) { return new Vector2(this.x - v.x, this.y - v.y); }
    sub(v) { return this.subtract(v); }
    multiply(v) { return typeof v === 'number' ? new Vector2(this.x * v, this.y * v) : new Vector2(this.x * v.x, this.y * v.y); }
    mul(v) { return this.multiply(v); }
    divide(v) { return typeof v === 'number' ? new Vector2(this.x / v, this.y / v) : new Vector2(this.x / v.x, this.y / v.y); }
    div(v) { return this.divide(v); }
    dot(v) { return this.x * v.x + this.y * v.y; }
    cross(v) { return this.x * v.y - this.y * v.x; }
    length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    length_squared() { return this.x * this.x + this.y * this.y; }
    normalized() { const len = this.length(); return len === 0 ? new Vector2(0, 0) : this.divide(len); }
    normalize() { const len = this.length(); if (len > 0) { this.x /= len; this.y /= len; } return this; }
    distance_to(v) { return this.subtract(v).length(); }
    distance_to_point(v) { return this.distance_to(v); }
    angle_to(v) { return Math.atan2(v.y - this.y, v.x - this.x); }
    angle_to_point(v) { return this.angle_to(v); }
    angle() { return Math.atan2(this.y, this.x); }
    lerp(v, t) { return new Vector2(this.x + (v.x - this.x) * t, this.y + (v.y - this.y) * t); }
    linear_interpolate(v, t) { return this.lerp(v, t); }
    move_toward(target, delta) { const diff = target.subtract(this); const dist = diff.length(); return dist <= delta ? target.clone() : this.add(diff.normalized().multiply(delta)); }
    rotated(angle) { const cos = Math.cos(angle); const sin = Math.sin(angle); return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos); }
    rotate(angle) { const cos = Math.cos(angle); const sin = Math.sin(angle); const x = this.x * cos - this.y * sin; const y = this.x * sin + this.y * cos; this.x = x; this.y = y; return this; }
    abs() { return new Vector2(Math.abs(this.x), Math.abs(this.y)); }
    floor() { return new Vector2(Math.floor(this.x), Math.floor(this.y)); }
    ceil() { return new Vector2(Math.ceil(this.x), Math.ceil(this.y)); }
    round() { return new Vector2(Math.round(this.x), Math.round(this.y)); }
    sign() { return new Vector2(this.x > 0 ? 1 : (this.x < 0 ? -1 : 0), this.y > 0 ? 1 : (this.y < 0 ? -1 : 0)); }
    limit_length(max_length) { const len = this.length(); return len > max_length && len > 0 ? this.normalized().multiply(max_length) : this.clone(); }
    snapped(step) { return new Vector2(Math.round(this.x / step) * step, Math.round(this.y / step) * step); }
    is_zero() { return this.x === 0 && this.y === 0; }
    is_equal_approx(v, epsilon = 0.00001) { return Math.abs(this.x - v.x) < epsilon && Math.abs(this.y - v.y) < epsilon; }
    equal(v) { return this.x === v.x && this.y === v.y; }
    not_equal(v) { return !this.equal(v); }
    negate() { return new Vector2(-this.x, -this.y); }
    to_string() { return `(${this.x}, ${this.y})`; }
    to_array() { return [this.x, this.y]; }

    static from_angle(angle) { return new Vector2(Math.cos(angle), Math.sin(angle)); }
    static random() { return Vector2.from_angle(Math.random() * Math.PI * 2); }
}

plane.Vector2 = Vector2;