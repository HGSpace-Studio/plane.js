# Rect2

2D 矩形类，用于表示区域、碰撞体等。

## 构造函数

```javascript
// 方式1：位置和大小
const rect1 = new plane.Rect2(10, 20, 100, 50);  // x, y, width, height

// 方式2：向量和大小
const pos = new plane.Vector2(10, 20);
const size = new plane.Vector2(100, 50);
const rect2 = new plane.Rect2(pos, size);
```

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `position` | `Vector2` | 左上角位置 |
| `size` | `Vector2` | 尺寸 |
| `x` | `number` | X 坐标（可读写） |
| `y` | `number` | Y 坐标（可读写） |
| `width` | `number` | 宽度（可读写） |
| `height` | `number` | 高度（可读写） |
| `end` | `Vector2` | 右下角位置（只读） |
| `center` | `Vector2` | 中心点（只读） |
| `area` | `number` | 面积（只读） |

## 方法

### has_point(point)

检查点是否在矩形内。

```javascript
const point = new plane.Vector2(50, 30);
if (rect.has_point(point)) {
    console.log('点在矩形内');
}
```

### intersects(other)

检查是否与另一矩形相交。

```javascript
if (rect1.intersects(rect2)) {
    console.log('矩形相交');
}
```

### clip(other)

获取与另一矩形的交集。

```javascript
const intersection = rect1.clip(rect2);
```

### expand(point)

扩展矩形以包含指定点。

```javascript
const expanded = rect.expand(point);
```

### merge(other)

合并两个矩形。

```javascript
const merged = rect1.merge(rect2);
```

### get_area()

获取面积。

```javascript
const area = rect.get_area();
```

### clone()

创建矩形副本。

```javascript
const copy = rect.clone();
```

### to_string()

转换为字符串。

```javascript
console.log(rect.to_string());  // "Rect2(10, 20, 100, 50)"
```

## 示例

```javascript
// 创建玩家碰撞体
const playerRect = new plane.Rect2(
    player.position.x - 16,
    player.position.y - 16,
    32, 32
);

// 检查是否与敌人碰撞
const enemyRect = new plane.Rect2(
    enemy.position.x - 16,
    enemy.position.y - 16,
    32, 32
);

if (playerRect.intersects(enemyRect)) {
    // 处理碰撞
    player.take_damage(10);
}

// 检查点击
const mousePos = plane.Input.get_mouse_position();
if (button.rect.has_point(mousePos)) {
    button.click();
}
```
