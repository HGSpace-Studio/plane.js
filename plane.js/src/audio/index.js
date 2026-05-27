class Audio {
    constructor() {
        this._volume = 1.0;
        this._pitch_scale = 1.0;
        this._paused = false;
        this._loop = false;
        this._bus = "Master";
    }

    get volume() { return this._volume; }
    get pitch_scale() { return this._pitch_scale; }
    get paused() { return this._paused; }
    get loop() { return this._loop; }
    get bus() { return this._bus; }

    set volume(value) { this._volume = MathUtils.clamp(value, 0, 1); }
    set pitch_scale(value) { this._pitch_scale = value; }
    set paused(value) { this._paused = value; }
    set loop(value) { this._loop = value; }
    set bus(value) { this._bus = value.toString(); }

    play() {}
    stop() {}
    pause() {}
    resume() {}
}

class AudioStreamPlayer extends Audio {
    static PLAYBACK_IDLE = 0;
    static PLAYBACK_PLAYING = 1;
    static PLAYBACK_PAUSED = 2;

    constructor() {
        super();
        this._stream = null;
        this._audio_node = null;
        this._playback_pos = 0;
        this._playback_mode = AudioStreamPlayer.PLAYBACK_IDLE;
        this._stream_position = 0;
        this._mix_rate = 44100;
        this._autoplay = false;
    }

    get stream() { return this._stream; }
    get playback_pos() { return this._playback_pos; }
    get playback_mode() { return this._playback_mode; }
    get autoplay() { return this._autoplay; }

    set stream(value) { this._stream = value; }
    set autoplay(value) { this._autoplay = value; }

    _ready() {
        super._ready();
        if (this._autoplay) {
            this.play();
        }
    }

    play(start_pos = 0) {
        if (!this._stream) return;
        this._playback_mode = AudioStreamPlayer.PLAYBACK_PLAYING;
        this._playback_pos = start_pos;
    }

    stop() {
        this._playback_mode = AudioStreamPlayer.PLAYBACK_IDLE;
        this._playback_pos = 0;
    }

    pause() {
        if (this._playback_mode === AudioStreamPlayer.PLAYBACK_PLAYING) {
            this._playback_mode = AudioStreamPlayer.PLAYBACK_PAUSED;
        }
    }

    resume() {
        if (this._playback_mode === AudioStreamPlayer.PLAYBACK_PAUSED) {
            this._playback_mode = AudioStreamPlayer.PLAYBACK_PLAYING;
        }
    }

    seek(pos) {
        this._playback_pos = pos;
    }

    _process(dt) {
        if (this._playback_mode === AudioStreamPlayer.PLAYBACK_PLAYING && this._stream) {
            this._playback_pos += dt;
        }
    }
}

class AudioStreamPlayer2D extends AudioStreamPlayer {
    constructor() {
        super();
        this._position = new Vector2(0, 0);
        this._attenuation = 1.0;
        this._max_distance = 1000;
        this._out_of_range = false;
        this._volume_db = 0;
        this._area_mask = 1;
        this._max_panning_strength = 1.0;
        this._emission_angle = Math.PI * 2;
        this._emission_angle_delta = 0;
        this._attenuation_model = 0;
        this._unit_db = 3;
        this._unit_size = 1.0;
        this._max_polyphony = 4;
    }

    get position() { return this._position.clone(); }
    get attenuation() { return this._attenuation; }
    get max_distance() { return this._max_distance; }
    get volume_db() { return this._volume_db; }
    get area_mask() { return this._area_mask; }

    set position(value) { this._position = value.clone(); }
    set attenuation(value) { this._attenuation = value; }
    set max_distance(value) { this._max_distance = value; }
    set volume_db(value) { this._volume_db = value; }
    set area_mask(value) { this._area_mask = value; }

    set_global_position(value) {
        this._position = value.clone();
    }
}

class AudioStreamPlayer3D extends AudioStreamPlayer2D {
    constructor() {
        super();
        this._max_distance = 2000;
        this._attenuation_model = 0;
        this._emission_angle = Math.PI * 2;
        this._emission_angle_delta = 0;
        this._unit_db = 3;
        this._unit_size = 1.0;
        this._max_polyphony = 4;
        this._out_of_range = false;
    }
}

class AudioManager {
    constructor() {
        this._master_bus = null;
        this._streams = {};
        this._audio_context = null;
        this._master_gain = null;
        this._volume = 1.0;
        this._mute = false;
        this._bus_list = [{ name: "Master", volume: 1.0, children: [] }];
        this._current_bus = 0;
    }

    static get_singleton() {
        if (!AudioManager._instance) {
            AudioManager._instance = new AudioManager();
        }
        return AudioManager._instance;
    }

    _init() {
        if (typeof AudioContext !== 'undefined') {
            this._audio_context = new AudioContext();
            this._master_gain = this._audio_context.createGain();
            this._master_gain.connect(this._audio_context.destination);
        }
    }

    get volume() { return this._volume; }
    get mute() { return this._mute; }

    set volume(value) {
        this._volume = MathUtils.clamp(value, 0, 1);
        if (this._master_gain) {
            this._master_gain.gain.value = this._mute ? 0 : this._volume;
        }
    }

    set mute(value) {
        this._mute = value;
        if (this._master_gain) {
            this._master_gain.gain.value = this._mute ? 0 : this._volume;
        }
    }

    play_sound(sound_path, volume = 1.0, loop = false) {
        if (!this._audio_context) {
            this._init();
        }
        const audio = new Audio(sound_path);
        audio.volume = volume * this._volume;
        audio.loop = loop;
        audio.play();
        return audio;
    }

    stop_sound(audio) {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    stop_all_sounds() {
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    set_bus_count(count) {
    }

    add_bus(index = -1) {
    }

    remove_bus(index) {
    }

    set_bus_volume(bus, volume_db) {
    }

    get_bus_volume(bus) {
        return 0;
    }

    set_bus_mute(bus, mute) {
    }

    set_bus_bypass_fx(bus, bypass) {
    }
}

AudioManager._instance = null;

plane.Audio = Audio;
plane.AudioStreamPlayer = AudioStreamPlayer;
plane.AudioStreamPlayer2D = AudioStreamPlayer2D;
plane.AudioStreamPlayer3D = AudioStreamPlayer3D;
plane.AudioManager = AudioManager;