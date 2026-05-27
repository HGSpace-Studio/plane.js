class ResourceLoader {
    static _instance = null;

    constructor() {
        this._cache = {};
        this._loading = {};
        this._formats = {};
        this._max_cache_size = 100;
        this._cache_hits = 0;
        this._cache_misses = 0;
    }

    static get_singleton() {
        if (!ResourceLoader._instance) {
            ResourceLoader._instance = new ResourceLoader();
        }
        return ResourceLoader._instance;
    }

    load(path, type = "Resource") {
        if (this._cache[path]) {
            this._cache_hits++;
            return Promise.resolve(this._cache[path]);
        }

        this._cache_misses++;

        return new Promise((resolve, reject) => {
            if (this._loading[path]) {
                this._loading[path].push({ resolve, reject });
                return;
            }

            this._loading[path] = [{ resolve, reject }];

            const extension = path.split('.').pop().toLowerCase();

            if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {
                this._load_image(path).then(resource => {
                    this._cache_resource(path, resource);
                    this._resolve_loaders(path, resource);
                }).catch(error => {
                    this._reject_loaders(path, error);
                });
            } else if (extension === 'wav' || extension === 'mp3' || extension === 'ogg') {
                this._load_audio(path).then(resource => {
                    this._cache_resource(path, resource);
                    this._resolve_loaders(path, resource);
                }).catch(error => {
                    this._reject_loaders(path, error);
                });
            } else {
                this._load_text(path).then(text => {
                    const resource = { data: text, path, type };
                    this._cache_resource(path, resource);
                    this._resolve_loaders(path, resource);
                }).catch(error => {
                    this._reject_loaders(path, error);
                });
            }
        });
    }

    load_async(path, type = "Resource") {
        return this.load(path, type);
    }

    load_multiple(paths) {
        return Promise.all(paths.map(path => this.load(path)));
    }

    has(path) {
        return !!this._cache[path];
    }

    get(path) {
        return this._cache[path] || null;
    }

    unload(path) {
        if (this._cache[path]) {
            delete this._cache[path];
        }
    }

    clear_cache() {
        this._cache = {};
        this._cache_hits = 0;
        this._cache_misses = 0;
    }

    get_cache_info() {
        return {
            size: Object.keys(this._cache).length,
            hits: this._cache_hits,
            misses: this._cache_misses,
            hit_rate: this._cache_hits + this._cache_misses > 0
                ? (this._cache_hits / (this._cache_hits + this._cache_misses)) * 100
                : 0
        };
    }

    add_format_loader(format, loader) {
        this._formats[format] = loader;
    }

    _load_image(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                resolve({
                    type: 'ImageTexture',
                    data: img,
                    width: img.width,
                    height: img.height,
                    path
                });
            };
            img.onerror = () => {
                reject(new Error(`Failed to load image: ${path}`));
            };
            img.src = path;
        });
    }

    _load_audio(path) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.onloadeddata = () => {
                resolve({
                    type: 'AudioStream',
                    data: audio,
                    duration: audio.duration,
                    path
                });
            };
            audio.onerror = () => {
                reject(new Error(`Failed to load audio: ${path}`));
            };
            audio.src = path;
        });
    }

    _load_text(path) {
        return fetch(path).then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${path}: ${response.status}`);
            }
            return response.text();
        });
    }

    _cache_resource(path, resource) {
        if (Object.keys(this._cache).length >= this._max_cache_size) {
            const oldest = Object.keys(this._cache)[0];
            delete this._cache[oldest];
        }
        this._cache[path] = resource;
    }

    _resolve_loaders(path, resource) {
        if (this._loading[path]) {
            for (const { resolve } of this._loading[path]) {
                resolve(resource);
            }
            delete this._loading[path];
        }
    }

    _reject_loaders(path, error) {
        if (this._loading[path]) {
            for (const { reject } of this._loading[path]) {
                reject(error);
            }
            delete this._loading[path];
        }
    }
}

class Resource {
    constructor() {
        this._path = "";
        this._name = "";
        this._loaded = false;
        this._error = null;
    }

    get path() { return this._path; }
    get name() { return this._name; }
    get loaded() { return this._loaded; }
    get error() { return this._error; }

    set path(value) { this._path = value; }
    set name(value) { this._name = value; }

    load() {
        return ResourceLoader.get_singleton().load(this._path).then(resource => {
            this._loaded = true;
            return resource;
        }).catch(error => {
            this._error = error;
            throw error;
        });
    }

    reload() {
        ResourceLoader.get_singleton().unload(this._path);
        this._loaded = false;
        this._error = null;
        return this.load();
    }

    save(path = "") {
    }
}

class Texture extends Resource {
    constructor() {
        super();
        this._width = 0;
        this._height = 0;
        this._data = null;
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get data() { return this._data; }

    set width(value) { this._width = value; }
    set height(value) { this._height = value; }
    set data(value) { this._data = value; }
}

class ImageTexture extends Texture {
    constructor() {
        super();
        this._image = null;
        this._format = 0;
        this._flags = 0;
    }

    get image() { return this._image; }
    get format() { return this._format; }

    set image(value) { this._image = value; }
    set format(value) { this._format = value; }

    load_from_image(image) {
        this._image = image;
        this._width = image.width;
        this._height = image.height;
        this._loaded = true;
    }

    load_from_path(path) {
        return ResourceLoader.get_singleton().load(path, "ImageTexture").then(resource => {
            this._image = resource.data;
            this._width = resource.width;
            this._height = resource.height;
            this._path = path;
            this._loaded = true;
            return this;
        });
    }
}

plane.ResourceLoader = ResourceLoader;
plane.Resource = Resource;
plane.Texture = Texture;
plane.ImageTexture = ImageTexture;