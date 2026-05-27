class AudioManager {
    static _instance = null;

    constructor() {
        this._audio_context = null;
        this._sources = [];
        this._global_volume = 1.0;
        this._music_volume = 1.0;
        this._sfx_volume = 1.0;
        this._listener_position = new Vector2(0, 0);
        this._initialized = false;
    }

    static get_singleton() {
        if (!AudioManager._instance) {
            AudioManager._instance = new AudioManager();
        }
        return AudioManager._instance;
    }

    _init() {
        if (this._initialized) return;
        this._audio_context = new (window.AudioContext || window.webkitAudioContext)();
        this._initialized = true;
    }

    get global_volume() { return this._global_volume; }
    get music_volume() { return this._music_volume; }
    get sfx_volume() { return this._sfx_volume; }

    set global_volume(value) {
        this._global_volume = Math.max(0, Math.min(1, value));
    }

    set music_volume(value) {
        this._music_volume = Math.max(0, Math.min(1, value));
    }

    set sfx_volume(value) {
        this._sfx_volume = Math.max(0, Math.min(1, value));
    }

    play_sound(path, volume = 1.0, loop = false) {
        if (!this._initialized) this._init();

        const source = this._audio_context.createBufferSource();
        const gain_node = this._audio_context.createGain();

        fetch(path)
            .then(response => response.arrayBuffer())
            .then(buffer => this._audio_context.decodeAudioData(buffer))
            .then(audio_buffer => {
                source.buffer = audio_buffer;
                source.loop = loop;
                gain_node.gain.value = volume * this._global_volume * this._sfx_volume;
                source.connect(gain_node);
                gain_node.connect(this._audio_context.destination);
                source.start(0);

                this._sources.push({
                    source,
                    gain_node,
                    path,
                    type: 'sfx'
                });

                source.onended = () => {
                    this._remove_source(source);
                };
            })
            .catch(error => {
                console.error('Error loading audio:', error);
            });

        return source;
    }

    play_music(path, volume = 1.0, loop = true) {
        if (!this._initialized) this._init();

        const source = this._audio_context.createBufferSource();
        const gain_node = this._audio_context.createGain();

        fetch(path)
            .then(response => response.arrayBuffer())
            .then(buffer => this._audio_context.decodeAudioData(buffer))
            .then(audio_buffer => {
                source.buffer = audio_buffer;
                source.loop = loop;
                gain_node.gain.value = volume * this._global_volume * this._music_volume;
                source.connect(gain_node);
                gain_node.connect(this._audio_context.destination);
                source.start(0);

                this._sources.push({
                    source,
                    gain_node,
                    path,
                    type: 'music'
                });

                source.onended = () => {
                    this._remove_source(source);
                };
            })
            .catch(error => {
                console.error('Error loading music:', error);
            });

        return source;
    }

    stop_sound(source) {
        if (source) {
            try {
                source.stop();
            } catch (e) {
            }
            this._remove_source(source);
        }
    }

    stop_all_sounds() {
        for (const item of this._sources) {
            if (item.type === 'sfx') {
                try {
                    item.source.stop();
                } catch (e) {
                }
            }
        }
        this._sources = this._sources.filter(s => s.type !== 'sfx');
    }

    stop_all_music() {
        for (const item of this._sources) {
            if (item.type === 'music') {
                try {
                    item.source.stop();
                } catch (e) {
                }
            }
        }
        this._sources = this._sources.filter(s => s.type !== 'music');
    }

    stop_all() {
        for (const item of this._sources) {
            try {
                item.source.stop();
            } catch (e) {
            }
        }
        this._sources = [];
    }

    _remove_source(source) {
        const index = this._sources.findIndex(s => s.source === source);
        if (index !== -1) {
            this._sources.splice(index, 1);
        }
    }

    set_listener_position(position) {
        this._listener_position = position.clone();
    }

    get_listener_position() {
        return this._listener_position.clone();
    }

    get_sound_count() {
        return this._sources.length;
    }
}

