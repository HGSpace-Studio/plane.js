# EventBus & Signal

事件系统，用于节点间通信和全局事件管理。

## Signal

信号类，用于单个事件的监听和触发。

### 构造函数

```javascript
const signal = new plane.Signal();
```

### 方法

#### connect(callback, target)

连接信号。

**参数：**
- `callback` (`Function`) - 回调函数
- `target` (`Object`, 可选) - 回调的 `this` 绑定

#### connect_once(callback, target)

连接一次性信号，触发后自动断开。

#### disconnect(callback, target)

断开信号连接。

#### emit(...args)

触发信号，调用所有监听者。

#### clear()

清除所有监听者。

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `listener_count` | `number` | 监听者数量（只读） |

### 示例

```javascript
const health_changed = new plane.Signal();

// 连接
health_changed.connect((new_health) => {
    console.log('生命值变为:', new_health);
});

// 触发
health_changed.emit(100);
```

---

## EventBus

事件总线，管理多个命名信号。

### 构造函数

```javascript
const bus = new plane.EventBus();
```

### 方法

#### get_signal(name)

获取或创建命名信号。

**返回：** `Signal`

#### connect(signal_name, callback, target)

连接命名信号。

#### connect_once(signal_name, callback, target)

连接一次性命名信号。

#### disconnect(signal_name, callback, target)

断开命名信号。

#### emit(signal_name, ...args)

触发命名信号。

#### clear_signal(signal_name)

清除指定信号的所有监听者。

#### clear_all()

清除所有信号。

### 示例

```javascript
const bus = new plane.EventBus();

bus.connect('player_hit', (damage) => {
    console.log('玩家受到', damage, '伤害');
});

bus.emit('player_hit', 25);
```

---

## global_events

全局事件总线实例，用于引擎级事件通信。

```javascript
// 监听引擎事件
global_events.connect('plane_ready', () => {
    console.log('引擎就绪');
});

global_events.connect('process_frame', (dt) => {
    // 每帧调用
});

global_events.connect('physics_frame', (dt) => {
    // 每个物理帧调用
});

// 自定义事件
global_events.connect('game_over', (score) => {
    console.log('游戏结束，得分:', score);
});

global_events.emit('game_over', 1000);
```

### 内置事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `plane_ready` | 无 | 引擎初始化完成 |
| `plane_initialized` | 无 | 引擎已初始化 |
| `engine_started` | 无 | 引擎启动 |
| `engine_initialized` | 无 | 引擎初始化 |
| `engine_quit` | 无 | 引擎退出 |
| `process_frame` | `dt` | 每帧处理 |
| `physics_frame` | `dt` | 物理帧 |
| `quit_request` | 无 | 退出请求 |
