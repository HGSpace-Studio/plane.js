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

    get end() { return this.position.add(this.size); }
    get center() { return this.position.add(this.size.multiply(0.5)); }
    get area() { return this.size.x * this.size.y; }
    get_area() { return this.area; }

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

    clone() { return new Rect2(this.position.clone(), this.size.clone()); }
    to_string() { return `Rect2(${this.x}, ${this.y}, ${this.width}, ${this.height})`; }
}

plane.Rect2 = Rect2;