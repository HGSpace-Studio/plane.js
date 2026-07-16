# CharacterBody2D

2D 角色体节点，用于控制角色移动和碰撞。

**继承：** `Node` → `Node2D` → `CharacterBody2D`

## 构造函数

```javascript
const character = new plane.CharacterBody2D();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `velocity` | `Vector2` | `(0, 0)` | 速度向量 |
| `speed` | `number` | `200` | 移动速度 |
| `jump_velocity` | `number` | `-400` | 跳跃速度 |
| `gravity` | `number` | `980` | 重力加速度 |
| `floor_stop_on_slope` | `boolean` | `true` | 在斜坡上停止 |
| `floor_constant_speed` | `boolean` | `false` | 在斜坡上保持恒定速度 |
| `floor_block_on_wall` | `boolean` | `true` | 在墙上阻挡 |
| `motion_mode` | `number` | `0` | 运动模式 |

## 方法

### move_and_slide()

移动并滑动。

**返回：** `Vector2` - 剩余速度

```javascript
const remaining = character.move_and_slide();
```

### move_and_collide(motion)

移动并检测碰撞。

**参数：**
- `motion` (`Vector2`) - 运动向量

**返回：** `KinematicCollision2D` 或 `null`

```javascript
const collision = character.move_and_collide(velocity);
if (collision) {
    console.log("碰撞到:", collision.collider);
}
```

### is_on_floor()

检查是否在地面上。

**返回：** `boolean`

```javascript
if (character.is_on_floor()) {
    can_jump = true;
}
```

### is_on_wall()

检查是否在墙上。

**返回：** `boolean`

```javascript
if (character.is_on_wall()) {
    console.log("碰到墙了");
}
```

### is_on_ceiling()

检查是否在天花板下。

**返回：** `boolean`

```javascript
if (character.is_on_ceiling()) {
    velocity.y = 0;
}
```

### get_floor_normal()

获取地面法线。

**返回：** `Vector2`

```javascript
const normal = character.get_floor_normal();
```

### get_wall_normal()

获取墙面法线。

**返回：** `Vector2`

```javascript
const normal = character.get_wall_normal();
```

## 示例

```javascript
class Player extends plane.CharacterBody2D {
    _ready() {
        this.speed = 300;
        this.jump_velocity = -500;
        this.gravity = 980;
        
        // 添加碰撞形状
        const collision = new plane.CollisionShape2D();
        const shape = new plane.RectangleShape2D();
        shape.size = new plane.Vector2(32, 64);
        collision.shape = shape;
        this.add_child(collision);
        
        // 添加精灵
        const sprite = new plane.Sprite();
        sprite.texture = await plane.load_image('player.png');
        this.add_child(sprite);
    }
    
    _physics_process(delta) {
        // 应用重力
        if (!this.is_on_floor()) {
            this.velocity.y += this.gravity * delta;
        }
        
        // 跳跃
        if (plane.Input.is_action_just_pressed("jump")) {
            if (this.is_on_floor()) {
                this.velocity.y = this.jump_velocity;
            }
        }
        
        // 水平移动
        const direction = plane.Input.get_axis("move_left", "move_right");
        if (direction !== 0) {
            this.velocity.x = direction * this.speed;
        } else {
            this.velocity.x = 0;
        }
        
        // 移动并滑动
        this.move_and_slide();
    }
}

const player = new Player();
scene.add_child(player);
```

## 运动模式

- `0` - 地面模式（默认）
- `1` - 浮动模式（不受重力影响）

## 注意事项

- CharacterBody2D 用于玩家控制的物体
- 使用 move_and_slide() 处理移动和碰撞
- 在 _physics_process 中处理物理逻辑
- 必须添加 CollisionShape2D 才能检测碰撞
- is_on_floor() 等方法在 move_and_slide() 后才会更新
