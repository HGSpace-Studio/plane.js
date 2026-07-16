# 动画模块 API 文档

## Animation 类

动画资源，由关键帧轨道组成。

### 构造函数

```javascript
const anim = new plane.Animation();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | `""` | 动画名称 |
| `length` | `number` | `1.0` | 动画长度（秒） |
| `loop` | `boolean` | `true` | 是否循环 |
| `speed` | `number` | `1.0` | 播放速度 |

### 方法

#### `add_track(property, type?)` → `number`
添加属性轨道。

```javascript
const trackIdx = anim.add_track("position", "value");
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `property` | `string` | - | 属性路径（如 `"position"`, `"_scale.x"`） |
| `type` | `string` | `"value"` | 轨道类型 |

#### `add_keyframe(track_index, time, value, transition?)`
添加关键帧。

```javascript
anim.add_keyframe(0, 0.0, new plane.Vector2(0, 0));
anim.add_keyframe(0, 1.0, new plane.Vector2(100, 200));
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `track_index` | `number` | - | 轨道索引 |
| `time` | `number` | - | 时间点（秒） |
| `value` | `any` | - | 关键帧值（支持 Vector2, Color, number） |
| `transition` | `string` | `"linear"` | 过渡方式 |

#### `get_value(track_index, time)` → `any`
获取指定时间的插值。

```javascript
const pos = anim.get_value(0, 0.5); // 自动插值
```

#### `remove_track(track_index)`
移除轨道。

#### `get_track_count()` → `number`
获取轨道数。

#### `get_track(track_index)` → `object`
获取轨道数据。

#### `reset()`
重置播放位置。

### 完整示例

```javascript
const anim = new plane.Animation();
anim.name = "move_right";
anim.length = 2.0;
anim.loop = true;

// 位置轨道
const posTrack = anim.add_track("position", "value");
anim.add_keyframe(posTrack, 0.0, new plane.Vector2(0, 0));
anim.add_keyframe(posTrack, 1.0, new plane.Vector2(200, 0));
anim.add_keyframe(posTrack, 2.0, new plane.Vector2(0, 0));

// 透明度轨道
const alphaTrack = anim.add_track("modulate.a", "value");
anim.add_keyframe(alphaTrack, 0.0, 1.0);
anim.add_keyframe(alphaTrack, 1.0, 0.3);
anim.add_keyframe(alphaTrack, 2.0, 1.0);
```

---

## AnimationPlayer 类

继承自 `Node2D`。动画播放器节点。

### 构造函数

```javascript
const player = new plane.AnimationPlayer();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `current_animation` | `string` | 只读 | 当前动画名 |
| `current_time` | `number` | 只读 | 当前播放时间 |
| `playing` | `boolean` | 只读 | 是否播放中 |
| `speed` | `number` | `1.0` | 播放速度 |
| `loop` | `boolean` | `true` | 是否循环 |

### 方法

```javascript
const player = new plane.AnimationPlayer();

// 添加动画
player.add_animation("walk", walkAnim);
player.add_animation("idle", idleAnim);

// 播放
player.play("walk");
player.play_backwards("walk");

// 控制
player.pause();
player.resume();
player.stop();

// 跳转
player.seek(0.5);     // 跳到 0.5 秒
player.advance(0.1);  // 前进 0.1 秒

// 查询
player.get_animation_names(); // ["walk", "idle"]
player.hasAnimation("walk");  // true
player.is_playing();          // true
player.get_current_animation_length(); // 2.0
```

| 方法 | 说明 |
|------|------|
| `add_animation(name, animation)` | 添加动画 |
| `play(name?)` | 播放 |
| `play_backwards(name?)` | 反向播放 |
| `pause()` | 暂停 |
| `stop()` | 停止 |
| `resume()` | 恢复 |
| `seek(time, update?)` | 跳转到指定时间 |
| `advance(time)` | 前进指定时间 |
| `set_current_animation(name)` | 设置当前动画 |
| `remove_animation(name)` | 移除动画 |
| `get_animation_names()` → `string[]` | 获取所有动画名 |
| `hasAnimation(name)` → `boolean` | 是否存在动画 |
| `is_playing()` → `boolean` | 是否播放中 |
| `get_current_animation_length()` → `number` | 获取当前动画长度 |

### 信号

```javascript
player._animation_finished.connect((name) => {
    console.log("动画结束:", name);
});
player._animation_changed.connect((name) => {
    console.log("动画切换:", name);
});
```

---

## Tween 类

继承自 `Node`。补间动画。

### 构造函数

```javascript
const tween = new plane.Tween();
```

### 方法

#### `interpolate_property(object, property, initial, final, duration, trans_type?, ease_type?)` → `object`
属性补间。

```javascript
const tween = new plane.Tween();
root.add_child(tween);

// 移动精灵
tween.interpolate_property(
    sprite,
    "position",
    new plane.Vector2(0, 0),
    new plane.Vector2(400, 300),
    2.0,
    "linear",
    "ease_in_out"
);
```

#### `interpolate_value(initial, final, duration, callback, trans_type?, ease_type?)` → `object`
值补间（通过回调）。

```javascript
tween.interpolate_value(
    0,
    100,
    1.0,
    (value) => {
        console.log("当前值:", value);
    }
);
```

#### `interpolate_callback(duration, callback, trans_type?, ease_type?)` → `object`
延迟回调。

```javascript
tween.interpolate_callback(1.0, () => {
    console.log("1秒后执行");
});
```

#### 缓动类型

| trans_type | 说明 |
|------------|------|
| `'linear'` | 线性 |
| `'ease_in'` | 缓入 |
| `'ease_out'` | 缓出 |
| `'ease_in_out'` | 缓入缓出 |
| `'ease_in_cubic'` | 三次缓入 |
| `'ease_out_cubic'` | 三次缓出 |
| `'ease_in_out_cubic'` | 三次缓入缓出 |

#### 控制

| 方法 | 说明 |
|------|------|
| `stop(object?, property?)` | 停止指定或所有补间 |
| `stop_all()` | 停止所有补间 |
| `is_active()` → `boolean` | 是否有活跃补间 |
| `get_running_tweens_count()` → `number` | 获取运行中的补间数 |
| `set_speed_scale(scale)` | 设置速度缩放 |

### 信号

```javascript
tween._completed.connect(() => {
    console.log("所有补间完成");
});
tween._tween_started.connect((tween) => {
    console.log("补间开始");
});
tween._tween_completed.connect((tween) => {
    console.log("补间完成");
});
```

### 完整示例：弹跳效果

```javascript
const ball = new plane.Sprite();
ball.texture = ballImage;
ball.position = new plane.Vector2(100, 100);
root.add_child(ball);

const tween = new plane.Tween();
root.add_child(tween);

// 下落
tween.interpolate_property(
    ball, "position",
    new plane.Vector2(100, 100),
    new plane.Vector2(100, 400),
    0.5, "linear", "ease_in"
);

// 弹起
tween.interpolate_property(
    ball, "position",
    new plane.Vector2(100, 400),
    new plane.Vector2(100, 200),
    0.3, "linear", "ease_out"
);

// 再下落
tween.interpolate_property(
    ball, "position",
    new plane.Vector2(100, 200),
    new plane.Vector2(100, 400),
    0.3, "linear", "ease_in"
);
```
