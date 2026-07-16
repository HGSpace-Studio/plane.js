# Camera2D

2D 摄像机节点，用于控制游戏视口。

**继承：** `Node` → `Node2D` → `Camera2D`

## 构造函数

```javascript
const camera = new plane.Camera2D();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `zoom` | `Vector2` | `(1, 1)` | 缩放级别 |
| `offset` | `Vector2` | `(0, 0)` | 偏移量 |
| `rotation` | `number` | `0` | 旋转角度 |
| `smooth_enabled` | `boolean` | `false` | 是否启用平滑跟随 |
| `smooth_speed` | `number` | `5.0` | 平滑跟随速度 |
| `follow_mode` | `number` | `0` | 跟随模式 |
| `limit_enabled` | `boolean` | `false` | 是否启用限制 |
| `limit_rect` | `Rect2` | `(0,0,1000,1000)` | 限制区域 |
| `viewport_rect` | `Rect2` | `(0,0,800,600)` | 视口大小 |
| `is_current` | `boolean` | `false` | 是否为当前摄像机 |

## 方法

### set_follow_target(target)

设置跟随目标。

**参数：**
- `target` (`Node2D`) - 要跟随的节点

```javascript
camera.set_follow_target(player);
```

### get_follow_target()

获取跟随目标。

**返回：** `Node2D`

### shake(amount, duration)

震动效果。

**参数：**
- `amount` (`number`) - 震动幅度
- `duration` (`number`) - 持续时间（秒）

```javascript
camera.shake(10, 0.5);  // 震动 10 像素，持续 0.5 秒
```

### get_screen_center_position()

获取屏幕中心的世界坐标。

**返回：** `Vector2`

### world_to_screen(world_position)

将世界坐标转换为屏幕坐标。

**参数：**
- `world_position` (`Vector2`) - 世界坐标

**返回：** `Vector2` - 屏幕坐标

```javascript
const screen_pos = camera.world_to_screen(player.position);
```

### screen_to_world(screen_position)

将屏幕坐标转换为世界坐标。

**参数：**
- `screen_position` (`Vector2`) - 屏幕坐标

**返回：** `Vector2` - 世界坐标

```javascript
const mouse_world = camera.screen_to_world(mouse_pos);
```

### set_zoom(value)

设置缩放。

**参数：**
- `value` (`Vector2`) - 缩放值

```javascript
camera.set_zoom(new plane.Vector2(2, 2));  // 放大 2 倍
```

### zoom_in(amount)

放大。

**参数：**
- `amount` (`number`, 默认 `0.1`) - 放大倍数

```javascript
camera.zoom_in(0.2);
```

### zoom_out(amount)

缩小。

**参数：**
- `amount` (`number`, 默认 `0.1`) - 缩小倍数

```javascript
camera.zoom_out(0.2);
```

### reset_zoom()

重置缩放到 1:1。

```javascript
camera.reset_zoom();
```

## 示例

```javascript
// 创建摄像机
const camera = new plane.Camera2D();
camera.position = new plane.Vector2(400, 300);

// 跟随玩家
camera.set_follow_target(player);
camera.smooth_enabled = true;
camera.smooth_speed = 5.0;

// 设置限制区域
camera.limit_enabled = true;
camera.limit_rect = new plane.Rect2(0, 0, 2000, 1500);

// 设置视口大小
camera.viewport_rect = new plane.Rect2(0, 0, 800, 600);

// 设置为当前摄像机
camera.is_current = true;

scene.add_child(camera);

// 缩放控制
camera._process = function(dt) {
    if (plane.Input.is_key_just_pressed('KeyZ')) {
        this.zoom_in(0.1);
    }
    if (plane.Input.is_key_just_pressed('KeyX')) {
        this.zoom_out(0.1);
    }
};

// 震动效果
function onExplosion() {
    camera.shake(15, 0.3);
}
```

## 跟随模式

- `0` - 默认模式，直接跟随目标位置

## 注意事项

- 摄像机只会影响渲染，不会影响节点的实际位置
- 使用 `screen_to_world` 可以将鼠标点击转换为游戏世界坐标
- 缩放值小于 1 会缩小视图，大于 1 会放大视图
- 平滑跟随会产生延迟效果，适合创建流畅的摄像机运动