class AudioStreamPlayer extends Node {
    constructor() {
        super();
        this.name = "AudioStreamPlayer";
        this._stream = null;
        this._volume = 1.0;
        this._pitch_scale = 1.0;
        this._playing = false;
        this._loop = false;
        this._autoplay = false;
        this._stream_paused = new Signal();
        this._stream_position_changed = new Signal();
        this._stream_finished = new Signal();
        this._audio_manager = AudioManager.get_singleton();
        this._current_source = null;
    }

    get stream() { return this._stream; }
    get volume() { return this._volume; }
    get pitch_scale() { return this._pitch_scale; }
    get playing() { return this._playing; }
    get loop() { return this._loop; }
    get autoplay() { return this._autoplay; }

    set stream(value) { this._stream = value; }
    set volume(value) { this._volume = Math.max(0, Math.min(1, value)); }
    set pitch_scale(value) { this._pitch_scale = value; }
    set loop(value) { this._loop = value; }
    set autoplay(value) { this._autoplay = value; }

    _ready() {
        super._ready();
        if (this._autoplay && this._stream) {
            this.play();
        }
    }

    play() {
        if (!this._stream) return;

        this._current_source = this._audio_manager.play_sound(this._stream, this._volume, this._loop);
        this._playing = true;

        if (this._current_source && this._pitch_scale !== 1) {
            this._current_source.playbackRate.value = this._pitch_scale;
        }
    }

    pause() {
        if (this._current_source) {
            try {
                this._current_source.stop();
            } catch (e) {
            }
        }
        this._playing = false;
        this._stream_paused.emit();
    }

    stop() {
        this.pause();
        this._stream_finished.emit();
    }

    seek(seconds) {
    }

    get_position() {
        return 0;
    }

    get_length() {
        return 0;
    }
}

class AudioStreamPlayer2D extends Node2D {
    constructor() {
        super();
        this.name = "AudioStreamPlayer2D";
        this._stream = null;
        this._volume = 1.0;
        this._pitch_scale = 1.0;
        this._playing = false;
        this._loop = false;
        this._autoplay = false;
        this._max_distance = 1000;
        this._attenuation = 1.0;
        this._stream_paused = new Signal();
        this._stream_position_changed = new Signal();
        this._stream_finished = new Signal();
        this._audio_manager = AudioManager.get_singleton();
        this._current_source = null;
    }

    get stream() { return this._stream; }
    get volume() { return this._volume; }
    get pitch_scale() { return this._pitch_scale; }
    get playing() { return this._playing; }
    get loop() { return this._loop; }
    get autoplay() { return this._autoplay; }
    get max_distance() { return this._max_distance; }
    get attenuation() { return this._attenuation; }

    set stream(value) { this._stream = value; }
    set volume(value) { this._volume = Math.max(0, Math.min(1, value)); }
    set pitch_scale(value) { this._pitch_scale = value; }
    set loop(value) { this._loop = value; }
    set autoplay(value) { this._autoplay = value; }
    set max_distance(value) { this._max_distance = value; }
    set attenuation(value) { this._attenuation = value; }

    _ready() {
        super._ready();
        if (this._autoplay && this._stream) {
            this.play();
        }
    }

    play() {
        if (!this._stream) return;

        const listener_pos = this._audio_manager.get_listener_position();
        const distance = this.global_position.distance_to(listener_pos);
        const volume_multiplier = Math.max(0, 1 - (distance / this._max_distance) * this._attenuation);

        this._current_source = this._audio_manager.play_sound(this._stream, this._volume * volume_multiplier, this._loop);
        this._playing = true;
    }

    pause() {
        if (this._current_source) {
            try {
                this._current_source.stop();
            } catch (e) {
            }
        }
        this._playing = false;
        this._stream_paused.emit();
    }

    stop() {
        this.pause();
        this._stream_finished.emit();
    }

    seek(seconds) {
    }

    get_position() {
        return 0;
    }

    get_length() {
        return 0;
    }
}

plane.AudioManager = AudioManager;
plane.AudioStreamPlayer = AudioStreamPlayer;
plane.AudioStreamPlayer2D = AudioStreamPlayer2D;