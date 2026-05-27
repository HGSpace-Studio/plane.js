class Sprite extends Node2D {
    static BLEND_MODE_DISABLED = 0;
    static BLEND_MODE_ADD = 1;
    static BLEND_MODE_SUB = 2;
    static BLEND_MODE_MUL = 3;
    static BLEND_MODE_MIX = 4;

    static REGION_DISABLED = 0;
    static REGION_ENABLED = 1;

    static FLIP_H_DISABLED = 0;
    static FLIP_H_ENABLED = 1;
    static FLIP_V_DISABLED = 0;
    static FLIP_V_ENABLED = 1;

    constructor() {
        super();
        this._texture = null;
        this._normal_map = null;
        this._global_texture = null;
        this._vflip = false;
        this._hflip = false;
        this._region_enabled = false;
        this._region_rect = new Rect2(0, 0, 0, 0);
        this._region_filter_clip = false;
        this._modulate = new Color(1, 1, 1, 1);
        this._opacity = 1.0;
        this._shading_enabled = false;
        this._blend_mode = Sprite.BLEND_MODE_MIX;
        this._shading_offset = new Vector2(0, 0);
        this._shading_color = new Color(1, 1, 1, 1);
        this._shading_texture = null;
        this._shading_gradient = null;
        this._shading_gradient_offset = 0;
        this._offset = new Vector2(0, 0);
        this._flip_h = false;
        this._flip_v = false;
        this._centered = true;
        this._instance_children_inherit_transform = true;
        this._width = 0;
        this._height = 0;
        this._frame = 0;
        this._animation = null;
        this._frame_changed = false;
    }

    get texture() { return this._texture; }
    get global_texture() { return this._global_texture; }
    get vflip() { return this._vflip; }
    get hflip() { return this._hflip; }
    get region_enabled() { return this._region_enabled; }
    get region_rect() { return this._region_rect.clone(); }
    get modulate() { return this._modulate.clone(); }
    get opacity() { return this._opacity; }
    get blend_mode() { return this._blend_mode; }
    get offset() { return this._offset.clone(); }
    get flip_h() { return this._flip_h; }
    get flip_v() { return this._flip_v; }
    get centered() { return this._centered; }
    get width() { return this._width; }
    get height() { return this._height; }

    set texture(value) {
        this._texture = value;
        this._update_texture_size();
    }

    set global_texture(value) {
        this._global_texture = value;
        this._update_texture_size();
    }

    set vflip(value) { this._vflip = value; }
    set hflip(value) { this._hflip = value; }
    set region_enabled(value) { this._region_enabled = value; }
    set region_rect(value) { this._region_rect = value.clone(); }
    set modulate(value) { this._modulate = value.clone(); }
    set opacity(value) { this._opacity = MathUtils.clamp(value, 0, 1); }
    set blend_mode(value) { this._blend_mode = value; }
    set offset(value) { this._offset = value.clone(); }
    set flip_h(value) { this._flip_h = value; }
    set flip_v(value) { this._flip_v = value; }
    set centered(value) { this._centered = value; }
    set width(value) { this._width = value; }
    set height(value) { this._height = value; }

    _update_texture_size() {
        const tex = this._texture || this._global_texture;
        if (tex) {
            if (tex.width !== undefined) {
                this._width = tex.width;
                this._height = tex.height;
            }
        }
    }

    _ready() {
        super._ready();
        this._update_texture_size();
    }

    draw(ctx, transform) {
        const tex = this._texture || this._global_texture;
        if (!tex) return;

        ctx.save();
        ctx.transform(transform._matrix[0][0], transform._matrix[1][0], transform._matrix[0][1], transform._matrix[1][1], transform.position.x, transform.position.y);

        if (this._centered) {
            ctx.translate(-this._width / 2, -this._height / 2);
        } else {
            ctx.translate(this._offset.x, this._offset.y);
        }

        if (this._flip_h) {
            ctx.scale(-1, 1);
            ctx.translate(-this._width, 0);
        }
        if (this._flip_v) {
            ctx.scale(1, -1);
            ctx.translate(0, -this._height);
        }

        ctx.globalAlpha = this._opacity * this._modulate.a;

        if (this._blend_mode === Sprite.BLEND_MODE_ADD) {
            ctx.globalCompositeOperation = 'lighter';
        } else if (this._blend_mode === Sprite.BLEND_MODE_MUL) {
            ctx.globalCompositeOperation = 'multiply';
        }

        if (this._region_enabled) {
            if (tex instanceof Image || tex instanceof HTMLCanvasElement) {
                ctx.drawImage(tex,
                    this._region_rect.x, this._region_rect.y,
                    this._region_rect.width, this._region_rect.height,
                    0, 0,
                    this._region_rect.width, this._region_rect.height
                );
            }
        } else {
            if (tex instanceof Image || tex instanceof HTMLCanvasElement) {
                ctx.drawImage(tex, 0, 0, this._width, this._height);
            } else if (tex instanceof Color) {
                ctx.fillStyle = tex.to_rgba();
                ctx.fillRect(0, 0, this._width || 100, this._height || 100);
            }
        }

        ctx.restore();
    }

    get_rect() {
        return new Rect2(
            this._position.x - (this._centered ? this._width / 2 : 0),
            this._position.y - (this._centered ? this._height / 2 : 0),
            this._width,
            this._height
        );
    }

    get_global_rect() {
        const rect = this.get_rect();
        const global_pos = this._get_global_position();
        return new Rect2(
            rect.x + global_pos.x,
            rect.y + global_pos.y,
            rect.width,
            rect.height
        );
    }
}

