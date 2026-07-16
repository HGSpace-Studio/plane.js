# 系统模块 API 文档

## Renderer 类

渲染器，提供 2D 绘图 API。

### 构造函数

```javascript
const renderer = new plane.Renderer(canvas);
```

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `width` | `number` | 只读，画布宽度 |
| `height` | `number` | 只读，画布高度 |
| `clear_color` | `Color` | 清屏颜色 |
| `blend_mode` | `string` | 混合模式 (`'normal'`/`'add'`/`'multiply'`/`'screen'`) |
| `filter_mode` | `string` | 过滤模式 (`'nearest'`/`'linear'`) |
| `viewport` | `Rect2` | 视口区域 |
| `camera` | `Camera2D` | 当前摄像机 |

### 帧控制

```javascript
renderer.begin_frame(); // 清屏 + 应用摄像机
// ... 绘制操作 ...
renderer.end_frame();   // 恢复状态
```

### 绘图方法

#### `draw_rect(rect, color)`
绘制填充矩形。

```javascript
renderer.draw_rect(
    new plane.Rect2(10, 10, 100, 50),
    plane.Color.RED
);
```

#### `draw_rect_outline(rect, color, line_width?)`
绘制矩形轮廓。

#### `draw_circle(center, radius, color)`
绘制填充圆。

```javascript
renderer.draw_circle(
    new plane.Vector2(200, 200),
    50,
    plane.Color.BLUE
);
```

#### `draw_circle_outline(center, radius, color, line_width?)`
绘制圆形轮廓。

#### `draw_line(start, end, color, line_width?)`
绘制线段。

```javascript
renderer.draw_line(
    new plane.Vector2(0, 0),
    new plane.Vector2(100, 100),
    plane.Color.GREEN,
    2
);
```

#### `draw_text(text, position, color, font_size?, font_family?)`
绘制文本。

```javascript
renderer.draw_text(
    "Hello!",
    new plane.Vector2(50, 50),
    plane.Color.WHITE,
    24,
    "Arial"
);
```

#### `draw_image(image, position, scale?)`
绘制图片。

#### `draw_image_part(image, src_rect, dest_pos, scale?)`
绘制图片的一部分。

#### `draw_polygon(points, color)`
绘制填充多边形。

```javascript
renderer.draw_polygon([
    new plane.Vector2(0, 0),
    new plane.Vector2(100, 0),
    new plane.Vector2(50, 80)
], plane.Color.YELLOW);
```

#### `draw_polyline(points, color, line_width?)`
绘制折线。

### 图层与批处理

```javascript
renderer.set_layer(0);
renderer.add_to_batch((ctx) => {
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 50, 50);
});
renderer.flush_batches(); // 按图层顺序执行
```

### 其他

| 方法 | 说明 |
|------|------|
| `clear()` | 清屏 |
| `resize(width, height)` | 调整画布大小 |
| `set_transform(transform)` | 设置变换矩阵 |

---

## Input 类

输入管理器（单例），处理键盘、鼠标、触摸。

### 获取实例

```javascript
const input = plane.Input.get_singleton();
// 或通过 plane
const input = plane.get_input();
```

### 键盘

```javascript
// 持续按住
input.is_key_pressed("KeyW");

// 刚按下
input.is_key_just_pressed("Space");

// 刚松开
input.is_key_just_released("Escape");
```

| 方法 | 说明 |
|------|------|
| `is_key_pressed(key)` | 按键是否按住 |
| `is_key_just_pressed(key)` | 按键是否刚按下 |
| `is_key_just_released(key)` | 按键是否刚松开 |

### 鼠标

```javascript
const pos = input.get_mouse_position();
const delta = input.get_mouse_delta();
const scroll = input.get_scroll_delta();

input.is_mouse_button_pressed(0);   // 左键
input.is_mouse_button_just_pressed(2); // 右键刚按下
```

| 方法 | 说明 |
|------|------|
| `is_mouse_button_pressed(button)` | 鼠标按钮是否按住 |
| `is_mouse_button_just_pressed(button)` | 鼠标按钮是否刚按下 |
| `is_mouse_button_just_released(button)` | 鼠标按钮是否刚松开 |
| `get_mouse_position()` → `Vector2` | 鼠标位置 |
| `get_mouse_delta()` → `Vector2` | 鼠标移动增量 |
| `get_scroll_delta()` → `Vector2` | 滚轮增量 |

### 触摸

```javascript
if (input.is_touching()) {
    const touchPos = input.get_touch_position(0);
    console.log("触摸点:", touchPos);
}
console.log("触摸点数:", input.get_touch_count());
```

### 动作系统

```javascript
// 注册动作
input.add_action("jump", "Space");
input.add_action("move_left", "KeyA");
input.add_action("move_right", "KeyD");
input.add_action_multiple("fire", ["KeyJ", "Mouse0"]);

// 查询
input.is_action_pressed("jump");
input.is_action_just_pressed("fire");
input.is_action_just_released("move_left");
input.get_action_strength("jump"); // 0.0 或 1.0

// 轴输入
const horizontal = input.get_axis("move_left", "move_right"); // -1, 0, 1
```

### 其他

| 方法 | 说明 |
|------|------|
| `get_window_size()` → `Vector2` | 获取窗口大小 |
| `set_capture_events(enabled)` | 设置是否捕获事件 |
| `is_event_captured()` → `boolean` | 事件是否被捕获 |

---

## AudioManager 类

音频管理器（单例）。

### 获取实例

```javascript
const audio = plane.AudioManager.get_singleton();
```

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `global_volume` | `number` | 全局音量 (0~1) |
| `music_volume` | `number` | 音乐音量 (0~1) |
| `sfx_volume` | `number` | 音效音量 (0~1) |

### 方法

