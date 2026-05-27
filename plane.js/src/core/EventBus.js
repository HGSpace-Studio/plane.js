class Signal {
    constructor() {
        this._listeners = [];
        this._once_listeners = [];
    }

    connect(callback, target = null) { this._listeners.push({ callback, target }); }
    connect_once(callback, target = null) { this._once_listeners.push({ callback, target }); }

    disconnect(callback, target = null) {
        this._listeners = this._listeners.filter(l => l.callback !== callback || (target !== null && l.target !== target));
        this._once_listeners = this._once_listeners.filter(l => l.callback !== callback || (target !== null && l.target !== target));
    }

    emit(...args) {
        for (const listener of this._listeners) listener.callback.apply(listener.target, args);
        for (const listener of this._once_listeners) listener.callback.apply(listener.target, args);
        this._once_listeners = [];
    }

    clear() { this._listeners = []; this._once_listeners = []; }
    get listener_count() { return this._listeners.length + this._once_listeners.length; }
}

class EventBus {
    constructor() { this._signals = {}; }

    get_signal(name) {
        if (!this._signals[name]) this._signals[name] = new Signal();
        return this._signals[name];
    }

    connect(signal_name, callback, target = null) { this.get_signal(signal_name).connect(callback, target); }
    connect_once(signal_name, callback, target = null) { this.get_signal(signal_name).connect_once(callback, target); }
    disconnect(signal_name, callback, target = null) { if (this._signals[signal_name]) this._signals[signal_name].disconnect(callback, target); }
    emit(signal_name, ...args) { if (this._signals[signal_name]) this._signals[signal_name].emit(...args); }
    clear_signal(signal_name) { if (this._signals[signal_name]) this._signals[signal_name].clear(); }
    clear_all() { this._signals = {}; }
}

const global_events = new EventBus();

plane.Signal = Signal;
plane.EventBus = EventBus;
plane.global_events = global_events;