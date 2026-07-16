# Tween

补间动画节点，用于创建平滑的属性变化。

**继承：** `Node` → `Tween`

## 构造函数

```javascript
const tween = new plane.Tween();
```

## 方法

### interpolate_property(object, property, initial_val, final_val, duration, trans_type, ease_type)

插值属性变化。

**参数：**
- `object` (`Object`) - 目标对象
- `property` (`string`) - 属性名称
- `initial_val` (`any`) - 初始值
- `final_val` (`any`) - 最终值
- `duration` (`number`) - 持续时间（秒）
- `trans_type` (`string`, 默认 `"linear"`) - 过渡类型
- `ease_type` (`string`, 默认 `"in_out"`) - 缓动类型

**返回：** `Tween`

```javascript
// 移动精灵
tween.interpolate_property(
    sprite,
    "position",
    sprite.position,
    new plane.Vector2(100, 100),
    1.0,
    "linear",
    "in_out"
);
tween.start();
```

### interpolate_callback(callback, duration, ...args)

延迟执行回调。

**参数：**
- `callback` (`Function`) - 回调函数
- `duration` (`number`) - 延迟时间（秒）
- `args` (`any`) - 回调参数

**返回：** `Tween`

```javascript
tween.interpolate_callback(() => {
    console.log("1秒后执行");
}, 1.0);
```

### interpolate_method(object, method, initial_val, final_val, duration, trans_type, ease_type)

插值方法调用。

**参数：**
- `object` (`Object`) - 目标对象
- `method` (`string`) - 方法名称
- `initial_val` (`any`) - 初始值
- `final_val` (`any`) - 最终值
- `duration` (`number`) - 持续时间（秒）
- `trans_type` (`string`) - 过渡类型
- `ease_type` (`string`) - 缓动类型

**返回：** `Tween`

```javascript
tween.interpolate_method(
    sprite,
    "set_rotation",
    0,
    Math.PI * 2,
    2.0,
    "linear",
    "in_out"
);
```

### start()

开始播放补间动画。

```javascript
tween.start();
```

### stop()

停止播放。

```javascript
tween.stop();
```

### pause()

暂停播放。

```javascript
tween.pause();
```

### resume()

恢复播放。

```javascript
tween.resume();
```

### kill()

销毁补间动画。

```javascript
tween.kill();
```

### is_active()

检查是否激活。

**返回：** `boolean`

```javascript
if (tween.is_active()) {
    console.log("补间动画正在运行");
}
```

## 过渡类型

- `"linear"` - 线性
- `"sine"` - 正弦
- `"quint"` - 五次方
- `"quart"` - 四次方
- `"quad"` - 二次方
- `"expo"` - 指数
- `"elastic"` - 弹性
- `"cubic"` - 三次方
- `"circ"` - 圆形
- `"bounce"` - 弹跳
- `"back"` - 回退

## 缓动类型

- `"in"` - 缓入
- `"out"` - 缓出
- `"in_out"` - 缓入缓出
- `"out_in"` - 缓出缓入

## 示例

```javascript
// 创建补间动画
const tween = new plane.Tween();

// 移动精灵到目标位置
tween.interpolate_property(
    sprite,
    "position",
    sprite.position,
    new plane.Vector2(400, 300),
    1.0,
    "quart",
    "in_out"
);

// 淡出效果
tween.interpolate_property(
    sprite,
    "modulate",
    new plane.Color(1, 1, 1, 1),
    new plane.Color(1, 1, 1, 0),
    1.0,
    "linear",
    "in"
);

// 缩放效果
tween.interpolate_property(
    sprite,
    "scale",
    new plane.Vector2(1, 1),
    new plane.Vector2(2, 2),
    0.5,
    "bounce",
    "out"
);

scene.add_child(tween);
tween.start();

// 链式动画
const chain_tween = new plane.Tween();

// 先移动到 (100, 100)
chain_tween.interpolate_property(
    sprite,
    "position",
    sprite.position,
    new plane.Vector2(100, 100),
    1.0
);

// 然后延迟0.5秒
chain_tween.interpolate_callback(() => {
    console.log("延迟完成");
}, 0.5);

// 最后移动到 (200, 200)
chain_tween.interpolate_property(
    sprite,
    "position",
    new plane.Vector2(100, 100),
    new plane.Vector2(200, 200),
    1.0
);

scene.add_child(chain_tween);
chain_tween.start();

// 监听完成
chain_tween.connect("tween_completed", () => {
    console.log("所有动画完成");
});
```

## 信号

### tween_completed()

所有补间动画完成时触发。

```javascript
tween.connect("tween_completed", () => {
    console.log("补间动画完成");
});
```

## 注意事项

- Tween 会自动在每帧更新属性值
- 可以同时插值多个属性
- 使用不同的过渡类型和缓动类型可以创建丰富的动画效果
- 补间动画完成后会自动停止
- 可以链式调用多个 interpolate 方法创建序列动画
