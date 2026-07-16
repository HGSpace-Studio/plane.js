# MathUtils

数学工具函数集合。

## 常量

| 常量 | 值 | 说明 |
|------|-----|------|
| `PI` | `Math.PI` | 圆周率 |
| `TAU` | `Math.PI * 2` | 2π |
| `PI_2` | `Math.PI / 2` | π/2 |
| `PI_4` | `Math.PI / 4` | π/4 |

## 角度转换

### deg_to_rad(deg)

角度转弧度。

```javascript
const rad = plane.MathUtils.deg_to_rad(90);  // π/2
```

### rad_to_deg(rad)

弧度转角度。

```javascript
const deg = plane.MathUtils.rad_to_deg(Math.PI);  // 180
```

## 插值

### lerp(a, b, t)

线性插值。

```javascript
const value = plane.MathUtils.lerp(0, 100, 0.5);  // 50
```

### inverse_lerp(a, b, value)

反向线性插值。

```javascript
const t = plane.MathUtils.inverse_lerp(0, 100, 50);  // 0.5
```

### smoothstep(edge0, edge1, x)

平滑阶梯函数。

```javascript
const smooth = plane.MathUtils.smoothstep(0, 1, 0.5);
```

## 范围限制

### clamp(value, min, max)

限制值在范围内。

```javascript
const clamped = plane.MathUtils.clamp(150, 0, 100);  // 100
```

### wrap(value, min, max)

循环包装值。

```javascript
const wrapped = plane.MathUtils.wrap(370, 0, 360);  // 10
```

## 缓动函数

### ease(t, curve)

应用缓动曲线。

**参数：**
- `t` (`number`) - 时间 (0~1)
- `curve` (`string`) - 缓动类型

**缓动类型：**
- `'linear'` - 线性
- `'ease_in'` - 缓入
- `'ease_out'` - 缓出
- `'ease_in_out'` - 缓入缓出
- `'ease_in_cubic'` - 三次缓入
- `'ease_out_cubic'` - 三次缓出
- `'ease_in_out_cubic'` - 三次缓入缓出

```javascript
const eased = plane.MathUtils.ease(0.5, 'ease_in_out');
```

## 随机数

### random_range(min, max)

生成范围内随机浮点数。

```javascript
const rand = plane.MathUtils.random_range(0, 100);
```

### random_int(min, max)

生成范围内随机整数。

```javascript
const int = plane.MathUtils.random_int(1, 10);
```

### random_choice(array)

从数组中随机选择元素。

```javascript
const item = plane.MathUtils.random_choice(['a', 'b', 'c']);
```

### shuffle(array)

随机打乱数组。

```javascript
const shuffled = plane.MathUtils.shuffle([1, 2, 3, 4, 5]);
```

## 数学函数

### sign(value)

获取符号。

```javascript
const s = plane.MathUtils.sign(-5);  // -1
```

### is_equal_approx(a, b, epsilon)

近似相等比较。

```javascript
if (plane.MathUtils.is_equal_approx(0.1 + 0.2, 0.3, 0.0001)) {
    // ...
}
```

### move_toward(current, target, delta)

向目标移动指定距离。

```javascript
const newPos = plane.MathUtils.move_toward(current, target, speed * dt);
```

## 角度函数

### angle_wrap(angle)

将角度包装到 -π ~ π 范围。

```javascript
const wrapped = plane.MathUtils.angle_wrap(Math.PI * 3);
```

### angle_lerp(from, to, weight)

角度线性插值（处理环绕）。

```javascript
const angle = plane.MathUtils.angle_lerp(0, Math.PI * 1.5, 0.5);
```

## 映射函数

### map(value, inMin, inMax, outMin, outMax)

将值从一个范围映射到另一个范围。

```javascript
const mapped = plane.MathUtils.map(50, 0, 100, 0, 1);  // 0.5
```

### round_to(value, step)

四舍五入到指定步长。

```javascript
const rounded = plane.MathUtils.round_to(17, 5);  // 15
```

### floor_to(value, step)

向下取整到指定步长。

```javascript
const floored = plane.MathUtils.floor_to(17, 5);  // 15
```

## 示例

```javascript
// 平滑移动
const targetX = 100;
const currentX = 0;
const smoothX = plane.MathUtils.lerp(currentX, targetX, 0.1);

// 限制血量
const health = plane.MathUtils.clamp(health - damage, 0, maxHealth);

// 随机生成敌人
const spawnX = plane.MathUtils.random_range(0, screenWidth);
const spawnY = plane.MathUtils.random_range(0, screenHeight);

// 缓动动画
const progress = plane.MathUtils.ease(elapsed / duration, 'ease_out');
sprite.position.x = plane.MathUtils.lerp(startX, endX, progress);
```