```javascript
// 播放音效
const source = audio.play_sound("assets/jump.wav", 0.8, false);

// 播放背景音乐
const bgm = audio.play_music("assets/bgm.mp3", 0.6, true);

// 停止
audio.stop_sound(source);
audio.stop_all_sounds();
audio.stop_all_music();
audio.stop_all();

// 听者位置（用于 3D 音频）
audio.set_listener_position(new plane.Vector2(100, 200));
audio.get_listener_position();

// 当前音频源数量
audio.get_sound_count();
```

---

## AudioStreamPlayer 类

继承自 `Node`。音频播放节点。

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `stream` | `string` | 音频路径 |
| `volume` | `number` | 音量 (0~1) |
| `pitch_scale` | `number` | 播放速率 |
| `playing` | `boolean` | 只读，是否播放中 |
| `loop` | `boolean` | 是否循环 |
| `autoplay` | `boolean` | 是否自动播放 |

```javascript
const audio = new plane.AudioStreamPlayer();
audio.stream = "assets/jump.wav";
audio.volume = 0.8;
audio.autoplay = true;
root.add_child(audio);

audio.play();
audio.stop();
audio.pause();
```

---

## AudioStreamPlayer2D 类

继承自 `Node2D`。2D 空间音频节点，根据距离衰减音量。

### 额外属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max_distance` | `number` | `1000` | 最大传播距离 |
| `attenuation` | `number` | `1.0` | 衰减系数 |

---

## Camera2D 类

继承自 `Node2D`。2D 摄像机。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `zoom` | `Vector2` | `(1, 1)` | 缩放 |
| `offset` | `Vector2` | `(0, 0)` | 偏移 |
| `rotation` | `number` | `0` | 旋转 |
| `smooth_enabled` | `boolean` | `false` | 是否启用平滑跟随 |
| `smooth_speed` | `number` | `5` | 平滑速度 |
| `follow_mode` | `number` | `0` | 跟随模式 |
| `limit_enabled` | `boolean` | `false` | 是否启用限制 |
| `limit_rect` | `Rect2` | `(0,0,1000,1000)` | 限制区域 |
| `viewport_rect` | `Rect2` | `(0,0,800,600)` | 视口区域 |
| `is_current` | `boolean` | `false` | 是否为当前摄像机 |
| `projection` | `Vector2` | `(1, 1)` | 投影 |

### 方法

```javascript
const camera = new plane.Camera2D();
camera.smooth_enabled = true;
camera.smooth_speed = 8;
camera.set_follow_target(player);
camera.limit_enabled = true;
camera.limit_rect = new plane.Rect2(0, 0, 2000, 2000);
camera.is_current = true;
root.add_child(camera);

// 设置到视口
viewport.set_camera(camera);
```

| 方法 | 说明 |
|------|------|
| `set_follow_target(target)` | 设置跟随目标 |
| `get_follow_target()` → `Node` | 获取跟随目标 |
| `shake(amount, duration)` | 屏幕震动 |
| `world_to_screen(world_pos)` → `Vector2` | 世界坐标转屏幕坐标 |
| `screen_to_world(screen_pos)` → `Vector2` | 屏幕坐标转世界坐标 |
| `set_zoom(value)` | 设置缩放（最小 0.1） |
| `zoom_in(amount?)` | 放大 |
| `zoom_out(amount?)` | 缩小 |
| `reset_zoom()` | 重置缩放为 (1,1) |
| `get_screen_center_position()` → `Vector2` | 获取屏幕中心位置 |

---

## Scene / Viewport / World2D 类

### Scene 类

场景容器。

```javascript
const scene = new plane.Scene();
scene.name = "Level1";
scene.add_child(player);
scene.add_child(enemy);

scene.load();
scene.unload();

// 查找节点
const player = scene.find_node("Player");
const child = scene.get_node("Player/Sprite");
```

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| `root_node` | `Node` | 只读，根节点 |
| `name` | `string` | 场景名 |
| `path` | `string` | 场景路径 |
| `loaded` | `boolean` | 只读，是否已加载 |
| `active` | `boolean` | 是否激活 |
| `load()` | - | 加载场景 |
| `unload()` | - | 卸载场景 |
| `add_child(node)` | - | 添加子节点 |
| `remove_child(node)` | - | 移除子节点 |
| `find_node(name, recursive?, owned_only?)` | `Node` | 查找节点 |
| `get_node(path)` | `Node` | 通过路径获取节点 |

### Viewport 类

继承自 `Node2D`。视口，管理画布和渲染。

| 属性 | 类型 | 说明 |
|------|------|------|
| `canvas` | `HTMLCanvasElement` | 只读，画布元素 |
| `renderer` | `Renderer` | 只读，渲染器 |
| `world_2d` | `World2D` | 只读，2D 世界 |
| `camera` | `Camera2D` | 当前摄像机 |
| `size` | `Vector2` | 视口大小 |
| `transparent_background` | `boolean` | 透明背景 |
| `clear_color` | `Color` | 清屏颜色 |

| 方法 | 说明 |
|------|------|
| `set_camera(camera)` | 设置摄像机 |
| `get_camera()` → `Camera2D` | 获取摄像机 |
| `resize(width, height)` | 调整大小 |

### World2D 类

2D 世界，管理物理空间和导航。

| 属性 | 类型 | 说明 |
|------|------|------|
| `physics_space` | `object` | 物理空间 |
| `navigation_map` | `object` | 导航地图 |
| `layer_count` | `number` | 只读，图层数 (32) |

| 方法 | 说明 |
|------|------|
| `get_direct_space_state()` → `PhysicsDirectSpaceState2D` | 获取物理空间状态 |
| `set_layer_name(layer, name)` | 设置图层名 |
| `get_layer_name(layer)` → `string` | 获取图层名 |
