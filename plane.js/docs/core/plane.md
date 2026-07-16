# plane 对象

`plane` 是引擎的全局主对象，提供引擎初始化、场景管理、资源加载等核心功能。

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `version` | `string` | 引擎版本号，如 `"1.0.0"` |
| `author` | `string` | 作者信息 |
| `license` | `string` | 许可证类型 |
| `initialized` | `boolean` | 引擎是否已初始化（只读） |
| `main_loop` | `SceneTree` | 当前主循环/场景树（只读） |
| `root_node` | `Node` | 根节点（只读） |

## 方法

### plane.start(main_loop)

启动引擎。

**参数：**
- `main_loop` (`SceneTree`, 可选) - 场景树实例，默认创建新的 `SceneTree`

**示例：**
```javascript
const scene = new plane.SceneTree();
plane.start(scene);
```

### plane.get_tree()

获取当前场景树。

**返回：** `SceneTree`

### plane.get_root()

获取引擎根节点。

**返回：** `Node`

### plane.get_main_loop()

获取主循环对象。

**返回：** `SceneTree`

### plane.get_world_2d()

获取当前 2D 世界。

**返回：** `World2D` 或 `null`

### plane.get_input()

获取输入管理器。

**返回：** `Input`

### plane.get_frames()

获取当前帧率。

**返回：** `number` - 每秒帧数

### plane.get_delta()

获取帧间隔时间。

**返回：** `number` - 秒

### plane.get_time()

获取引擎运行的固定时间。

**返回：** `number` - 秒

### plane.load_scene(path)

异步加载场景资源。

**参数：**
- `path` (`string`) - 场景文件路径

**返回：** `Promise<Resource>`

**示例：**
```javascript
const scene = await plane.load_scene('scenes/level1.json');
plane.change_scene(scene);
```

### plane.load_image(path)

异步加载图片资源。

**参数：**
- `path` (`string`) - 图片文件路径

**返回：** `Promise<ImageTexture>`

**示例：**
```javascript
const texture = await plane.load_image('assets/player.png');
sprite.texture = texture;
```

### plane.play_sound(path, volume, loop)

播放音效。

**参数：**
- `path` (`string`) - 音频文件路径
- `volume` (`number`, 默认 `1.0`) - 音量 0~1
- `loop` (`boolean`, 默认 `false`) - 是否循环

**返回：** `AudioBufferSourceNode`

### plane.stop_sound(audio)

停止指定音效。

**参数：**
- `audio` (`AudioBufferSourceNode`) - 要停止的音频源

### plane.stop_all_sounds()

停止所有音效。

### plane.create_timer(time, callback)

创建计时器。

**参数：**
- `time` (`number`) - 计时时间（秒）
- `callback` (`Function`) - 回调函数

**返回：** `Timer` 对象，包含：
- `time_left` (`number`) - 剩余时间
- `stop()` - 停止计时器
- `is_stopped()` - 是否已停止

**示例：**
```javascript
const timer = plane.create_timer(2.0, () => {
    console.log('2秒后执行');
});
```

### plane.pause()

暂停引擎。

### plane.resume()

恢复引擎。

### plane.set_time_scale(scale)

设置时间缩放。

**参数：**
- `scale` (`number`) - 时间缩放因子，1.0 为正常速度

### plane.get_time_scale()

获取时间缩放。

**返回：** `number`

### plane.change_scene(scene)

切换场景。

**参数：**
- `scene` (`Node`) - 新场景节点

### plane.reload_current_scene()

重新加载当前场景。

### plane.quit()

退出引擎。

## 生命周期事件

```javascript
// 引擎就绪
global_events.connect('plane_ready', () => {
    // 初始化游戏
});

// 引擎已初始化
global_events.connect('plane_initialized', () => {
    // ...
});

// 引擎启动
global_events.connect('engine_started', () => {
    // ...
});
```
