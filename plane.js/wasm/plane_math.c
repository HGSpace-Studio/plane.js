#include <emscripten/emscripten.h>

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE
float vector2_add_x(float x1, float y1, float x2, float y2) {
    return x1 + x2;
}

EMSCRIPTEN_KEEPALIVE
float vector2_add_y(float x1, float y1, float x2, float y2) {
    return y1 + y2;
}

EMSCRIPTEN_KEEPALIVE
float vector2_sub_x(float x1, float y1, float x2, float y2) {
    return x1 - x2;
}

EMSCRIPTEN_KEEPALIVE
float vector2_sub_y(float x1, float y1, float x2, float y2) {
    return y1 - y2;
}

EMSCRIPTEN_KEEPALIVE
float vector2_mul_x(float x, float y, float scalar) {
    return x * scalar;
}

EMSCRIPTEN_KEEPALIVE
float vector2_mul_y(float x, float y, float scalar) {
    return y * scalar;
}

EMSCRIPTEN_KEEPALIVE
float vector2_div_x(float x, float y, float scalar) {
    return x / scalar;
}

EMSCRIPTEN_KEEPALIVE
float vector2_div_y(float x, float y, float scalar) {
    return y / scalar;
}

EMSCRIPTEN_KEEPALIVE
float vector2_dot(float x1, float y1, float x2, float y2) {
    return x1 * x2 + y1 * y2;
}

EMSCRIPTEN_KEEPALIVE
float vector2_cross(float x1, float y1, float x2, float y2) {
    return x1 * y2 - y1 * x2;
}

EMSCRIPTEN_KEEPALIVE
float vector2_length(float x, float y) {
    return sqrtf(x * x + y * y);
}

EMSCRIPTEN_KEEPALIVE
float vector2_length_squared(float x, float y) {
    return x * x + y * y;
}

EMSCRIPTEN_KEEPALIVE
float vector2_normalize_x(float x, float y) {
    float len = sqrtf(x * x + y * y);
    if (len < 0.00001f) return 0.0f;
    return x / len;
}

EMSCRIPTEN_KEEPALIVE
float vector2_normalize_y(float x, float y) {
    float len = sqrtf(x * x + y * y);
    if (len < 0.00001f) return 0.0f;
    return y / len;
}

EMSCRIPTEN_KEEPALIVE
float vector2_distance(float x1, float y1, float x2, float y2) {
    float dx = x2 - x1;
    float dy = y2 - y1;
    return sqrtf(dx * dx + dy * dy);
}

EMSCRIPTEN_KEEPALIVE
int rect_contains_point(float rx, float ry, float rw, float rh, float px, float py) {
    return (px >= rx && px <= rx + rw && py >= ry && py <= ry + rh) ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
int rect_intersects_rect(float r1x, float r1y, float r1w, float r1h, float r2x, float r2y, float r2w, float r2h) {
    return !(r1x + r1w < r2x || r2x + r2w < r1x || r1y + r1h < r2y || r2y + r2h < r1y) ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
int circle_intersects_circle(float c1x, float c1y, float c1r, float c2x, float c2y, float c2r) {
    float dx = c2x - c1x;
    float dy = c2y - c1y;
    float dist_sq = dx * dx + dy * dy;
    float r_sum = c1r + c2r;
    return dist_sq <= r_sum * r_sum ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
int circle_intersects_rect(float cx, float cy, float cr, float rx, float ry, float rw, float rh) {
    float closest_x = cx < rx ? rx : (cx > rx + rw ? rx + rw : cx);
    float closest_y = cy < ry ? ry : (cy > ry + rh ? ry + rh : cy);
    float dx = cx - closest_x;
    float dy = cy - closest_y;
    return dx * dx + dy * dy <= cr * cr ? 1 : 0;
}

EMSCRIPTEN_KEEPALIVE
float lerp(float a, float b, float t) {
    return a + (b - a) * t;
}

EMSCRIPTEN_KEEPALIVE
float clamp(float value, float min, float max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

EMSCRIPTEN_KEEPALIVE
float smoothstep(float edge0, float edge1, float x) {
    float t = (x - edge0) / (edge1 - edge0);
    t = t < 0.0f ? 0.0f : (t > 1.0f ? 1.0f : t);
    return t * t * (3.0f - 2.0f * t);
}

EMSCRIPTEN_KEEPALIVE
float rad_to_deg(float rad) {
    return rad * 57.29577951308232f;
}

EMSCRIPTEN_KEEPALIVE
float deg_to_rad(float deg) {
    return deg * 0.017453292519943295f;
}

#ifdef __cplusplus
}
#endif