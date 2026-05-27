class Resource {
    constructor() {
        this._resource_path = "";
        this._resource_name = "";
        this._type = "";
        this._local_to_scene = true;
        this._imported = false;
    }

    get resource_path() { return this._resource_path; }
    get resource_name() { return this._resource_name; }
    get type() { return this._type; }
    get local_to_scene() { return this._local_to_scene; }
    get imported() { return this._imported; }

    set resource_path(value) { this._resource_path = value.toString(); }
    set resource_name(value) { this._resource_name = value.toString(); }
    set local_to_scene(value) { this._local_to_scene = value; }
}

class ResourceLoader {
    constructor() {
        this._cache = {};
        this._loaders = {};
        this._loading_queue = [];
        this._threaded = false;
        this._fail_on_missing = true;
        this._remap_enabled = true;
    }

    static get_singleton() {
        if (!ResourceLoader._instance) {
            ResourceLoader._instance = new ResourceLoader();
        }
        return ResourceLoader._instance;
    }

    load(path, type_hint = "") {
        if (this._cache[path]) {
            return this._cache[path];
        }
        const resource = this._try_load(path, type_hint);
        if (resource) {
            this._cache[path] = resource;
        }
        return resource;
    }

    async load_async(path, type_hint = "") {
        if (this._cache[path]) {
            return this._cache[path];
        }
        const resource = await this._try_load_async(path, type_hint);
        if (resource) {
            this._cache[path] = resource;
        }
        return resource;
    }

    _try_load(path, type_hint) {
        const ext = this._get_extension(path);
        const loader = this._get_loader_for_extension(ext);
        if (loader) {
            return loader.load(path);
        }
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp') {
            return this._load_image_sync(path);
        }
        if (ext === 'wav' || ext === 'mp3' || ext === 'ogg') {
            return this._load_audio_sync(path);
        }
        return null;
    }

    async _try_load_async(path, type_hint) {
        const ext = this._get_extension(path);
        const loader = this._get_loader_for_extension(ext);
        if (loader && loader.load_async) {
            return await loader.load_async(path);
        }
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp') {
            return await this._load_image_async(path);
        }
        if (ext === 'wav' || ext === 'mp3' || ext === 'ogg') {
            return await this._load_audio_async(path);
        }
        return null;
    }

    _load_image_sync(path) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = path;
        });
    }

    async _load_image_async(path) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = path;
        });
    }

    _load_audio_sync(path) {
        return path;
    }

    async _load_audio_async(path) {
        return path;
    }

    _get_extension(path) {
        const parts = path.split('.');
        return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    }

    _get_loader_for_extension(ext) {
        return this._loaders[ext] || null;
    }

    add_resource_format_loader(loader) {
        if (loader.extensions) {
            for (const ext of loader.extensions) {
                this._loaders[ext.toLowerCase()] = loader;
            }
        }
    }

    remove_resource_format_loader(loader) {
    }

    exists(path) {
        return this._cache.hasOwnProperty(path);
    }

    get_resource(path) {
        return this._cache[path] || null;
    }

    cache_resource(resource, path) {
        this._cache[path] = resource;
    }

    clear_cache(complete = false) {
        if (complete) {
            this._cache = {};
        }
    }

    get_loading进度() {
        return this._loading_queue.length;
    }

    load_threaded_get_status(path) {
        if (this._cache[path]) return 2;
        if (this._loading_queue.includes(path)) return 1;
        return 0;
    }

    load_threaded_get(path) {
        return this._cache[path] || null;
    }
}

ResourceLoader._instance = null;

class ResourceSaver {
    static SAVE_FLAG_NONE = 0;
    static SAVE_FLAG_RELATIVE = 1;
    static SAVE_FLAG_BUNDLE_RESOURCES = 2;
    static SAVE_FLAG_CHANGE_PATH = 4;
    static SAVE_FLAG_OMIT_EDITOR_PROPERTIES = 8;
    static SAVE_FLAG_SAVE_BIG_ENDIAN = 16;
    static SAVE_FLAG_COMPRESS = 32;

    constructor() {
        this._savers = {};
    }

    static get_singleton() {
        if (!ResourceSaver._instance) {
            ResourceSaver._instance = new ResourceSaver();
        }
        return ResourceSaver._instance;
    }

    save(path, resource, flags = ResourceSaver.SAVE_FLAG_NONE) {
        const ext = this._get_extension(path);
        const saver = this._get_saver_for_extension(ext);
        if (saver) {
            return saver.save(path, resource, flags);
        }
        console.warn(`No saver found for extension: ${ext}`);
        return 0;
    }

    get_recognized_extensions(resource) {
        const extensions = [];
        for (const ext in this._savers) {
            extensions.push(ext);
        }
        return extensions;
    }

    add_resource_format_saver(saver) {
        if (saver.extensions) {
            for (const ext of saver.extensions) {
                this._savers[ext.toLowerCase()] = saver;
            }
        }
    }

    _get_extension(path) {
        const parts = path.split('.');
        return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    }

    _get_saver_for_extension(ext) {
        return this._savers[ext] || null;
    }
}

ResourceSaver._instance = null;

class Texture extends Resource {
    constructor() {
        super();
        this._width = 0;
        this._height = 0;
        this._format = 0;
        this._flags = 0;
        this._data = null;
        this._draw_navigation = false;
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get format() { return this._format; }
    get flags() { return this._flags; }

    set width(value) { this._width = value; }
    set height(value) { this._height = value; }
    set format(value) { this._format = value; }
    set flags(value) { this._flags = value; }
}

class ImageTexture extends Texture {
    constructor() {
        super();
        this._image = null;
        this._lossy_enabled = false;
        this._lossy_quality = 0.7;
    }

    create_from_image(image, flags = 7) {
        this._image = image;
        this._width = image.width;
        this._height = image.height;
        this._flags = flags;
    }
}

class SampleLibrary {
    constructor() {
        this._samples = {};
    }

    add_sample(name, sample) {
        this._samples[name] = sample;
    }

    get_sample(name) {
        return this._samples[name] || null;
    }

    remove_sample(name) {
        delete this._samples[name];
    }

    get_sample_names() {
        return Object.keys(this._samples);
    }
}

class ResourcePreloader {
    constructor() {
        this._resources = {};
    }

    add_resource(name, resource) {
        this._resources[name] = resource;
    }

    get_resource(name) {
        return this._resources[name] || null;
    }

    has_resource(name) {
        return !!this._resources[name];
    }

    remove_resource(name) {
        delete this._resources[name];
    }

    get_resource_list() {
        return Object.keys(this._resources);
    }
}

plane.Resource = Resource;
plane.ResourceLoader = ResourceLoader;
plane.ResourceSaver = ResourceSaver;
plane.Texture = Texture;
plane.ImageTexture = ImageTexture;
plane.SampleLibrary = SampleLibrary;
plane.ResourcePreloader = ResourcePreloader;