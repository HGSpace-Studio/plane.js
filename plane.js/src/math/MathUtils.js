const MathUtils = {
    PI: Math.PI,
    TAU: Math.PI * 2,
    PI_2: Math.PI / 2,
    PI_4: Math.PI / 4,

    deg_to_rad(deg) { return deg * (Math.PI / 180); },
    rad_to_deg(rad) { return rad * (180 / Math.PI); },

    lerp(a, b, t) { return a + (b - a) * t; },
    inverse_lerp(a, b, value) { return a === b ? 0 : (value - a) / (b - a); },
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); },

    wrap(value, min, max) {
        const range = max - min;
        return range === 0 ? min : value - (Math.floor((value - min) / range) * range);
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

    random_range(min, max) { return min + Math.random() * (max - min); },
    random_int(min, max) { return Math.floor(min + Math.random() * (max - min + 1)); },
    random_choice(array) { return array[Math.floor(Math.random() * array.length)]; },

    shuffle(array) {
        const result = array.slice();
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    sign(value) { return value > 0 ? 1 : (value < 0 ? -1 : 0); },
    is_equal_approx(a, b, epsilon = 0.00001) { return Math.abs(a - b) < epsilon; },
    move_toward(current, target, delta) { return Math.abs(target - current) <= delta ? target : current + Math.sign(target - current) * delta; },

    angle_wrap(angle) {
        while (angle > Math.PI) angle -= Math.PI * 2;
        while (angle < -Math.PI) angle += Math.PI * 2;
        return angle;
    },

    angle_lerp(from, to, weight) { return from + this.angle_wrap(to - from) * weight; },
    map(value, inMin, inMax, outMin, outMax) { return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin)); },
    round_to(value, step) { return Math.round(value / step) * step; },
    floor_to(value, step) { return Math.floor(value / step) * step; }
};

plane.MathUtils = MathUtils;