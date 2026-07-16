# RigidBody2D

2D 刚体节点，受物理引擎控制。

**继承：** `Node` → `Node2D` → `RigidBody2D`

## 构造函数

```javascript
const body = new plane.RigidBody2D();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mass` | `number` | `1.0` | 质量 |
| `gravity_scale` | `number` | `1.0` | 重力缩放 |
| `linear_damp` | `number` | `0.0` | 线性阻尼 |
| `angular_damp` | `number` | `0.0` | 角阻尼 |
| `continuous_cd` | `boolean` | `false` | 连续碰撞检测 |
| `can_sleep` | `boolean` | `true` | 是否可以休眠 |
| `sleeping` | `boolean` | `false` | 是否休眠 |

## 方法

### apply_force(force, position)

施加力。

**参数：**
- `force` (`Vector2`) - 力向量
- `position` (`Vector2`, 可选) - 施力位置（相对于质心）

```javascript
body.apply_force(new plane.Vector2(100, 0));
```

### apply_impulse(impulse, position)

施加冲量（瞬间速度变化）。

**参数：**
- `impulse` (`Vector2`) - 冲量向量
- `position` (`Vector2`, 可选) - 施力位置

```javascript
body.apply_impulse(new plane.Vector2(0, -300));
```

### set_linear_velocity(velocity)

设置线速度。

**参数：**
- `velocity` (`Vector2`) - 速度向量

```javascript
body.set_linear_velocity(new plane.Vector2(100, 0));
```

### get_linear_velocity()

获取线速度。

**返回：** `Vector2`

```javascript
const vel = body.get_linear_velocity();
```

### set_angular_velocity(velocity)

设置角速度。

**参数：**
- `velocity` (`number`) - 角速度（弧度/秒）

```javascript
body.set_angular_velocity(Math.PI);
```

### get_angular_velocity()

获取角速度。

**返回：** `number`

### add_collision_exception_with(body)

添加碰撞例外。

**参数：**
- `body` (`Node2D`) - 要忽略的碰撞体

```javascript
body.add_collision_exception_with(other_body);
```

### remove_collision_exception_with(body)

移除碰撞例外。

```javascript
body.remove_collision_exception_with(other_body);
```

## 信号

### body_entered(body)

当另一个物体进入碰撞时触发。

```javascript
body.connect("body_entered", (other) => {
    console.log("碰撞到:", other);
});
```

### body_exited(body)

当另一个物体离开碰撞时触发。

```javascript
body.connect("body_exited", (other) => {
    console.log("离开碰撞:", other);
});
```

## 示例

```javascript
// 创建刚体
const ball = new plane.RigidBody2D();
ball.mass = 1.0;
ball.gravity_scale = 1.0;
ball.linear_damp = 0.1;

// 添加碰撞形状
const collision = new plane.CollisionShape2D();
const shape = new plane.CircleShape2D();
shape.radius = 20;
collision.shape = shape;
ball.add_child(collision);

// 添加精灵
const sprite = new plane.Sprite();
sprite.texture = await plane.load_image('ball.png');
ball.add_child(sprite);

// 施加冲量
ball.apply_impulse(new plane.Vector2(200, -300));

scene.add_child(ball);

// 监听碰撞
ball.connect("body_entered", (other) => {
    if (other.is_in_group("enemies")) {
        console.log("击中敌人!");
    }
});
```

## 注意事项

- RigidBody2D 由物理引擎控制，不要直接修改 position
- 使用 apply_force 或 apply_impulse 来移动刚体
- 可以设置 sleeping 为 true 来暂停物理计算
- continuous_cd 用于快速移动的物体，防止穿透