class AnimatedSprite extends Node2D {
    static LOOP_DISABLED = 0;
    static LOOP_ENABLED = 1;
    static LOOP_YIELD = 2;

    constructor() {
        super();
        this._spritesheet = null;
        this._frames = {};
        this._animation = "";
        this._frame = 0;
        this._playing = false;
        this._loops = AnimatedSprite.LOOP_ENABLED;
        this._speed = 1.0;
        this._remaining = 0;
        this._anim_duration = 0;
        this._updating = false;
        this._frame_changed = false;
        this._offset = new Vector2(0, 0);
        this._centered = false;
        this._flip_h = false;
        this._flip_v = false;
        this._opacity = 1.0;
        this._modulate = new Color(1, 1, 1, 1);
        this._current_texture = null;
        this._current_region = new Rect2();
        this._playing_anim_name = null;
    }

    get frames() { return this._frames; }
    get animation() { return this._animation; }
    get frame() { return this._frame; }
    get playing() { return this._playing; }
    get loops() { return this._loops; }
    get speed() { return this._speed; }
    get offset() { return this._offset.clone(); }
    get centered() { return this._centered; }
    get flip_h() { return this._flip_h; }
    get flip_v() { return this._flip_v; }
    get opacity() { return this._opacity; }
    get modulate() { return this._modulate.clone(); }

    set frames(value) { this._frames = value; }
    set animation(value) {
        this._animation = value;
        this._set_frame(0);
    }
    set loops(value) { this._loops = value; }
    set speed(value) { this._speed = value; }
    set offset(value) { this._offset = value.clone(); }
    set centered(value) { this._centered = value; }
    set flip_h(value) { this._flip_h = value; }
    set flip_v(value) { this._flip_v = value; }
    set opacity(value) { this._opacity = MathUtils.clamp(value, 0, 1); }
    set modulate(value) { this._modulate = value.clone(); }

    _set_frame(frame) {
        if (!this._frames || !this._frames[this._animation]) return;
        const anim_data = this._frames[this._animation];
        if (!anim_data || !anim_data.frames) return;

        this._frame = frame;
        if (this._frame >= anim_data.frames.length) {
            this._frame = 0;
        }

        const frame_data = anim_data.frames[this._frame];
        if (frame_data) {
            this._current_texture = frame_data.texture || this._spritesheet;
            this._current_region = frame_data.region || new Rect2();
        }
        this._frame_changed = true;
    }

    play(name = "", reset = true) {
        if (name && name !== this._animation) {
            this._animation = name;
            this._frame = 0;
        } else if (reset) {
            this._frame = 0;
        }

        this._playing = true;
        this._playing_anim_name = this._animation;

        const anim_data = this._frames && this._frames[this._animation];
        if (anim_data && anim_data.frames && anim_data.frames.length > 0) {
            this._anim_duration = anim_data.frames.length / (anim_data.fps || 10);
        } else {
            this._anim_duration = 0;
        }
    }

