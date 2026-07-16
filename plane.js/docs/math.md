# 数学模块 API 文档

## Vector2 类

二维向量。

### 构造函数

```javascript
const v = new plane.Vector2(3, 4);
const zero = new plane.Vector2(); // (0, 0)
```

### 静态常量

| 常量 | 值 | 说明 |
|------|------|------|
| `Vector2.ZERO` | `(0, 0)` | 零向量 |
| `Vector2.ONE` | `(1, 1)` | 一向量 |
| `Vector2.UP` | `(0, -1)` | 上方向 |
| `Vector2.DOWN` | `(0, 1)` | 下方向 |
| `Vector2.LEFT` | `(-1, 0)` | 左方向 |
| `Vector2.RIGHT` | `(1, 0)` | 右方向 |

### 静态方法

#### `Vector2.from_angle(angle)` → `Vector2`
从角度创建单位向量。

#### `Vector2.random()` → `Vector2`
创建随机方向的单位向量。

### 实例方法

#### 基础运算

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `clone()` | `Vector2` | 克隆向量 |
| `copyFrom(v)` | `this` | 从另一个向量复制 |
| `set(x, y)` | `this` | 设置分量 |
| `add(v)` | `Vector2` | 加法 |
| `addScalar(s)` | `Vector2` | 各分量加标量 |
| `subtract(v)` / `sub(v)` | `Vector2` | 减法 |
| `multiply(v)` / `mul(v)` | `Vector2` | 乘法（v 可为 number 或 Vector2） |
| `divide(v)` / `div(v)` | `Vector2` | 除法（v 可为 number 或 Vector2） |
| `negate()` | `Vector2` | 取反 |

```javascript
const a = new plane.Vector2(1, 2);
const b = new plane.Vector2(3, 4);

a.add(b);           // (4, 6)
a.subtract(b);      // (-2, -2)
a.multiply(2);      // (2, 4)
a.multiply(b);      // (3, 8)
```

#### 向量运算

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `dot(v)` | `number` | 点积 |
| `cross(v)` | `number` | 叉积 |
| `length()` | `number` | 长度（模） |
| `length_squared()` | `number` | 长度的平方 |
| `normalized()` | `Vector2` | 返回归一化后的新向量 |
| `normalize()` | `this` | 原地归一化 |
| `distance_to(v)` | `number` | 到 v 的距离 |
| `angle_to(v)` | `number` | 到 v 的角度（弧度） |
| `angle()` | `number` | 向量角度（弧度） |
| `lerp(v, t)` | `Vector2` | 线性插值 |
| `move_toward(target, delta)` | `Vector2` | 向目标移动固定距离 |
| `limit_length(max_length)` | `Vector2` | 限制最大长度 |

```javascript
const v = new plane.Vector2(3, 4);
v.length();          // 5
v.normalized();      // (0.6, 0.8)
v.dot(new plane.Vector2(1, 0)); // 3
```

#### 变换

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `rotated(angle)` | `Vector2` | 返回旋转后的新向量 |
| `rotate(angle)` | `this` | 原地旋转 |

#### 数学运算

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `abs()` | `Vector2` | 各分量取绝对值 |
| `floor()` | `Vector2` | 各分量向下取整 |
| `ceil()` | `Vector2` | 各分量向上取整 |
| `round()` | `Vector2` | 各分量四舍五入 |
| `sign()` | `Vector2` | 各分量取符号 (-1/0/1) |
| `snapped(step)` | `Vector2` | 按步长对齐 |

#### 比较

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `is_zero()` | `boolean` | 是否为零向量 |
| `is_equal_approx(v, epsilon?)` | `boolean` | 近似相等 |
| `equal(v)` | `boolean` | 精确相等 |
| `not_equal(v)` | `boolean` | 不相等 |

#### 转换

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `to_string()` | `string` | 转为字符串 `"(x, y)"` |
| `to_array()` | `number[]` | 转为数组 `[x, y]` |

---

## Rect2 类

二维矩形。

### 构造函数

```javascript
// 方式1：x, y, width, height
const rect = new plane.Rect2(10, 20, 100, 50);

// 方式2：position(Vector2), size(Vector2)
const rect2 = new plane.Rect2(
    new plane.Vector2(10, 20),
    new plane.Vector2(100, 50)
);
```

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `position` | `Vector2` | 左上角位置 |
| `size` | `Vector2` | 尺寸 |
| `x` | `number` | 左上角 X |
| `y` | `number` | 左上角 Y |
| `width` | `number` | 宽度 |
| `height` | `number` | 高度 |
| `end` | `Vector2` | 只读，右下角位置 |
| `center` | `Vector2` | 只读，中心点 |
| `area` | `number` | 只读，面积 |

### 方法

#### `has_point(point)` → `boolean`
判断点是否在矩形内。

```javascript
const rect = new plane.Rect2(0, 0, 100, 100);
rect.has_point(new plane.Vector2(50, 50)); // true
rect.has_point(new plane.Vector2(150, 50)); // false
```

#### `intersects(other)` → `boolean`
判断是否与另一个矩形相交。

#### `clip(other)` → `Rect2`
获取与另一个矩形的交集。

#### `expand(point)` → `Rect2`
扩展矩形以包含指定点。

#### `merge(other)` → `Rect2`
合并两个矩形。

#### `get_area()` → `number`
获取面积。

#### `clone()` → `Rect2`
克隆矩形。

#### `to_string()` → `string`
转为字符串。

---

## Transform2D 类

二维变换（旋转 + 平移 + 缩放）。

### 构造函数

