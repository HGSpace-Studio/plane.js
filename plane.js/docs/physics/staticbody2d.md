# StaticBody2D

2D 静态体节点，不会移动的碰撞体。

**继承：** `Node` → `Node2D` → `StaticBody2D`

## 构造函数

```javascript
const static_body = new plane.StaticBody2D();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `constant_linear_velocity` | `Vector2` | `(0, 0)` | 恒定线速度 |
| `constant_angular_velocity` | `number` | `0` | 恒定角速度 |

## 用途

StaticBody2D 用于：
- 地面和平台
- 墙壁
- 固定的障碍物
- 不会移动的环境物体

## 示例

```javascript
// 创建地面
const ground = new plane.StaticBody2D();
ground.position = new plane.Vector2(400, 500);

// 添加碰撞形状
const collision = new plane.CollisionShape2D();
const shape = new plane.RectangleShape2D();
shape.size = new plane.Vector2(800, 50);
collision.shape = shape;
ground.add_child(collision);

// 添加精灵
const sprite = new plane.Sprite();
sprite.texture = await plane.load_image('ground.png');
ground.add_child(sprite);

scene.add_child(ground);

// 创建平台
const platform = new plane.StaticBody2D();
platform.position = new plane.Vector2(200, 300);

const platform_collision = new plane.CollisionShape2D();
const platform_shape = new plane.RectangleShape2D();
platform_shape.size = new plane.Vector2(100, 20);
platform_collision.shape = platform_shape;
platform.add_child(platform_collision);

scene.add_child(platform);
```

## 移动平台

虽然 StaticBody2D 本身不会移动，但可以通过修改 position 来创建移动平台：

```javascript
class MovingPlatform extends plane.StaticBody2D {
    _ready() {
        this.start_pos = this.position.clone();
        this.time = 0;
    }
    
    _process(delta) {
        this.time += delta;
        // 上下移动
        this.position.y = this.start_pos.y + Math.sin(this.time) * 50;
    }
}

const platform = new MovingPlatform();
scene.add_child(platform);
```

## 注意事项

- StaticBody2D 不会受物理引擎影响
- 适合用于固定的环境物体
- 如果需要移动，使用 AnimatableBody2D 或 CharacterBody2D
- 必须添加 CollisionShape2D 才能参与碰撞检测
