# Node2D

2D 节点基类，继承自 `Node`，支持位置、旋转、缩放等 2D 变换。

**继承：** `Node` → `Node2D`

## 构造函数

```javascript
const node = new plane.Node2D();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `position` | `Vector2` | `(0, 0)` | 本地位置 |
| `rotation` | `number` | `0` | 本地旋转（弧度） |
| `scale` | `Vector2` | `(1, 1)` | 本地缩放 |
| `z_index` | `number` | `0` | Z 轴排序值 |
| `visible` | `boolean` | `true` | 是否可见 |
| `global_position` | `Vector2` | - | 全局位置（只读） |
| `global_rotation` | `number` | - | 全局旋转（只读） |
| `global_scale` | `Vector2` | - | 全局缩放（只读） |

## 方法

### move_and_slide(velocity, floor_normal)

移动节点并处理滑动。

**参数：**
- `velocity` (`Vector2`) - 移动速度
- `floor_normal` (`Vector2`, 默认 `(0, 1)`) - 地面法线

**返回：** `Vector2` - 剩余速度

### move_and_collide(motion)

移动节点并检测碰撞。

**参数：**
- `motion` (`Vector2`) - 移动量

**返回：** `null`（碰撞信息）

### rotate(angle)

旋转节点。

**参数：**
- `angle` (`number`) - 旋转角度（弧度）

### scale_by(factor)

缩放节点。

**参数：**
- `factor` (`Vector2` | `number`) - 缩放因子

### translate(offset)

平移节点。

**参数：**
- `offset` (`Vector2`) - 偏移量

### look_at(target)

朝向目标。

**参数：**
- `target` (`Vector2`) - 目标位置

### look_at_position(target)

同 `look_at`。

### get_angle_to(target)

获取到目标的角度。

**返回：** `number` - 弧度

### get_distance_to(target)

获取到目标的距离。

**返回：** `number`

### is_position_inside(rect)

检查位置是否在矩形内。

**返回：** `boolean`

## 示例

```javascript
class Player extends plane.Node2D {
    _ready() {
        this.position = new plane.Vector2(100, 100);
        this.scale = new plane.Vector2(2, 2);
    }

    _process(dt) {
        // 移动
        const speed = 200;
        const direction = new plane.Vector2(
            plane.Input.get_axis('move_left', 'move_right'),
            plane.Input.get_axis('move_up', 'move_down')
        );
        this.translate(direction.multiply(speed * dt));

        // 朝向鼠标
        const mouse_pos = plane.Input.get_mouse_position();
        this.look_at(mouse_pos);
    }
}
```
