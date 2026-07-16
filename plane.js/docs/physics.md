# 物理模块 API 文档

## Physics2DManager 类

物理管理器（单例），管理所有物理体、碰撞检测。

### 获取实例

```javascript
const physics = plane.Physics2DManager.get_singleton();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `gravity` | `Vector2` | `(0, 980)` | 重力 |

### 方法

| 方法 | 说明 |
|------|------|
| `add_body(body)` | 添加刚体 |
| `remove_body(body)` | 移除刚体 |
| `add_area(area)` | 添加检测区域 |
| `remove_area(area)` | 移除检测区域 |
| `add_collision_shape(shape)` | 添加碰撞形状 |
| `remove_collision_shape(shape)` | 移除碰撞形状 |

---

## RigidBody2D 类

继承自 `CollisionObject2D` → `Node2D`。刚体物理。

### 构造函数

```javascript
const body = new plane.RigidBody2D();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mass` | `number` | `1` | 质量 |
| `friction` | `number` | `0.1` | 摩擦力 |
| `bounce` | `number` | `0` | 弹性系数 |
| `gravity_scale` | `number` | `1` | 重力倍率 |
| `linear_velocity` | `Vector2` | `(0, 0)` | 线速度 |
| `angular_velocity` | `number` | `0` | 角速度 |
| `freeze_rotation` | `boolean` | `false` | 冻结旋转 |
| `is_kinematic` | `boolean` | `false` | 是否为运动学刚体 |
| `sleeping` | `boolean` | `false` | 是否休眠 |
| `active` | `boolean` | `true` | 是否激活 |

### 方法

```javascript
const body = new plane.RigidBody2D();
body.mass = 5;
body.bounce = 0.5;
body.gravity_scale = 1;
body.position = new plane.Vector2(200, 100);

// 添加碰撞形状
const shape = new plane.CollisionShape2D();
shape.shape = new plane.CircleShape2D();
shape.shape.radius = 20;
body.add_child(shape);

root.add_child(body);

// 施加力
body.add_force(new plane.Vector2(100, 0));
body.add_impulse(new plane.Vector2(0, -200));
```

| 方法 | 说明 |
|------|------|
| `add_force(force)` | 施加力 |
| `add_impulse(impulse)` | 施加冲量 |
| `apply_central_force(force)` | 施加中心力（同 add_force） |
| `apply_impulse(impulse, position?)` | 施加冲量 |
| `set_linear_velocity(velocity)` | 设置线速度 |
| `set_angular_velocity(velocity)` | 设置角速度 |
| `set_sleeping(enabled)` | 设置休眠 |
| `wake_up()` | 唤醒 |

### 信号

```javascript
body._collision.connect((other) => {
    console.log("碰撞到:", other.name);
});
```

---

## CharacterBody2D 类

继承自 `CollisionObject2D` → `Node2D`。角色体，用于角色控制。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `velocity` | `Vector2` | `(0, 0)` | 速度 |
| `gravity_scale` | `number` | `1` | 重力倍率 |
| `friction` | `number` | `0.1` | 摩擦力 |
| `floor_normal` | `Vector2` | 只读 | 地面法线 |
| `is_on_floor` | `boolean` | 只读 | 是否在地面 |
| `is_on_wall` | `boolean` | 只读 | 是否碰墙 |
| `is_on_ceiling` | `boolean` | 只读 | 是否碰天花板 |

### 示例

```javascript
const player = new plane.CharacterBody2D();
player.gravity_scale = 1;

