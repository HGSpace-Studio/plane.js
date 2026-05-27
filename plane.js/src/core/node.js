class NodePath {
    constructor(path = "") {
        this._path = path;
        this._names = path ? path.split('/').filter(n => n) : [];
    }

    get path() { return this._path; }
    get names() { return this._names.slice(); }

    get_name(index) { return this._names[index] || ""; }
    get_length() { return this._names.length; }
    is_absolute() { return this._path.startsWith('/'); }

    get_as_property_path() { return this._path; }
    get_concatenated_subpath(begin, end) {
        return new NodePath(this._names.slice(begin, end).join('/'));
    }

    equals(other) { return this._path === other._path; }
    to_string() { return this._path; }

    static from_node(node) {
        let path = "";
        let current = node;
        while (current) {
            path = "/" + current.name + path;
            current = current._parent;
        }
        return new NodePath(path);
    }
}

class Node {
    constructor() {
        this.name = "Node";
        this._parent = null;
        this._children = [];
        this._process_priority = 0;
        this._physics_priority = 0;
        this._visible = true;
        this._process_mode = 2;
        this._physics_process_mode = 2;
        this._ready = false;
        this._processing = false;
        this._physics_processing = false;
        this._tree = null;
        this._groups = [];
        this._owner = null;
        this._free = false;
        this._entered_tree = false;
        this._input_event = null;
        this._gui_input = null;
    }

    _enter_tree() {
        this._entered_tree = true;
        if (typeof this._ready === 'function') {
            setTimeout(() => {
                if (!this._free && this._entered_tree) {
                    this._ready();
                }
            }, 0);
        }
        for (const child of this._children) {
            child._enter_tree();
        }
    }

    _exit_tree() {
        for (const child of this._children) {
            child._exit_tree();
        }
        this._entered_tree = false;
        this._tree = null;
    }

    _process(dt) {
        for (const child of this._children) {
            if (child._processing) {
                child._process(dt);
            }
        }
    }

    _physics_process(dt) {
        for (const child of this._children) {
            if (child._physics_processing) {
                child._physics_process(dt);
            }
        }
    }

    add_child(node, force_readable_name = false) {
        if (node._parent) node._parent.remove_child(node);
        node._parent = this;
        this._children.push(node);
        if (force_readable_name) this._make_readable_name(node);
        if (this._entered_tree) node._enter_tree();
    }

    remove_child(node) {
        const index = this._children.indexOf(node);
        if (index !== -1) {
            this._children.splice(index, 1);
            node._parent = null;
            if (node._entered_tree) node._exit_tree();
        }
    }

    get_child(index) { return this._children[index] || null; }
    get_child_count() { return this._children.length; }
    get_children() { return this._children.slice(); }

    find_child(name, recursive = false, owned_only = false) {
        for (const child of this._children) {
            if (child.name === name && (!owned_only || child._owner === this._owner)) {
                return child;
            }
            if (recursive) {
                const found = child.find_child(name, true, owned_only);
                if (found) return found;
            }
        }
        return null;
    }

    find_node(name, recursive = true, owned_only = true) {
        if (this.name === name) return this;
        return this.find_child(name, recursive, owned_only);
    }

    get_node(path) {
        const nodePath = path instanceof NodePath ? path : new NodePath(path);
        if (nodePath.is_absolute()) {
            const root = this._get_root();
            return root ? root._get_node_relative(nodePath._names.slice(1)) : null;
        }
        return this._get_node_relative(nodePath._names);
    }

    _get_node_relative(names) {
        let current = this;
        for (const name of names) {
            if (name === ".") continue;
            if (name === "..") {
                current = current._parent;
                if (!current) return null;
                continue;
            }
            const found = current.find_child(name, false, false);
            if (!found) return null;
            current = found;
        }
        return current;
    }

    _get_root() {
        let current = this;
        while (current._parent) {
            current = current._parent;
        }
        return current;
    }

    _get_tree() {
        const root = this._get_root();
        return root instanceof SceneTree ? root : null;
    }

    add_to_group(name, persistent = false) {
        if (!this._groups.includes(name)) {
            this._groups.push(name);
        }
    }

    remove_from_group(name) {
        const index = this._groups.indexOf(name);
        if (index !== -1) this._groups.splice(index, 1);
    }

    is_in_group(name) { return this._groups.includes(name); }
    get_groups() { return this._groups.slice(); }

    queue_free() {
        this._free = true;
        if (this._parent) {
            setTimeout(() => {
                if (this._parent && this._free) {
                    this._parent.remove_child(this);
                }
            }, 0);
        }
    }

    is_inside_tree() { return this._entered_tree; }
    get_parent() { return this._parent; }
    set_process(enabled) { this._processing = enabled; }
    set_physics_process(enabled) { this._physics_processing = enabled; }
    set_visible(visible) { this._visible = visible; }
    is_visible() { return this._visible; }

    _make_readable_name(node) {
        let base_name = node.name;
        let count = 1;
        while (this.find_child(node.name, false, false)) {
            node.name = base_name + "_" + count++;
        }
    }

    duplicate(flags = 15) {
        const clone = Object.create(Object.getPrototypeOf(this));
        Object.assign(clone, this);
        clone._parent = null;
        clone._children = [];
        clone._groups = [];
        clone.name = this.name + "_copy";
        for (const child of this._children) {
            clone.add_child(child.duplicate(flags));
        }
        return clone;
    }
}

plane.Node = Node;
plane.NodePath = NodePath;