```javascript
const transform = new plane.Transform2D(
    Math.PI / 4,                    // 旋转角度（弧度）
    new plane.Vector2(100, 200)     // 位置
);
```

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `rotation` | `number` | 旋转角度（弧度） |
| `position` | `Vector2` | 位置 |
| `scale` | `Vector2` | 缩放，默认 (1, 1) |
| `x` | `Vector2` | 只读，X 基向量 |
| `y` | `Vector2` | 只读，Y 基向量 |

### 方法

#### `apply(point)` / `xform(point)` → `Vector2`
对点应用变换。

```javascript
const t = new plane.Transform2D(0, new plane.Vector2(100, 0));
t.apply(new plane.Vector2(10, 0)); // (110, 0)
```

#### `inverse_apply(point)` / `xform_inv(point)` → `Vector2`
逆变换。

#### `get_origin()` → `Vector2`
获取原点位置。

#### `get_rotation()` → `number`
获取旋转角度。

#### `get_scale()` → `Vector2`
获取缩放。

#### `basis_x()` → `Vector2`
获取 X 基向量。

#### `basis_y()` → `Vector2`
获取 Y 基向量。

#### `translated(offset)` → `Transform2D`
返回平移后的新变换。

#### `scaled(scale)` → `Transform2D`
返回缩放后的新变换。

#### `rotated(angle)` → `Transform2D`
返回旋转后的新变换。

#### `clone()` → `Transform2D`
克隆变换。

---

## Color 类

RGBA 颜色。

### 构造函数

```javascript
const color = new plane.Color(1, 0, 0, 1); // 红色
const white = new plane.Color();            // 白色 (1,1,1,1)
```

### 静态常量

| 常量 | 颜色 |
|------|------|
| `Color.WHITE` | 白色 |
| `Color.BLACK` | 黑色 |
| `Color.RED` | 红色 |
| `Color.GREEN` | 绿色 |
| `Color.BLUE` | 蓝色 |
| `Color.YELLOW` | 黄色 |
| `Color.CYAN` | 青色 |
| `Color.MAGENTA` | 品红 |
| `Color.TRANSPARENT` | 透明 |

### 方法

#### `clone()` → `Color`
克隆颜色。

#### `to_hex()` → `string`
转为十六进制字符串。

```javascript
new plane.Color(1, 0, 0, 1).to_hex(); // "#ff0000ff"
```

#### `to_rgba()` → `string`
转为 CSS rgba 字符串。

```javascript
new plane.Color(1, 0, 0, 0.5).to_rgba(); // "rgba(255, 0, 0, 0.5)"
```

#### `blend(other)` → `Color`
与另一个颜色混合。

#### `linear_interpolate(other, t)` / `lerp(other, t)` → `Color`
线性插值。

```javascript
const c = plane.Color.RED.lerp(plane.Color.BLUE, 0.5);
```

#### `modulate(color)` → `Color`
逐分量相乘。

#### `darkened(amount)` → `Color`
变暗。

#### `lightened(amount)` → `Color`
变亮。

#### `inverted()` → `Color`
反色。

#### `gray()` → `number`
获取灰度值。

---

## MathUtils 对象

数学工具函数集。

### 常量

| 常量 | 值 |
|------|------|
| `PI` | `Math.PI` |
| `TAU` | `Math.PI * 2` |
| `PI_2` | `Math.PI / 2` |
| `PI_4` | `Math.PI / 4` |

### 角度转换

```javascript
plane.MathUtils.deg_to_rad(180);  // 3.14159...
plane.MathUtils.rad_to_deg(Math.PI); // 180
```

### 插值

```javascript
plane.MathUtils.lerp(0, 100, 0.5);       // 50
plane.MathUtils.inverse_lerp(0, 100, 50); // 0.5
```

### 范围限制

```javascript
plane.MathUtils.clamp(150, 0, 100); // 100
plane.MathUtils.clamp(-10, 0, 100); // 0
plane.MathUtils.wrap(370, 0, 360);  // 10
```

### 平滑与缓动

```javascript
plane.MathUtils.smoothstep(0, 1, 0.5); // 0.5

plane.MathUtils.ease(0.5, 'linear');         // 0.5
plane.MathUtils.ease(0.5, 'ease_in');        // 0.25
plane.MathUtils.ease(0.5, 'ease_out');       // 0.75
plane.MathUtils.ease(0.5, 'ease_in_out');    // 0.5
plane.MathUtils.ease(0.5, 'ease_in_cubic');
plane.MathUtils.ease(0.5, 'ease_out_cubic');
plane.MathUtils.ease(0.5, 'ease_in_out_cubic');
```

### 随机数

```javascript
plane.MathUtils.random_range(1, 10);   // 1~10 之间的随机数
plane.MathUtils.random_int(1, 10);     // 1~10 之间的随机整数
plane.MathUtils.random_choice([1,2,3]); // 随机选一个
plane.MathUtils.shuffle([1,2,3,4,5]);  // 随机打乱数组
```

### 工具函数

```javascript
plane.MathUtils.sign(-5);                    // -1
plane.MathUtils.is_equal_approx(0.1+0.2, 0.3); // true
plane.MathUtils.move_toward(0, 10, 3);      // 3
plane.MathUtils.angle_wrap(Math.PI * 3);     // 角度归一化到 -PI ~ PI
plane.MathUtils.angle_lerp(0, Math.PI, 0.5); // 角度插值
plane.MathUtils.map(50, 0, 100, 0, 1);       // 0.5 (值映射)
plane.MathUtils.round_to(3.7, 0.5);          // 3.5
plane.MathUtils.floor_to(3.7, 0.5);          // 3.5
```
