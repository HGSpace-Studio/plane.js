# 核心模块 API 文档

## plane 对象

引擎全局对象，挂载在 `window.plane` 上。

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `version` | `string` | 引擎版本号 |
| `author` | `string` | 作者信息 |
| `license` | `string` | 许可证 |
| `initialized` | `boolean` | 只读，是否已初始化 |
| `main_loop` | `SceneTree` | 只读，当前主循环 |
| `root_node` | `Node` | 只读，根节点 |

### 方法

#### `plane.start(main_loop?)`
启动引擎。

```javascript
// 使用默认 SceneTree
plane.start();

// 使用自定义 SceneTree
const tree = new plane.SceneTree();
plane.start(tree);
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `main_loop` | `SceneTree` | `new SceneTree()` | 主循环/场景树实例 |

#### `plane.get_tree()` → `SceneTree`
获取当前场景树。

#### `plane.get_root()` → `Node`
获取引擎根节点。

#### `plane.get_main_loop()` → `SceneTree`
获取主循环实例。

#### `plane.get_input()` → `Input`
获取输入管理器。

#### `plane.get_world_2d()` → `World2D`
获取当前 2D 世界。

#### `plane.get_frames()` → `number`
获取当前 FPS。

#### `plane.get_delta()` → `number`
获取帧间隔时间（秒）。

#### `plane.get_time()` → `number`
获取引擎固定时间。

#### `plane.change_scene(scene)`
切换场景。

```javascript
const newScene = new plane.Scene();
newScene.name = "Level2";
plane.change_scene(newScene);
```

#### `plane.reload_current_scene()`
重新加载当前场景。

#### `plane.load_scene(path)` → `Promise`
异步加载场景资源。

```javascript
const scene = await plane.load_scene("scenes/level1.json");
```

#### `plane.load_image(path)` → `Promise`
异步加载图片纹理。

```javascript
const texture = await plane.load_image("assets/player.png");
```

#### `plane.play_sound(path, volume?, loop?)` → `AudioBufferSourceNode`
播放音效。

```javascript
const source = plane.play_sound("assets/jump.wav", 0.8, false);
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `path` | `string` | - | 音频文件路径 |
| `volume` | `number` | `1.0` | 音量 0~1 |
| `loop` | `boolean` | `false` | 是否循环 |

#### `plane.stop_sound(audio)`
停止指定音频。

#### `plane.stop_all_sounds()`
停止所有音频。

#### `plane.create_timer(time, callback)` → `Timer`
创建计时器。

```javascript
const timer = plane.create_timer(2.0, () => {
    console.log("2秒后触发");
});
// timer.time_left  - 剩余时间
// timer.stop()     - 停止
// timer.is_stopped() - 是否已停止
```

#### `plane.pause()`
暂停引擎。

#### `plane.resume()`
恢复引擎。

#### `plane.set_time_scale(scale)`
设置时间缩放。

```javascript
plane.set_time_scale(0.5); // 半速
plane.set_time_scale(2.0); // 双倍速
```

#### `plane.get_time_scale()` → `number`
获取当前时间缩放。

#### `plane.quit()`
退出引擎。

---

## Node 类

所有节点的基类。

### 构造函数

