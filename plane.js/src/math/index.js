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

    clone() {
        return new Vector2(this.x, this.y);
    }

    copyFrom(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    addScalar(s) {
        return new Vector2(this.x + s, this.y + s);
    }

    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    sub(v) {
        return this.subtract(v);
    }

    multiply(v) {
        if (typeof v === 'number') {
            return new Vector2(this.x * v, this.y * v);
        }
        return new Vector2(this.x * v.x, this.y * v.y);
    }

    mul(v) {
        return this.multiply(v);
    }

    divide(v) {
        if (typeof v === 'number') {
            return new Vector2(this.x / v, this.y / v);
        }
        return new Vector2(this.x / v.x, this.y / v.y);
    }

    div(v) {
        return this.divide(v);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    length_squared() {
        return this.x * this.x + this.y * this.y;
    }

    normalized() {
        const len = this.length();
        if (len === 0) return new Vector2(0, 0);
        return this.divide(len);
    }

    normalize() {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }

    distance_to(v) {
        return this.subtract(v).length();
    }

    distance_to_point(v) {
        return this.distance_to(v);
    }

    angle_to(v) {
        return Math.atan2(v.y - this.y, v.x - this.x);
    }

    angle_to_point(v) {
        return this.angle_to(v);
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    lerp(v, t) {
        return new Vector2(
            this.x + (v.x - this.x) * t,
            this.y + (v.y - this.y) * t
        );
    }

    linear_interpolate(v, t) {
        return this.lerp(v, t);
    }

    move_toward(target, delta) {
        const diff = target.subtract(this);
        const dist = diff.length();
        if (dist <= delta) return target.clone();
        return this.add(diff.normalized().multiply(delta));
    }

    rotated(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;
    }

    abs() {
        return new Vector2(Math.abs(this.x), Math.abs(this.y));
    }

    floor() {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }

    ceil() {
        return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
    }

    round() {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }

    sign() {
        return new Vector2(
            this.x > 0 ? 1 : (this.x < 0 ? -1 : 0),
            this.y > 0 ? 1 : (this.y < 0 ? -1 : 0)
        );
    }

    limit_length(max_length) {
        const len = this.length();
        if (len > max_length && len > 0) {
            return this.normalized().multiply(max_length);
        }
        return this.clone();
    }

    snapped(step) {
        return new Vector2(
            Math.round(this.x / step) * step,
            Math.round(this.y / step) * step
        );
    }

    is_zero() {
        return this.x === 0 && this.y === 0;
    }

    is_equal_approx(v, epsilon = 0.00001) {
        return Math.abs(this.x - v.x) < epsilon && Math.abs(this.y - v.y) < epsilon;
    }

    equal(v) {
        return this.x === v.x && this.y === v.y;
    }

    not_equal(v) {
        return !this.equal(v);
    }

    negate() {
        return new Vector2(-this.x, -this.y);
    }

    to_string() {
        return `(${this.x}, ${this.y})`;
    }

    to_array() {
        return [this.x, this.y];
    }

    static from_angle(angle) {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    static random() {
        const angle = Math.random() * Math.PI * 2;
        return Vector2.from_angle(angle);
    }
}

class Rect2 {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        if (x instanceof Object && 'x' in x) {
            this.position = new Vector2(x.x, x.y);
            this.size = new Vector2(y.x, y.y);
        } else {
            this.position = new Vector2(x, y);
            this.size = new Vector2(width, height);
        }
    }

    get x() { return this.position.x; }
    set x(v) { this.position.x = v; }
    get y() { return this.position.y; }
    set y(v) { this.position.y = v; }
    get width() { return this.size.x; }
    set width(v) { this.size.x = v; }
    get height() { return this.size.y; }
    set height(v) { this.size.y = v; }

    get end() {
        return this.position.add(this.size);
    }

    get center() {
        return this.position.add(this.size.multiply(0.5));
    }

    get area() {
        return this.size.x * this.size.y;
    }

    get_area() {
        return this.area;
    }

    has_point(point) {
        return point.x >= this.position.x && point.x <= this.position.x + this.size.x &&
               point.y >= this.position.y && point.y <= this.position.y + this.size.y;
    }

    intersects(other) {
        return this.position.x < other.position.x + other.size.x &&
               this.position.x + this.size.x > other.position.x &&
               this.position.y < other.position.y + other.size.y &&
               this.position.y + this.size.y > other.position.y;
    }

    intersects_segment(from, to) {
        const fromL = new Vector2(Math.min(from.x, to.x), Math.min(from.y, to.y));
        const toL = new Vector2(Math.max(from.x, to.x), Math.max(from.y, to.y));
        const otherRect = new Rect2(fromL, toL.subtract(fromL));
        return this.intersects(otherRect);
    }

    clip(other) {
        if (!this.intersects(other)) return new Rect2();
        const intersectPos = new Vector2(
            Math.max(this.position.x, other.position.x),
            Math.max(this.position.y, other.position.y)
        );
        const intersectEnd = new Vector2(
            Math.min(this.end.x, other.end.x),
            Math.min(this.end.y, other.end.y)
        );
        return new Rect2(intersectPos, intersectEnd.subtract(intersectPos));
    }

    expand(point) {
        const minPos = new Vector2(
            Math.min(this.position.x, point.x),
            Math.min(this.position.y, point.y)
        );
        const maxEnd = new Vector2(
            Math.max(this.end.x, point.x),
            Math.max(this.end.y, point.y)
        );
        return new Rect2(minPos, maxEnd.subtract(minPos));
    }

    expand_to(point) {
        return this.expand(point);
    }

    merge(other) {
        const minPos = new Vector2(
            Math.min(this.position.x, other.position.x),
            Math.min(this.position.y, other.position.y)
        );
        const maxEnd = new Vector2(
            Math.max(this.end.x, other.end.x),
            Math.max(this.end.y, other.end.y)
        );
        return new Rect2(minPos, maxEnd.subtract(minPos));
    }

    encloses(other) {
        return other.position.x >= this.position.x &&
               other.position.y >= this.position.y &&
               other.end.x <= this.end.x &&
               other.end.y <= this.end.y;
    }

    clip_to(p_rect) {
        return this.clip(p_rect);
    }

    clone() {
        return new Rect2(this.position.clone(), this.size.clone());
    }

    to_string() {
        return `Rect2(${this.x}, ${this.y}, ${this.width}, ${this.height})`;
    }
}

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

    get x() {
        return new Vector2(Math.cos(this.rotation) * this.scale.x, Math.sin(this.rotation) * this.scale.x);
    }

    get y() {
        return new Vector2(-Math.sin(this.rotation) * this.scale.y, Math.cos(this.rotation) * this.scale.y);
    }

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

    xform(point) {
        return this.apply(point);
    }

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

    xform_inv(point) {
        return this.inverse_apply(point);
    }

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

    rotated(angle) {
        const t = new Transform2D(this.rotation + angle, this.position);
        return t;
    }

    orthonormalized() {
        return this.rotated(this.rotation);
    }

    affine_inverse() {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        const det = cos * sin * this.scale.x * this.scale.y;
        if (det === 0) return this;
        const invScaleX = 1 / this.scale.x;
        const invScaleY = 1 / this.scale.y;
        const t = new Transform2D();
        t.rotation = -this.rotation;
        t.scale = new Vector2(invScaleX, invScaleY);
        t.position = new Vector2(
            (-this.position.x * cos - this.position.y * sin) * invScaleX,
            (-this.position.x * (-sin) - this.position.y * cos) * invScaleY
        );
        return t;
    }

    interpolate_with(dest, c) {
        const t = new Transform2D();
        t.position = this.position.lerp(dest.position, c);
        t.rotation = this.rotation + (dest.rotation - this.rotation) * c;
        t.scale = this.scale.lerp(dest.scale, c);
        t._update_matrix();
        return t;
    }

    clone() {
        const t = new Transform2D(this.rotation, this.position);
        t.scale = this.scale.clone();
        t._update_matrix();
        return t;
    }

    to_string() {
        return `Transform2D(rot=${this.rotation}, pos=${this.position.to_string()}, scale=${this.scale.to_string()})`;
    }
}

class Color {
    constructor(r = 1, g = 1, b = 1, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static WHITE = new Color(1, 1, 1, 1);
    static BLACK = new Color(0, 0, 0, 1);
    static RED = new Color(1, 0, 0, 1);
    static GREEN = new Color(0, 1, 0, 1);
    static BLUE = new Color(0, 0, 1, 1);
    static YELLOW = new Color(1, 1, 0, 1);
    static CYAN = new Color(0, 1, 1, 1);
    static MAGENTA = new Color(1, 0, 1, 1);
    static TRANSPARENT = new Color(0, 0, 0, 0);

    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    to_string() {
        return `Color(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    to_hex() {
        const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
        return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}${toHex(this.a)}`;
    }

    to_rgba() {
        return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
    }

    blend(other) {
        return new Color(
            this.r * (1 - other.a) + other.r * other.a,
            this.g * (1 - other.a) + other.g * other.a,
            this.b * (1 - other.a) + other.b * other.a,
            this.a + other.a * (1 - this.a)
        );
    }

    linear_interpolate(other, t) {
        return new Color(
            this.r + (other.r - this.r) * t,
            this.g + (other.g - this.g) * t,
            this.b + (other.b - this.b) * t,
            this.a + (other.a - this.a) * t
        );
    }

    lerp(other, t) {
        return this.linear_interpolate(other, t);
    }

    modulate(color) {
        return new Color(this.r * color.r, this.g * color.g, this.b * color.b, this.a * color.a);
    }

    darkened(amount) {
        return new Color(
            Math.max(0, this.r - amount),
            Math.max(0, this.g - amount),
            Math.max(0, this.b - amount),
            this.a
        );
    }

    lightened(amount) {
        return new Color(
            Math.min(1, this.r + amount),
            Math.min(1, this.g + amount),
            Math.min(1, this.b + amount),
            this.a
        );
    }

    inverted() {
        return new Color(1 - this.r, 1 - this.g, 1 - this.b, this.a);
    }

    gray() {
        return (this.r + this.g + this.b) / 3;
    }
}

const MathUtils = {
    PI: Math.PI,
    TAU: Math.PI * 2,
    PI_2: Math.PI / 2,
    PI_4: Math.PI / 4,

    deg_to_rad(deg) {
        return deg * (Math.PI / 180);
    },

    rad_to_deg(rad) {
        return rad * (180 / Math.PI);
    },

    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    inverse_lerp(a, b, value) {
        if (a === b) return 0;
        return (value - a) / (b - a);
    },

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    wrap(value, min, max) {
        const range = max - min;
        if (range === 0) return min;
        return value - (Math.floor((value - min) / range) * range);
    },

    smoothstep(edge0, edge1, x) {
        const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
    },

    ease(t, curve) {
        switch (curve) {
            case 'linear': return t;
            case 'ease_in': return t * t;
            case 'ease_out': return t * (2 - t);
            case 'ease_in_out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            case 'ease_in_cubic': return t * t * t;
            case 'ease_out_cubic': return (--t) * t * t + 1;
            case 'ease_in_out_cubic': return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            default: return t;
        }
    },

    random_range(min, max) {
        return min + Math.random() * (max - min);
    },

    random_int(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    },

    random_choice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    shuffle(array) {
        const result = array.slice();
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    sign(value) {
        return value > 0 ? 1 : (value < 0 ? -1 : 0);
    },

    is_equal_approx(a, b, epsilon = 0.00001) {
        return Math.abs(a - b) < epsilon;
    },

    move_toward(current, target, delta) {
        if (Math.abs(target - current) <= delta) return target;
        return current + Math.sign(target - current) * delta;
    },

    angle_wrap(angle) {
        while (angle > Math.PI) angle -= Math.PI * 2;
        while (angle < -Math.PI) angle += Math.PI * 2;
        return angle;
    },

    angle_lerp(from, to, weight) {
        return from + this.angle_wrap(to - from) * weight;
    },

    map(value, inMin, inMax, outMin, outMax) {
        return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
    },

    round_to(value, step) {
        return Math.round(value / step) * step;
    },

    floor_to(value, step) {
        return Math.floor(value / step) * step;
    }
};

class Matrix2 {
    constructor() {
        this.elements = [
            1, 0,
            0, 1
        ];
    }

    static identity() {
        return new Matrix2();
    }

    static from_elements(m00, m01, m10, m11) {
        const m = new Matrix2();
        m.elements = [m00, m01, m10, m11];
        return m;
    }

    static from_rotation(angle) {
        const m = new Matrix2();
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        m.elements[0] = cos;
        m.elements[1] = -sin;
        m.elements[2] = sin;
        m.elements[3] = cos;
        return m;
    }

    static from_scale(scale) {
        const m = new Matrix2();
        m.elements[0] = scale.x;
        m.elements[3] = scale.y;
        return m;
    }

    clone() {
        const m = new Matrix2();
        m.elements = this.elements.slice();
        return m;
    }

    determinant() {
        return this.elements[0] * this.elements[3] - this.elements[1] * this.elements[2];
    }

    inverse() {
        const det = this.determinant();
        if (det === 0) return null;
        const invDet = 1 / det;
        const m = new Matrix2();
        m.elements[0] = this.elements[3] * invDet;
        m.elements[1] = -this.elements[1] * invDet;
        m.elements[2] = -this.elements[2] * invDet;
        m.elements[3] = this.elements[0] * invDet;
        return m;
    }

    transpose() {
        const m = new Matrix2();
        m.elements[0] = this.elements[0];
        m.elements[1] = this.elements[2];
        m.elements[2] = this.elements[1];
        m.elements[3] = this.elements[3];
        return m;
    }

    multiply(other) {
        const m = new Matrix2();
        m.elements[0] = this.elements[0] * other.elements[0] + this.elements[1] * other.elements[2];
        m.elements[1] = this.elements[0] * other.elements[1] + this.elements[1] * other.elements[3];
        m.elements[2] = this.elements[2] * other.elements[0] + this.elements[3] * other.elements[2];
        m.elements[3] = this.elements[2] * other.elements[1] + this.elements[3] * other.elements[3];
        return m;
    }

    xform_vector2(v) {
        return new Vector2(
            this.elements[0] * v.x + this.elements[1] * v.y,
            this.elements[2] * v.x + this.elements[3] * v.y
        );
    }
}

plane.MathUtils = MathUtils;
plane.Matrix2 = Matrix2;
plane.Vector2 = Vector2;
plane.Rect2 = Rect2;
plane.Transform2D = Transform2D;
plane.Color = Color;