    stop() {
        this._playing = false;
    }

    pause() {
        this._playing = false;
    }

    resume() {
        this._playing = true;
    }

    _process(dt) {
        super._process(dt);
        if (!this._playing || !this._anim_duration) return;

        const anim_data = this._frames && this._frames[this._animation];
        if (!anim_data || !anim_data.frames) return;

        const fps = anim_data.fps || 10;
        this._remaining += dt * this._speed * fps;

        if (this._remaining >= 1) {
            const frames_to_advance = Math.floor(this._remaining);
            this._remaining = this._remaining % 1;

            const new_frame = this._frame + frames_to_advance;

            if (new_frame >= anim_data.frames.length) {
                if (this._loops === AnimatedSprite.LOOP_DISABLED) {
                    this._frame = anim_data.frames.length - 1;
                    this._playing = false;
                    return;
                } else if (this._loops === AnimatedSprite.LOOP_YIELD) {
                    this.emit("animation_finished");
                    this._playing = false;
                    return;
                }
            }

            this._frame = new_frame % anim_data.frames.length;
            this._set_frame(this._frame);
        }
    }

    is_playing() {
        return this._playing;
    }

    get_frame_count() {
        const anim_data = this._frames && this._frames[this._animation];
        return anim_data && anim_data.frames ? anim_data.frames.length : 0;
    }

    get_animations() {
        if (!this._frames) return [];
        return Object.keys(this._frames);
    }

    set_spritesheet(texture) {
        this._spritesheet = texture;
    }

    add_frame(anim_name, frame_data, fps = 10) {
        if (!this._frames[anim_name]) {
            this._frames[anim_name] = { frames: [], fps: fps };
        }
        this._frames[anim_name].frames.push(frame_data);
    }
}

class Label extends Node2D {
    static ALIGN_LEFT = 0;
    static ALIGN_CENTER = 1;
    static ALIGN_RIGHT = 2;
    static ALIGN_FILL = 3;

    static TEXT_DIRECTION_LTR = 0;
    static TEXT_DIRECTION_RTL = 1;
    static TEXT_DIRECTION_AUTO = 2;

    static OVERLINE_DISABLED = 0;
    static OVERLINE_ENABLED = 1;

    static STACKING_NONE = 0;
    static STACKING_HORIZONTAL = 1;
    static STACKING_VERTICAL = 2;

    constructor() {
        super();
        this._text = "";
        this._font = null;
        this._font_size = 16;
        this._color = new Color(1, 1, 1, 1);
        this._align = Label.ALIGN_LEFT;
        this._valign = 0;
        this._text_direction = Label.TEXT_DIRECTION_LTR;
        this._stacking_enabled = Label.STACKING_NONE;
        this._oline = Label.OVERLINE_DISABLED;
        this._underline = false;
        this._strikeout = false;
        this._italic = false;
        this._bold = false;
        this._char_extra_spacing = 0;
        this._word_extra_spacing = 0;
        this._line_spacing = 0;
        this._max_lines_visible = -1;
        this._uppercase = false;
        this._region = new Rect2();
        this._visible_characters = -1;
        this._custom_minimum_size = new Vector2(0, 0);
        this._autowrap = false;
        this._width = 300;
        this._outline_size = 0;
        this._outline_color = new Color(0, 0, 0, 1);
        this._shadow_size = 0;
        this._shadow_color = new Color(0, 0, 0, 0.5);
        this._shadow_offset = new Vector2(1, 1);
    }

    get text() { return this._text; }
    get font() { return this._font; }
    get font_size() { return this._font_size; }
    get color() { return this._color.clone(); }
    get align() { return this._align; }
    get valign() { return this._valign; }
    get uppercase() { return this._uppercase; }
    get width() { return this._width; }
    get max_lines_visible() { return this._max_lines_visible; }
    get autowrap() { return this._autowrap; }

    set text(value) { this._text = value.toString(); }
    set font(value) { this._font = value; }
    set font_size(value) { this._font_size = value; }
    set color(value) { this._color = value.clone(); }
    set align(value) { this._align = value; }
    set valign(value) { this._valign = value; }
    set uppercase(value) { this._uppercase = value; }
    set width(value) { this._width = value; }
    set max_lines_visible(value) { this._max_lines_visible = value; }
    set autowrap(value) { this._autowrap = value; }

