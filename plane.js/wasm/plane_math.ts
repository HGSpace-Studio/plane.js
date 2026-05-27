export function vector2AddX(x1: f32, y1: f32, x2: f32, y2: f32): f32 {
    return x1 + x2;
}

export function vector2AddY(x1: f32, y1: f32, x2: f32, y2: f32): f32 {
    return y1 + y2;
}

export function vector2SubX(x1: f32, y1: f32, x2: f32, y2: f32): f32 {
    return x1 - x2;
}

export function vector2SubY(x1: f32, y1: f32, x2: f32, y2: f32): f32 {
    return y1 - y2;
}

export function vector2MulX(x: f32, y: f32, scalar: f32): f32 {
    return x * scalar;
}

export function vector2MulY(x: f32, y: f32, scalar: f32): f32 {
    return y * scalar;
}

export function vector2DivX(x: f32, y: f32, scalar: f32): f32 {
    return x / scalar;
}

export function vector2DivY(x: f32, y: f32, scalar: f32): f32 {
    return y / scalar;
}

export function vector2Dot(x1: f32, y1: f32, x2: f32, y2: f32): f32 {
    return x1 * x2 + y1 * y2;
}

export function vector2Cross(x1: f32, y1: f32, x2: f32, y2: f32): f32 {
    return x1 * y2 - y1 * x2;
}

export function vector2Length(x: f32, y: f32): f32 {
    return Math.sqrt(x * x + y * y);
}

export function vector2LengthSquared(x: f32, y: f32): f32 {
    return x * x + y * y;
}

export function vector2NormalizeX(x: f32, y: f32): f32 {
    let len = Math.sqrt(x * x + y * y);
    if (len < 0.00001) return 0.0;
    return x / len;
}

export function vector2NormalizeY(x: f32, y: f32): f32 {
    let len = Math.sqrt(x * x + y * y);
    if (len < 0.00001) return 0.0;
    return y / len;
}

export function vector2Distance(x1: f32, y1: f32, x2: f32, y2: f32): f32 {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export function rectContainsPoint(rx: f32, ry: f32, rw: f32, rh: f32, px: f32, py: f32): i32 {
    if (px >= rx && px <= rx + rw && py >= ry && py <= ry + rh) {
        return 1;
    }
    return 0;
}

export function rectIntersectsRect(r1x: f32, r1y: f32, r1w: f32, r1h: f32, r2x: f32, r2y: f32, r2w: f32, r2h: f32): i32 {
    if (r1x + r1w < r2x) return 0;
    if (r2x + r2w < r1x) return 0;
    if (r1y + r1h < r2y) return 0;
    if (r2y + r2h < r1y) return 0;
    return 1;
}

export function circleIntersectsCircle(c1x: f32, c1y: f32, c1r: f32, c2x: f32, c2y: f32, c2r: f32): i32 {
    let dx = c2x - c1x;
    let dy = c2y - c1y;
    let distSq = dx * dx + dy * dy;
    let rSum = c1r + c2r;
    if (distSq <= rSum * rSum) {
        return 1;
    }
    return 0;
}

export function circleIntersectsRect(cx: f32, cy: f32, cr: f32, rx: f32, ry: f32, rw: f32, rh: f32): i32 {
    let closestX = cx;
    if (cx < rx) closestX = rx;
    else if (cx > rx + rw) closestX = rx + rw;
    
    let closestY = cy;
    if (cy < ry) closestY = ry;
    else if (cy > ry + rh) closestY = ry + rh;
    
    let dx = cx - closestX;
    let dy = cy - closestY;
    if (dx * dx + dy * dy <= cr * cr) {
        return 1;
    }
    return 0;
}

export function lerp(a: f32, b: f32, t: f32): f32 {
    return a + (b - a) * t;
}

export function clamp(value: f32, min: f32, max: f32): f32 {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

export function smoothstep(edge0: f32, edge1: f32, x: f32): f32 {
    let t = (x - edge0) / (edge1 - edge0);
    t = t < 0.0 ? 0.0 : (t > 1.0 ? 1.0 : t);
    return t * t * (3.0 - 2.0 * t);
}

export function radToDeg(rad: f32): f32 {
    return rad * 57.29577951308232;
}

export function degToRad(deg: f32): f32 {
    return deg * 0.017453292519943295;
}