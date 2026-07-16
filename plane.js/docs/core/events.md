# Events 事件系统

事件系统提供信号和事件总线机制，用于组件间通信。

## Signal 类

信号类，实现观察者模式的事件系统。

### 构造函数

```javascript
const signal = new plane.Signal();
```

### 方法

#### `connect(callback, target?)`
连接信号到回调函数。

**参数：**
- `callback` (`Function`) - 回调函数
- `target` (`Object`, 可选) - 回调函数的 `this` 绑定

**示例：**
```javascript
const signal = new plane.Signal();
signal.connect((data) => {
    console.log('Signal emitted:', data);
});
```

#### `connect_once(callback, target?)`
连接信号，但只触发一次后自动断开。

**参数：**
- `callback` (`Function`) - 回调函数
- `target` (`Object`, 可选) - 回调函数的 `this` 绑定

**示例：**
```javascript
signal.connect_once(() => {
    console.log('This will only run once');
});
```

#### `disconnect(callback, target?)`
断开信号连接。

**参数：**
- `callback` (`Function`) - 要断开的回调函数
- `target` (`Object`, 可选) - 回调函数的 `this` 绑定

#### `emit(...args)`
触发信号，调用所有连接的回调。

**参数：**
- `...args` (`any`) - 传递给回调函数的参数

**示例：**
```javascript
signal.emit('player_died', { score: 100 });
```

#### `clear()`
清除所有连接的回调。

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `listener_count` | `number` | 只读，监听器数量 |

---

## EventBus 类

事件总线，管理多个命名信号。

### 构造函数

```javascript
const bus = new plane.EventBus();
```

### 方法

#### `get_signal(name)`
获取或创建指定名称的信号。

**参数：**
- `name` (`string`) - 信号名称

**返回：** `Signal` - 信号实例

**示例：**
```javascript
const playerSignal = bus.get_signal('player_died');
```

#### `connect(signal_name, callback, target?)`
连接到指定信号。

**参数：**
- `signal_name` (`string`) - 信号名称
- `callback` (`Function`) - 回调函数
- `target` (`Object`, 可选) - 回调函数的 `this` 绑定

**示例：**
```javascript
bus.connect('player_died', (data) => {
    console.log('Player died with score:', data.score);
});
```

#### `connect_once(signal_name, callback, target?)`
连接到指定信号，只触发一次。

**参数：**
- `signal_name` (`string`) - 信号名称
- `callback` (`Function`) - 回调函数
- `target` (`Object`, 可选) - 回调函数的 `this` 绑定

#### `disconnect(signal_name, callback, target?)`
断开指定信号的连接。

**参数：**
- `signal_name` (`string`) - 信号名称
- `callback` (`Function`) - 要断开的回调函数
- `target` (`Object`, 可选) - 回调函数的 `this` 绑定

#### `emit(signal_name, ...args)`
触发指定信号。

**参数：**
- `signal_name` (`string`) - 信号名称
- `...args` (`any`) - 传递给回调函数的参数

**示例：**
```javascript
bus.emit('player_died', { score: 100, time: 45 });
```

#### `clear_signal(signal_name)`
清除指定信号的所有连接。

**参数：**
- `signal_name` (`string`) - 信号名称

#### `clear_all()`
清除所有信号。

---

## 全局事件总线

引擎提供全局事件总线 `plane.global_events`，用于跨系统通信。

### 预定义事件

| 事件名称 | 说明 |
|----------|------|
| `plane_ready` | 引擎初始化完成 |
| `plane_initialized` | 引擎已初始化 |
| `engine_started` | 引擎启动 |
| `engine_initialized` | 引擎初始化 |
| `process_frame` | 每帧处理 |
| `physics_frame` | 物理帧 |
| `quit_request` | 退出请求 |

### 使用示例

```javascript
// 监听引擎就绪
plane.global_events.connect('plane_ready', () => {
    console.log('Engine is ready!');
    
    // 创建游戏场景
    const scene = new plane.Scene();
    // ... 初始化游戏
});

// 监听帧更新
plane.global_events.connect('process_frame', (delta) => {
    // 每帧执行的逻辑
});

// 触发自定义事件
plane.global_events.emit('game_over', { 
    finalScore: 1000, 
    level: 5 
});
```

---

## 完整示例：游戏事件系统

```javascript
// 创建游戏事件管理器
class GameManager extends plane.Node {
    constructor() {
        super();
        this.eventBus = new plane.EventBus();
        this.score = 0;
    }
    
    _ready() {
        // 监听游戏事件
        this.eventBus.connect('enemy_defeated', (data) => {
            this.score += data.points;
            console.log('Score:', this.score);
            
            // 触发分数更新事件
            this.eventBus.emit('score_changed', { score: this.score });
        });
        
        this.eventBus.connect('player_died', () => {
            console.log('Game Over!');
            this.eventBus.emit('game_over', { finalScore: this.score });
        });
    }
    
    defeatEnemy(enemyType) {
        const points = enemyType === 'boss' ? 500 : 100;
        this.eventBus.emit('enemy_defeated', { 
            enemyType, 
            points 
        });
    }
}

// 使用示例
const gameManager = new GameManager();
scene.add_child(gameManager);

// 在其他组件中监听事件
gameManager.eventBus.connect('score_changed', (data) => {
    updateScoreUI(data.score);
});

gameManager.eventBus.connect('game_over', (data) => {
    showGameOverScreen(data.finalScore);
});

// 触发事件
gameManager.defeatEnemy('boss');
```
