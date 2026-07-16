# CollisionShape2D

2D 碰撞形状节点，定义碰撞体的形状。

**继承：** `Node` → `Node2D` → `CollisionShape2D`

## 构造函数

```javascript
const collision = new plane.CollisionShape2D();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `shape` | `Shape2D` | `null` | 碰撞形状 |
| `disabled` | `boolean` | `false` | 是否禁用 |

## 碰撞形状类型

### CircleShape2D

圆形碰撞形状。

```javascript
const shape = new plane.CircleShape2D();
shape.radius = 20;

const collision = new plane.CollisionShape2D();
collision.shape = shape;
```

**属性：**
- `radius` (`number`) - 半径

### RectangleShape2D

矩形碰撞形状。

```javascript
const shape = new plane.RectangleShape2D();
shape.size = new plane.Vector2(50, 100);

const collision = new plane.CollisionShape2D();
collision.shape = shape;
```

**属性：**
- `size` (`Vector2`) - 尺寸

### CapsuleShape2D

胶囊形碰撞形状。

```javascript
const shape = new plane.CapsuleShape2D();
shape.radius = 15;
shape.height = 50;

const collision = new plane.CollisionShape2D();
collision.shape = shape;
```

**属性：**
- `radius` (`number`) - 半径
- `height` (`number`) - 高度

### ConvexPolygonShape2D

凸多边形碰撞形状。

```javascript
const shape = new plane.ConvexPolygonShape2D();
shape.points = [
    new plane.Vector2(-20, -20),
    new plane.Vector2(20, -20),
    new plane.Vector2(0, 20)
];

const collision = new plane.CollisionShape2D();
collision.shape = shape;
```

**属性：**
- `points` (`Array<Vector2>`) - 顶点数组

## 示例

```javascript
// 创建角色碰撞体
const player = new plane.CharacterBody2D();

// 矩形碰撞
const collision = new plane.CollisionShape2D();
const shape = new plane.RectangleShape2D();
shape.size = new plane.Vector2(32, 64);
collision.shape = shape;
player.add_child(collision);

scene.add_child(player);

// 创建圆形碰撞体
const ball = new plane.RigidBody2D();

const ball_collision = new plane.CollisionShape2D();
const ball_shape = new plane.CircleShape2D();
ball_shape.radius = 25;
ball_collision.shape = ball_shape;
ball.add_child(ball_collision);

scene.add_child(ball);

// 创建胶囊形碰撞体
const capsule = new plane.CharacterBody2D();

const capsule_collision = new plane.CollisionShape2D();
const capsule_shape = new plane.CapsuleShape2D();
capsule_shape.radius = 15;
capsule_shape.height = 50;
capsule_collision.shape = capsule_shape;
capsule.add_child(capsule_collision);

scene.add_child(capsule);

// 禁用碰撞
collision.disabled = true;

// 启用碰撞
collision.disabled = false;
```

## 碰撞形状选择指南

- **CircleShape2D**: 圆形物体，如球、轮子
- **RectangleShape2D**: 矩形物体，如盒子、平台
- **CapsuleShape2D**: 角色、胶囊形物体
- **ConvexPolygonShape2D**: 复杂形状，如三角形、多边形

## 注意事项

- CollisionShape2D 必须作为物理体的子节点
- 一个物理体可以有多个 CollisionShape2D
- disabled 为 true 时不参与碰撞检测
- 碰撞形状的位置和旋转会影响碰撞检测
- 选择合适的形状可以提高性能
