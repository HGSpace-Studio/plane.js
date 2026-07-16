# Area2D

2D 区域节点，用于检测重叠和触发事件。

**继承：** `Node` → `Node2D` → `Area2D`

## 构造函数

```javascript
const area = new plane.Area2D();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `monitoring` | `boolean` | `true` | 是否监测其他物体 |
| `monitorable` | `boolean` | `true` | 是否可被其他 Area2D 监测 |
| `gravity` | `number` | `0` | 重力强度 |
| `gravity_direction` | `Vector2` | `(0, 1)` | 重力方向 |
| `linear_damp` | `number` | `0` | 线性阻尼 |
| `angular_damp` | `number` | `0` | 角阻尼 |

## 方法

### get_overlapping_bodies()

获取重叠的刚体。

**返回：** `Array` - 重叠的 RigidBody2D 数组

```javascript
const bodies = area.get_overlapping_bodies();
bodies.forEach(body => {
    console.log("重叠的物体:", body);
});
```

### get_overlapping_areas()

获取重叠的区域。

**返回：** `Array` - 重叠的 Area2D 数组

```javascript
const areas = area.get_overlapping_areas();
```

### has_overlapping_bodies()

检查是否有重叠的刚体。

**返回：** `boolean`

```javascript
if (area.has_overlapping_bodies()) {
    console.log("有物体在区域内");
}
```

### has_overlapping_areas()

检查是否有重叠的区域。

**返回：** `boolean`

```javascript
if (area.has_overlapping_areas()) {
    console.log("有区域重叠");
}
```

## 信号

### body_entered(body)

当刚体进入区域时触发。

```javascript
area.connect("body_entered", (body) => {
    console.log("物体进入:", body);
});
```

### body_exited(body)

当刚体离开区域时触发。

```javascript
area.connect("body_exited", (body) => {
    console.log("物体离开:", body);
});
```

### area_entered(area)

当区域进入时触发。

```javascript
area.connect("area_entered", (other_area) => {
    console.log("区域进入:", other_area);
});
```

### area_exited(area)

当区域离开时触发。

```javascript
area.connect("area_exited", (other_area) => {
    console.log("区域离开:", other_area);
});
```

## 示例

```javascript
// 创建检测区域
const detection_area = new plane.Area2D();
detection_area.position = new plane.Vector2(400, 300);

// 添加碰撞形状
const collision = new plane.CollisionShape2D();
const shape = new plane.CircleShape2D();
shape.radius = 100;
collision.shape = shape;
detection_area.add_child(collision);

scene.add_child(detection_area);

// 监听进入和离开
detection_area.connect("body_entered", (body) => {
    if (body.is_in_group("enemies")) {
        console.log("敌人进入检测区域!");
        body.add_to_group("detected");
    }
});

detection_area.connect("body_exited", (body) => {
    if (body.is_in_group("enemies")) {
        console.log("敌人离开检测区域!");
        body.remove_from_group("detected");
    }
});

// 创建触发区域（如陷阱）
const trap = new plane.Area2D();
trap.position = new plane.Vector2(500, 400);

const trap_collision = new plane.CollisionShape2D();
const trap_shape = new plane.RectangleShape2D();
trap_shape.size = new plane.Vector2(100, 20);
trap_collision.shape = trap_shape;
trap.add_child(trap_collision);

scene.add_child(trap);

trap.connect("body_entered", (body) => {
    if (body.name === "Player") {
        console.log("玩家触发陷阱!");
        body.take_damage(10);
    }
});
```

## 用途

Area2D 常用于：
- 检测区域（如敌人检测玩家）
- 触发器（如陷阱、传送门）
- 收集物品（如金币、道具）
- 检查点
- 区域效果（如治疗区域）

## 注意事项

- Area2D 不参与物理碰撞，只检测重叠
- 必须添加 CollisionShape2D 才能检测
- monitoring 为 false 时不会检测其他物体
- monitorable 为 false 时不会被其他 Area2D 检测到