    _process(dt) {
        super._process(dt);
    }

    draw(ctx, transform) {
        ctx.save();
        ctx.transform(transform._matrix[0][0], transform._matrix[1][0], transform._matrix[0][1], transform._matrix[1][1], transform.position.x, transform.position.y);

        ctx.font = `${this._font_size}px sans-serif`;
        ctx.fillStyle = this._color.to_rgba();
        ctx.textBaseline = 'top';

        let display_text = this._uppercase ? this._text.toUpperCase() : this._text;

        if (this._shadow_size > 0) {
            ctx.shadowColor = this._shadow_color.to_rgba();
            ctx.shadowBlur = this._shadow_size;
            ctx.shadowOffsetX = this._shadow_offset.x;
            ctx.shadowOffsetY = this._shadow_offset.y;
        }

        if (this._outline_size > 0) {
            ctx.strokeStyle = this._outline_color.to_rgba();
            ctx.lineWidth = this._outline_size;
        }

        let x_offset = 0;
        if (this._align === Label.ALIGN_CENTER) {
            x_offset = this._width / 2;
        } else if (this._align === Label.ALIGN_RIGHT) {
            x_offset = this._width;
        }

        let lines = display_text.split('\n');
        if (this._max_lines_visible > 0 && lines.length > this._max_lines_visible) {
            lines = lines.slice(0, this._max_lines_visible);
        }

        ctx.textAlign = this._align === Label.ALIGN_LEFT ? 'left' : (this._align === Label.ALIGN_CENTER ? 'center' : 'right');

        const line_height = this._font_size + this._line_spacing;

        for (let i = 0; i < lines.length; i++) {
            const y_pos = i * line_height;
            if (this._outline_size > 0) {
                ctx.strokeText(lines[i], x_offset, y_pos);
            }
            ctx.fillText(lines[i], x_offset, y_pos);
        }

        ctx.restore();
    }

    get_line_count() {
        return this._text.split('\n').length;
    }

    get_line_height() {
        return this._font_size + this._line_spacing;
    }

    get_total_height() {
        return this.get_line_count() * this.get_line_height();
    }

    get_font() {
        return this._font;
    }

    set_custom_minimum_size(size) {
        this._custom_minimum_size = size.clone();
    }

    get_custom_minimum_size() {
        return this._custom_minimum_size.clone();
    }
}

class ColorRect extends Node2D {
    constructor() {
        super();
        this._color = new Color(1, 1, 1, 1);
        this._rect = new Rect2(0, 0, 100, 100);
    }

    get color() { return this._color.clone(); }
    get rect() { return this._rect.clone(); }

    set color(value) { this._color = value.clone(); }
    set rect(value) { this._rect = value.clone(); }

    set_size(size) {
        this._rect.size = size.clone();
    }

    set_position(pos) {
        this._rect.position = pos.clone();
    }

    draw(ctx, transform) {
        ctx.save();
        ctx.transform(transform._matrix[0][0], transform._matrix[1][0], transform._matrix[0][1], transform._matrix[1][1], transform.position.x, transform.position.y);
        ctx.fillStyle = this._color.to_rgba();
        ctx.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        ctx.restore();
    }
}

class TextureRect extends Node2D {
    static EXPAND_IGNORE = 0;
    static EXPAND_FIT_WIDTH = 1;
    static EXPAND_FIT_HEIGHT = 2;
    static EXPAND_FIT = 3;
    static EXPAND_EXPAND = 4;
    static EXPAND_KEEP_ASPECT_CENTERED = 5;
    static EXPAND_KEEP_ASPECT = 6;

    constructor() {
        super();
        this._texture = null;
        this._expand = TextureRect.EXPAND_IGNORE;
        this._stretch_mode = 0;
        this._flip_h = false;
        this._flip_v = false;
        this._modulate = new Color(1, 1, 1, 1);
        this._region_rect = new Rect2();
        this._region_enabled = false;
        this._rect = new Rect2(0, 0, 100, 100);
    }

