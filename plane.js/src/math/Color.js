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

    clone() { return new Color(this.r, this.g, this.b, this.a); }
    to_string() { return `Color(${this.r}, ${this.g}, ${this.b}, ${this.a})`; }

    to_hex() {
        const toHex = v => Math.round(v * 255).toString(16).padStart(2, '0');
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

    lerp(other, t) { return this.linear_interpolate(other, t); }
    modulate(color) { return new Color(this.r * color.r, this.g * color.g, this.b * color.b, this.a * color.a); }

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

    inverted() { return new Color(1 - this.r, 1 - this.g, 1 - this.b, this.a); }
    gray() { return (this.r + this.g + this.b) / 3; }
}

plane.Color = Color;