player._physics_process = function(dt) {
    const input = plane.get_input();

    // 水平移动
    const speed = 200;
    const dir = input.get_axis("move_left", "move_right");
    this.velocity = new plane.Vector2(dir * speed, this.velocity.y);

    // 跳跃
    if (input.is_action_just_pressed("jump") && this.is_on_floor()) {
        this.velocity = new plane.Vector2(this.velocity.x, -300);
    }

    this.move_and_slide();
};
```

| 方法 | 说明 |
|------|------|
| `move_and_slide()` | 移动并处理碰撞滑动 |
| `move_and_collide(motion)` | 移动并碰撞 |
| `is_on_floor()` → `boolean` | 是否在地面 |
| `is_on_wall()` → `boolean` | 是否碰墙 |
| `is_on_ceiling()` → `boolean` | 是否碰天花板 |

---

## StaticBody2D 类

继承自 `CollisionObject2D` → `Node2D`。静态体（不会移动）。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `friction` | `number` | `0.1` | 摩擦力 |
| `bounce` | `number` | `0` | 弹性 |

### 示例

```javascript
const ground = new plane.StaticBody2D();
ground.position = new plane.Vector2(400, 500);

const shape = new plane.CollisionShape2D();
shape.shape = new plane.RectangleShape2D();
shape.shape.rect = new plane.Rect2(0, 0, 800, 20);
ground.add_child(shape);

root.add_child(ground);
```

---

## Area2D 类

继承自 `CollisionObject2D` → `Node2D`。检测区域。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `monitoring` | `boolean` | `true` | 是否监测 |
| `monitorable` | `boolean` | `true` | 是否可被监测 |
| `priority` | `number` | `0` | 优先级 |

### 示例

```javascript
const area = new plane.Area2D();
area.monitoring = true;

const shape = new plane.CollisionShape2D();
shape.shape = new plane.CircleShape2D();
shape.shape.radius = 50;
area.add_child(shape);

// 监听进入/离开
area._body_entered.connect((body) => {
    console.log("进入区域:", body.name);
});
area._body_exited.connect((body) => {
    console.log("离开区域:", body.name);
});

root.add_child(area);
```

| 方法 | 说明 |
|------|------|
| `get_overlapping_bodies()` → `Node[]` | 获取重叠的刚体 |
| `get_overlapping_areas()` → `Area2D[]` | 获取重叠的区域 |

---

## CollisionShape2D 类

继承自 `Node2D`。碰撞形状节点，附加到 CollisionObject2D 上。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `shape` | `Shape` | `null` | 碰撞形状 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `one_way` | `boolean` | `false` | 是否单向碰撞 |
| `one_way_margin` | `number` | `0` | 单向边距 |

---

## 碰撞形状类

### CircleShape2D

```javascript
const circle = new plane.CircleShape2D();
circle.radius = 20;
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `radius` | `number` | `10` | 半径 |

### RectangleShape2D

```javascript
const rect = new plane.RectangleShape2D();
rect.rect = new plane.Rect2(0, 0, 50, 30);
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `rect` | `Rect2` | `(0,0,50,50)` | 矩形区域 |

### CapsuleShape2D

```javascript
const capsule = new plane.CapsuleShape2D();
capsule.radius = 10;
capsule.height = 40;
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `radius` | `number` | `10` | 半径 |
| `height` | `number` | `40` | 高度 |

---

## 物理示例：完整平台跳跃

```javascript
// 创建地面
const ground = new plane.StaticBody2D();
ground.position = new plane.Vector2(400, 550);
const groundShape = new plane.CollisionShape2D();
groundShape.shape = new plane.RectangleShape2D();
groundShape.shape.rect = new plane.Rect2(0, 0, 800, 40);
ground.add_child(groundShape);
root.add_child(ground);

// 创建玩家
const player = new plane.CharacterBody2D();
player.position = new plane.Vector2(100, 400);
const playerShape = new plane.CollisionShape2D();
playerShape.shape = new plane.CircleShape2D();
playerShape.shape.radius = 15;
player.add_child(playerShape);

player._physics_process = function(dt) {
    const input = plane.get_input();
    const speed = 200;
    const jumpSpeed = -400;
    const gravity = 980;

    let vel = this.velocity;
    vel = new plane.Vector2(
        input.get_axis("move_left", "move_right") * speed,
        vel.y + gravity * dt
    );

    if (input.is_action_just_pressed("jump") && this.is_on_floor()) {
        vel = new plane.Vector2(vel.x, jumpSpeed);
    }

    this.velocity = vel;
    this.move_and_slide();
};
root.add_child(player);
```