    get texture() { return this._texture; }
    get expand() { return this._expand; }
    get stretch_mode() { return this._stretch_mode; }
    get flip_h() { return this._flip_h; }
    get flip_v() { return this._flip_v; }
    get modulate() { return this._modulate.clone(); }
    get region_rect() { return this._region_rect.clone(); }
    get region_enabled() { return this._region_enabled; }

    set texture(value) { this._texture = value; }
    set expand(value) { this._expand = value; }
    set stretch_mode(value) { this._stretch_mode = value; }
    set flip_h(value) { this._flip_h = value; }
    set flip_v(value) { this._flip_v = value; }
    set modulate(value) { this._modulate = value.clone(); }
    set region_rect(value) { this._region_rect = value.clone(); }
    set region_enabled(value) { this._region_enabled = value; }

    set_size(size) {
        this._rect.size = size.clone();
    }

    draw(ctx, transform) {
        if (!this._texture) return;

        ctx.save();
        ctx.transform(transform._matrix[0][0], transform._matrix[1][0], transform._matrix[0][1], transform._matrix[1][1], transform.position.x, transform.position.y);

        if (this._flip_h) {
            ctx.scale(-1, 1);
            ctx.translate(-this._rect.width, 0);
        }
        if (this._flip_v) {
            ctx.scale(1, -1);
            ctx.translate(0, -this._rect.height);
        }

        ctx.globalAlpha = this._modulate.a;

        if (this._texture instanceof Image || this._texture instanceof HTMLCanvasElement) {
            ctx.drawImage(this._texture, this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        } else if (this._texture instanceof Color) {
            ctx.fillStyle = this._texture.to_rgba();
            ctx.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        }

        ctx.restore();
    }
}

class Container extends Node2D {
    static CLIP_CHILDREN_DISABLED = 0;
    static CLIP_CHILDREN_ONLY = 1;
    static CLIP_CHILDREN_AND_DRAW = 2;

    constructor() {
        super();
        this._clip_children = Container.CLIP_CHILDREN_DISABLED;
        this._theme = null;
        this._focus_mode = 0;
    }

    get clip_children() { return this._clip_children; }
    set clip_children(value) { this._clip_children = value; }

    _process(dt) {
        super._process(dt);
        this._update_child_positions();
    }

    _update_child_positions() {
    }

    sort_children_by_x() {
        this._children.sort((a, b) => {
            if (!(a instanceof Node2D) || !(b instanceof Node2D)) return 0;
            return a._position.x - b._position.x;
        });
    }

    sort_children_by_y() {
        this._children.sort((a, b) => {
            if (!(a instanceof Node2D) || !(b instanceof Node2D)) return 0;
            return a._position.y - b._position.y;
        });
    }
}

class VBoxContainer extends Container {
    constructor() {
        super();
        this._separation = 4;
        this._custom_separation = {};
    }

    get separation() { return this._separation; }
    set separation(value) { this._separation = value; }

    _update_child_positions() {
        let y_offset = 0;
        for (const child of this._children) {
            if (!(child instanceof Node2D) || !child.visible) continue;
            child.position = new Vector2(child.position.x, y_offset);
            y_offset += child._get_minimum_size().y + this._separation;
        }
    }

    add_spacer(prepend = false) {
        const spacer = new Control();
        spacer.set_custom_minimum_size(new Vector2(0, 0));
        if (prepend) {
            this.add_child_below_node(this._children[0], spacer);
        } else {
            this.add_child(spacer);
        }
    }
}

class HBoxContainer extends Container {
    constructor() {
        super();
        this._separation = 4;
    }

    get separation() { return this._separation; }
    set separation(value) { this._separation = value; }

    _update_child_positions() {
        let x_offset = 0;
        for (const child of this._children) {
            if (!(child instanceof Node2D) || !child.visible) continue;
            child.position = new Vector2(x_offset, child.position.y);
            x_offset += child._get_minimum_size().x + this._separation;
        }
    }
}

plane.Sprite = Sprite;
plane.AnimatedSprite = AnimatedSprite;
plane.Label = Label;
plane.ColorRect = ColorRect;
plane.TextureRect = TextureRect;
plane.Container = Container;
plane.VBoxContainer = VBoxContainer;
plane.HBoxContainer = HBoxContainer;