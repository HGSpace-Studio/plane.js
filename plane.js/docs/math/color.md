# Color

颜色类，支持 RGBA 颜色操作。

## 构造函数

```javascript
const color = new plane.Color(r, g, b, a);
```

**参数：**
- `r` (`number`, 默认 `1`) - 红色分量 (0~1)
- `g` (`number`, 默认 `1`) - 绿色分量 (0~1)
- `b` (`number`, 默认 `1`) - 蓝色分量 (0~1)
- `a` (`number`, 默认 `1`) - 透明度 (0~1)

## 静态常量

| 常量 | 值 | 说明 |
|------|-----|------|
| `Color.WHITE` | `(1, 1, 1, 1)` | 白色 |
| `Color.BLACK` | `(0, 0, 0, 1)` | 黑色 |
| `Color.RED` | `(1, 0, 0, 1)` | 红色 |
| `Color.GREEN` | `(0, 1, 0, 1)` | 绿色 |
| `Color.BLUE` | `(0, 0, 1, 1)` | 蓝色 |
| `Color.YELLOW` | `(1, 1, 0, 1)` | 黄色 |
| `Color.CYAN` | `(0, 1, 1, 1)` | 青色 |
| `Color.MAGENTA` | `(1, 0, 1, 1)` | 品红 |
| `Color.TRANSPARENT` | `(0, 0, 0, 0)` | 透明 |

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `r` | `number` | 红色分量 |
| `g` | `number` | 绿色分量 |
| `b` | `number` | 蓝色分量 |
| `a` | `number` | 透明度 |

## 方法

### clone()

创建颜色副本。

```javascript
const copy = color.clone();
```

### to_hex()

转换为十六进制字符串。

```javascript
const hex = color.to_hex();  // "#ff0000ff"
```

### to_rgba()

转换为 CSS rgba 字符串。

```javascript
const rgba = color.to_rgba();  // "rgba(255, 0, 0, 1)"
```

### blend(other)

与另一颜色混合。

```javascript
const blended = color1.blend(color2);
```

### linear_interpolate(other, t) / lerp(other, t)

线性插值。

```javascript
const mid = color1.lerp(color2, 0.5);
```

### modulate(color)

颜色调制（分量相乘）。

```javascript
const modulated = color.modulate(other);
```

### darkened(amount)

变暗。

```javascript
const darker = color.darkened(0.2);
```

### lightened(amount)

变亮。

```javascript
const lighter = color.lightened(0.2);
```

### inverted()

反色。

```javascript
const inv = color.inverted();
```

### gray()

获取灰度值。

```javascript
const grayValue = color.gray();
```

### to_string()

转换为字符串。

```javascript
console.log(color.to_string());  // "Color(1, 0, 0, 1)"
```

## 示例

```javascript
// 创建颜色
const red = new plane.Color(1, 0, 0, 1);
const semiTransparent = new plane.Color(0, 0, 0, 0.5);

// 使用预定义颜色
const blue = plane.Color.BLUE;

// 颜色插值
const startColor = plane.Color.RED;
const endColor = plane.Color.BLUE;
const midColor = startColor.lerp(endColor, 0.5);

// 应用到精灵
sprite.modulate = new plane.Color(1, 0.5, 0.5, 1);  // 粉红色调

// 用于渲染
renderer.draw_rect(rect, plane.Color.GREEN);
```
