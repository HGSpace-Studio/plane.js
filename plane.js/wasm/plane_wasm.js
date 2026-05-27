class PlaneWASM {
    constructor() {
        this.initialized = false;
        this.module = null;
        this.useNativeJS = true;
    }

    init() {
        if (this.initialized) return Promise.resolve();
        
        return new Promise((resolve) => {
            this.initialized = true;
            resolve();
        });
    }

    vector2Add(x1, y1, x2, y2) {
        return { x: x1 + x2, y: y1 + y2 };
    }

    vector2Sub(x1, y1, x2, y2) {
        return { x: x1 - x2, y: y1 - y2 };
    }

    vector2Mul(x, y, scalar) {
        return { x: x * scalar, y: y * scalar };
    }

    vector2Div(x, y, scalar) {
        return { x: x / scalar, y: y / scalar };
    }

    vector2Dot(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    }

    vector2Cross(x1, y1, x2, y2) {
        return x1 * y2 - y1 * x2;
    }

    vector2Length(x, y) {
        return Math.sqrt(x * x + y * y);
    }

    vector2LengthSquared(x, y) {
        return x * x + y * y;
    }

    vector2Normalize(x, y) {
        const len = Math.sqrt(x * x + y * y);
        if (len < 0.00001) return { x: 0, y: 0 };
        return { x: x / len, y: y / len };
    }

    vector2Distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    rectContainsPoint(rx, ry, rw, rh, px, py) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    }

    rectIntersectsRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
        return !(r1x + r1w < r2x || r2x + r2w < r1x || r1y + r1h < r2y || r2y + r2h < r1y);
    }

    circleIntersectsCircle(c1x, c1y, c1r, c2x, c2y, c2r) {
        const dx = c2x - c1x;
        const dy = c2y - c1y;
        const distSq = dx * dx + dy * dy;
        const rSum = c1r + c2r;
        return distSq <= rSum * rSum;
    }

    circleIntersectsRect(cx, cy, cr, rx, ry, rw, rh) {
        let closestX = cx;
        if (cx < rx) closestX = rx;
        else if (cx > rx + rw) closestX = rx + rw;
        
        let closestY = cy;
        if (cy < ry) closestY = ry;
        else if (cy > ry + rh) closestY = ry + rh;
        
        const dx = cx - closestX;
        const dy = cy - closestY;
        return dx * dx + dy * dy <= cr * cr;
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    smoothstep(edge0, edge1, x) {
        let t = (x - edge0) / (edge1 - edge0);
        t = t < 0.0 ? 0.0 : (t > 1.0 ? 1.0 : t);
        return t * t * (3.0 - 2.0 * t);
    }

    radToDeg(rad) {
        return rad * 57.29577951308232;
    }

    degToRad(deg) {
        return deg * 0.017453292519943295;
    }
}

const planeWASM = new PlaneWASM();

if (typeof window !== 'undefined') {
    window.planeWASM = planeWASM;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = planeWASM;
}