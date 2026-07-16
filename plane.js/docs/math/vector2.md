# Vector2

2D 向量类，用于表示位置、方向、速度等。

## 构造函数

```javascript
const v1 = new plane.Vector2();          // (0, 0)
const v2 = new plane.Vector2(10, 20);    // (10, 20)
```

## 静态常量

| 常量 | 值 | 说明 |
|------|-----|------|
| `Vector2.ZERO` | `(0, 0)` | 零向量 |
| `Vector2.ONE` | `(1, 1)` | 单位向量 |
| `Vector2.UP` | `(0, -1)` | 上方向 |
| `Vector2.DOWN` | `(0, 1)` | 下方向 |
| `Vector2.LEFT` | `(-1, 0)` | 左方向 |
| `Vector2.RIGHT` | `(1, 0)` | 右方向 |

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `x` | `number` | X 分量 |
| `y` | `number` | Y 分量 |

## 基本运算

### clone()

创建向量副本。

```javascript
const v = new plane.Vector2(10, 20);
const copy = v.clone();
```

### set(x, y)

设置向量值。

```javascript
v.set(30, 40);
```

### copyFrom(v)

从另一个向量复制值。

```javascript
v.copyFrom(other);
```

### add(v) / subtract(v)

向量加减。

```javascript
const result = v1.add(v2);
const diff = v1.subtract(v2);
```

### multiply(scalar) / divide(scalar)

向量缩放。

```javascript
const scaled = v.multiply(2);
const halved = v.divide(2);
```

## 向量运算

### length() / length_squared()

获取向量长度。

```javascript
const len = v.length();
const lenSq = v.length_squared();  // 更快，避免开方
```

### normalized()

获取单位向量（不修改原向量）。

```javascript
const dir = v.normalized();
```

### normalize()

将向量归一化（修改原向量）。

```javascript
v.normalize();
```

### dot(v)

点积。

```javascript
const dotProduct = v1.dot(v2);
```

### cross(v)

叉积（返回标量）。

```javascript
const crossProduct = v1.cross(v2);
```

### distance_to(v)

计算到另一向量的距离。

```javascript
const dist = v1.distance_to(v2);
```

### angle_to(v)

计算到另一向量的角度。

```javascript
const angle = v1.angle_to(v2);
```

### angle()

获取向量的角度。

```javascript
const angle = v.angle();
```

## 插值与变换

### lerp(v, t)

线性插值。

```javascript
const result = v1.lerp(v2, 0.5);  // 中点
```

### move_toward(target, delta)

向目标移动指定距离。

```javascript
const newPos = current.move_toward(target, speed * dt);
```

### rotated(angle)

旋转指定角度（返回新向量）。

```javascript
const rotated = v.rotated(Math.PI / 4);
```

### rotate(angle)

旋转指定角度（修改原向量）。

```javascript
v.rotate(Math.PI / 2);
```

## 数学运算

### abs() / floor() / ceil() / round()

分量数学运算。

```javascript
const absV = v.abs();
const floorV = v.floor();
```

### sign()

获取符号向量。

```javascript
const signV = v.sign();  // 每个分量为 -1, 0, 或 1
```

### limit_length(max_length)

限制向量长度。

```javascript
const limited = v.limit_length(100);
```

### snapped(step)

对齐到网格。

```javascript
const snapped = v.snapped(16);  // 对齐到 16 像素网格
```

## 比较

### is_zero()

检查是否为零向量。

```javascript
if (v.is_zero()) {
    // ...
}
```

### is_equal_approx(v, epsilon)

近似相等比较。

```javascript
if (v1.is_equal_approx(v2, 0.001)) {
    // ...
}
```

### equal(v) / not_equal(v)

精确相等比较。

```javascript
if (v1.equal(v2)) {
    // ...
}
```

### negate()

取反。

```javascript
const neg = v.negate();  // (-x, -y)
```

## 转换

### to_string()

转换为字符串。

```javascript
console.log(v.to_string());  // "(10, 20)"
```

### to_array()

转换为数组。

```javascript
const arr = v.to_array();  // [10, 20]
```

## 静态方法

### from_angle(angle)

从角度创建单位向量。

```javascript
const dir = plane.Vector2.from_angle(Math.PI / 4);
```

### random()

创建随机单位向量。

```javascript
const randomDir = plane.Vector2.random();
```

## 示例

```javascript
// 移动角色
const velocity = new plane.Vector2(0, 0);
if (plane.Input.is_action_pressed('move_right')) {
    velocity.x += 1;
}
if (plane.Input.is_action_pressed('move_left')) {
    velocity.x -= 1;
}

// 归一化并应用速度
const movement = velocity.normalized().multiply(speed * dt);
player.position = player.position.add(movement);

// 朝向鼠标
const mousePos = plane.Input.get_mouse_position();
const direction = mousePos.subtract(player.position).normalized();
player.rotation = direction.angle();
```
