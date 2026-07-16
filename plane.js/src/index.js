window.plane = {
    version: "1.0.0",
    author: "plane.js Team",
    license: "MIT",
    _initialized: false,
    _main_loop: null,
    _root_node: null,
    get initialized() { return this._initialized; },
    get main_loop() { return this._main_loop; },
    get root_node() { return this._root_node; }
};

window.global_events = {
    _signals: {},
    get_signal(name) {
        if (!this._signals[name]) this._signals[name] = {
            _listeners: [],
            _once_listeners: [],
            connect(callback, target = null) { this._listeners.push({ callback, target }); },
            connect_once(callback, target = null) { this._once_listeners.push({ callback, target }); },
            disconnect(callback, target = null) {
                this._listeners = this._listeners.filter(l => l.callback !== callback || (target !== null && l.target !== target));
                this._once_listeners = this._once_listeners.filter(l => l.callback !== callback || (target !== null && l.target !== target));
            },
            emit(...args) {
                for (const listener of this._listeners) listener.callback.apply(listener.target, args);
                for (const listener of this._once_listeners) listener.callback.apply(listener.target, args);
                this._once_listeners = [];
            }
        };
        return this._signals[name];
    },
    connect(signal_name, callback, target = null) { this.get_signal(signal_name).connect(callback, target); },
    connect_once(signal_name, callback, target = null) { this.get_signal(signal_name).connect_once(callback, target); },
    disconnect(signal_name, callback, target = null) { if (this._signals[signal_name]) this._signals[signal_name].disconnect(callback, target); },
    emit(signal_name, ...args) { if (this._signals[signal_name]) this._signals[signal_name].emit(...args); },
    clear_signal(signal_name) { if (this._signals[signal_name]) { this._signals[signal_name]._listeners = []; this._signals[signal_name]._once_listeners = []; } },
    clear_all() { this._signals = {}; }
};

const basePath = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);

function loadScriptSync(src) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', basePath + src, false);
    xhr.send();
    let code = xhr.responseText;
    code = code.replace(/export\s+default\s+\w+;\s*/g, '');
    code = code.replace(/export\s*\{\s*[\w\s,]*\s*\};\s*/g, '');
    const script = document.createElement('script');
    script.textContent = code;
    document.head.appendChild(script);
}

loadScriptSync('./math/Vector2.js');
loadScriptSync('./math/Rect2.js');
loadScriptSync('./math/Transform2D.js');
loadScriptSync('./math/Color.js');
loadScriptSync('./math/MathUtils.js');
loadScriptSync('./core/EventBus.js');
loadScriptSync('./core/node.js');
loadScriptSync('./core/SceneTree.js');
loadScriptSync('./core/MainLoop.js');
loadScriptSync('./nodes/Node2D.js');
loadScriptSync('./core/engine.js');
loadScriptSync('./input/Input.js');
loadScriptSync('./audio/AudioStreamPlayer.js');
loadScriptSync('./scene/Scene.js');
loadScriptSync('./camera/Camera2D.js');
loadScriptSync('./renderer/Renderer.js');
loadScriptSync('./nodes/Sprite.js');
loadScriptSync('./nodes/AnimatedSprite.js');
loadScriptSync('./nodes/Label.js');
loadScriptSync('./nodes/ColorRect.js');
loadScriptSync('./nodes/TextureRect.js');
loadScriptSync('./nodes/Container.js');
loadScriptSync('./nodes/TileMap.js');
loadScriptSync('./nodes/Particle2D.js');
loadScriptSync('./components/SpriteRenderer.js');
loadScriptSync('./physics/RigidBody2D.js');
loadScriptSync('./animation/Animation.js');
loadScriptSync('./resources/ResourceLoader.js');
loadScriptSync('./ui/Control.js');

const __saved_classes = {};
const __skip_keys = ['version', 'author', 'license', '_initialized', '_main_loop', '_root_node', 'initialized', 'main_loop', 'root_node'];
for (const key of Object.keys(window.plane)) {
    if (!__skip_keys.includes(key)) {
        __saved_classes[key] = window.plane[key];
    }
}

loadScriptSync('./core/Plane.js');

for (const key of Object.keys(__saved_classes)) {
    window.plane[key] = __saved_classes[key];
}