```javascript
const node = new plane.Node();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | `"Node"` | 节点名称 |
| `_parent` | `Node` | `null` | 父节点 |
| `_children` | `Node[]` | `[]` | 子节点列表 |
| `_visible` | `boolean` | `true` | 是否可见 |
| `_processing` | `boolean` | `false` | 是否启用 _process |
| `_physics_processing` | `boolean` | `false` | 是否启用 _physics_process |
| `_groups` | `string[]` | `[]` | 所属分组 |

### 生命周期方法

这些方法由引擎自动调用，可在子类中重写：

#### `_enter_tree()`
节点进入场景树时调用。

#### `_exit_tree()`
节点离开场景树时调用。

#### `_process(dt)`
每帧调用，`dt` 为帧间隔（秒）。

```javascript
node._process = function(dt) {
    this.position = this.position.add(new plane.Vector2(100 * dt, 0));
};
node.set_process(true);
```

#### `_physics_process(dt)`
每物理帧调用。

### 节点操作

#### `add_child(node, force_readable_name?)`
添加子节点。

```javascript
const child = new plane.Node2D();
child.name = "Player";
parent.add_child(child);
```

#### `remove_child(node)`
移除子节点。

#### `get_child(index)` → `Node`
获取指定索引的子节点。

#### `get_child_count()` → `number`
获取子节点数量。

#### `get_children()` → `Node[]`
获取所有子节点（返回副本）。

#### `find_child(name, recursive?, owned_only?)` → `Node`
按名称查找子节点。

```javascript
const player = root.find_child("Player", true);
```

#### `find_node(name, recursive?, owned_only?)` → `Node`
查找节点（包含自身）。

#### `get_node(path)` → `Node`
通过路径获取节点。

```javascript
// 相对路径
const child = node.get_node("Child/GrandChild");
// 绝对路径
const target = node.get_node("/root/Scene/Player");
// 使用 ..
const parent = node.get_node("..");
```

#### `get_parent()` → `Node`
获取父节点。

#### `is_inside_tree()` → `boolean`
是否在场景树中。

#### `queue_free()`
在帧末安全移除节点。

#### `duplicate(flags?)` → `Node`
复制节点（深拷贝子节点）。

### 分组

#### `add_to_group(name, persistent?)`
添加到分组。

#### `remove_from_group(name)`
从分组移除。

#### `is_in_group(name)` → `boolean`
是否在指定分组中。

#### `get_groups()` → `string[]`
获取所有分组。

### 可见性与处理

#### `set_process(enabled)`
启用/禁用每帧处理。

#### `set_physics_process(enabled)`
启用/禁用物理帧处理。

#### `set_visible(visible)`
设置可见性。

#### `is_visible()` → `boolean`
获取可见性。

---

## NodePath 类

节点路径解析工具。

### 构造函数

```javascript
const path = new plane.NodePath("Scene/Player/Sprite");
const absPath = new plane.NodePath("/root/Scene/Player");
```

### 方法

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `get_name(index)` | `string` | 获取路径中指定索引的名称 |
| `get_length()` | `number` | 获取路径段数 |
| `is_absolute()` | `boolean` | 是否为绝对路径 |
| `get_as_property_path()` | `string` | 获取属性路径字符串 |
| `get_concatenated_subpath(begin, end)` | `NodePath` | 获取子路径 |
| `equals(other)` | `boolean` | 路径是否相等 |
| `to_string()` | `string` | 转为字符串 |

### 静态方法

#### `NodePath.from_node(node)` → `NodePath`
从节点生成其绝对路径。

---

## SceneTree 类

继承自 `Node`。场景树，管理场景切换与生命周期。

### 构造函数

```javascript
const tree = new plane.SceneTree();
```

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `current_scene` | `Scene` | 只读，当前场景 |
| `root_viewport` | `Viewport` | 只读，根视口 |
| `paused` | `boolean` | 是否暂停 |
| `time_scale` | `number` | 时间缩放 |

### 方法

#### `change_scene(scene)`
切换当前场景。

```javascript
const scene = new plane.Scene();
scene.name = "GameOver";
tree.change_scene(scene);
```

#### `reload_current_scene()`
重新加载当前场景。

#### `quit()`
请求退出。

#### `set_root_viewport(viewport)`
设置根视口。

#### `get_root_viewport()` → `Viewport`
获取根视口。

#### `set_auto_accept_quit(value)`
设置是否自动接受退出。

#### `set_quit_on_go_back(value)`
设置返回时是否退出。

---

## MainLoop 类

主循环，控制帧率与物理步进。

### 构造函数

```javascript
const loop = new plane.MainLoop();
```

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `fixed_delta` | `number` | 只读，固定物理步长 |
| `time` | `number` | 只读，累计时间 |
| `delta` | `number` | 只读，帧间隔 |
| `paused` | `boolean` | 是否暂停 |
| `time_scale` | `number` | 时间缩放 |
| `frames` | `number` | 只读，当前 FPS |
| `root` | `Node` | 只读，根节点 |

### 方法

#### `initialize(root)`
初始化主循环。

#### `start()`
启动主循环。

#### `quit()`
停止主循环。

#### `get_delta_time()` → `number`
获取帧间隔时间。

#### `get_fixed_time()` → `number`
获取固定时间。

#### `get_frame_count()` → `number`
获取帧计数。

---

## Engine 类

引擎核心（单例），驱动 tick 循环与节点遍历。

### 获取实例

```javascript
const engine = plane.Engine.get_singleton();
// 或
const engine = plane.Engine.get_instance();
```

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `active` | `boolean` | 只读，是否激活 |
| `paused` | `boolean` | 是否暂停 |
| `delta_time` | `number` | 只读，帧间隔 |
| `physics_delta_time` | `number` | 只读，物理帧间隔 |
| `time_scale` | `number` | 时间缩放 |
| `fps` | `number` | 只读，当前 FPS |
| `root` | `Node` | 只读，根节点 |
| `main_loop` | `MainLoop` | 只读，主循环 |

### 方法

#### `initialize(root_viewport)`
初始化引擎。

#### `start(main_loop)`
启动引擎。

#### `quit()`
退出引擎。

#### `get_delta_time()` → `number`
获取帧间隔（含时间缩放）。

#### `get_physics_delta_time()` → `number`
获取物理帧间隔（含时间缩放）。

#### `get_fixed_time()` → `number`
获取固定时间。

#### `get_root()` → `Node`
获取根节点。

#### `set_root_node(node)`
设置根节点。

#### `queue_free(node)`
将节点加入待释放队列。

#### `add_to_group(node, group, persistent?)`
将节点添加到分组。

#### `remove_from_group(node, group)`
将节点从分组移除。

#### `get_nodes_in_group(group)` → `Node[]`
获取分组中的所有节点。

#### `get_realtime_elapsed()` → `number`
获取实时经过时间（秒）。

---

## EventBus / Signal 类

### Signal 类

信号，用于事件监听。

```javascript
const signal = new plane.Signal();

// 连接回调
signal.connect((data) => {
    console.log("收到信号:", data);
}, this);

// 单次连接
signal.connect_once(() => {
    console.log("只触发一次");
});

// 发射信号
signal.emit("hello");

// 断开
signal.disconnect(callback);

// 清空
signal.clear();

// 监听器数量
console.log(signal.listener_count);
```

### EventBus 类

事件总线，管理多个命名信号。

```javascript
const bus = new plane.EventBus();

// 连接
bus.connect("player_died", () => {
    console.log("玩家死亡");
});

// 发射
bus.emit("player_died");

// 断开
bus.disconnect("player_died", callback);

// 清空指定信号
bus.clear_signal("player_died");

// 清空所有
bus.clear_all();
```

### 全局事件总线

```javascript
// 全局事件总线
plane.global_events.connect("plane_ready", () => {
    console.log("引擎就绪！");
});
```
