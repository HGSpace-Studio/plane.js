# Transform2D

2D 变换类，管理位置、旋转、缩放。

## 构造函数

```javascript
const transform = new plane.Transform2D(rotation, position);
```

**参数：**
- `rotation` (`number`, 默认 `0`) - 旋转角度（弧度）
- `position` (`Vector2`, 默认 `(0, 0)`) - 位置

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `rotation` | `number` | 旋转角度（弧度） |
| `position` | `Vector2` | 位置 |
| `scale` | `Vector2` | 缩放（默认 `(1, 1)`） |

## 方法

### get_origin()

获取原点位置。

```javascript
const origin = transform.get_origin();
```

### get_rotation()

获取旋转角度。

```javascript
const rot = transform.get_rotation();
```

### get_scale()

获取缩放。

```javascript
const scale = transform.get_scale();
```

### basis_x() / basis_y()

获取基向量。

```javascript
const xAxis = transform.basis_x();
const yAxis = transform.basis_y();
```

### apply(point) / xform(point)

将点从局部坐标转换到全局坐标。

```javascript
const localPoint = new plane.Vector2(10, 0);
const globalPoint = transform.apply(localPoint);
```

### inverse_apply(point) / xform_inv(point)

将点从全局坐标转换到局部坐标。

```javascript
const globalPoint = new plane.Vector2(100, 50);
const localPoint = transform.inverse_apply(globalPoint);
```

### translated(offset)

平移变换（返回新变换）。

```javascript
const moved = transform.translated(offset);
```

### scaled(scale)

缩放变换（返回新变换）。

```javascript
const scaled = transform.scaled(new plane.Vector2(2, 2));
```

### rotated(angle)

旋转变换（返回新变换）。

```javascript
const rotated = transform.rotated(Math.PI / 4);
```

### orthonormalized()

正交化变换。

```javascript
const ortho = transform.orthonormalized();
```

### clone()

创建变换副本。

```javascript
const copy = transform.clone();
```

### to_string()

转换为字符串。

```javascript
console.log(transform.to_string());
```

## 示例

```javascript
// 创建变换
const transform = new plane.Transform2D(0, new plane.Vector2(100, 100));
transform.scale = new plane.Vector2(2, 2);

// 转换坐标
const localPos = new plane.Vector2(10, 0);
const globalPos = transform.apply(localPos);
console.log(globalPos);  // (120, 100)

// 反向转换
const backToLocal = transform.inverse_apply(globalPos);
console.log(backToLocal);  // (10, 0)
```
