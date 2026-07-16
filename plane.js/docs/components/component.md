# Component 组件系统

组件系统提供了一种组合式的方式来为节点添加功能。

## Component 基类

所有组件的基类。

### 构造函数

```javascript
const component = new plane.Component();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `node` | `Node` | `null` | 只读，所属节点 |
| `enabled` | `boolean` | `true` | 是否启用 |
| `name` | `string` | `"Component"` | 组件名称 |

### 生命周期方法

这些方法由引擎自动调用，可在子类中重写：

#### `_ready()`
组件就绪时调用。

#### `_process(dt)`
每帧调用。

**参数：**
- `dt` (`number`) - 帧间隔（秒）

#### `_physics_process(dt)`
每物理帧调用。

**参数：**
- `dt` (`number`) - 物理帧间隔（秒）

---

## SpriteRenderer 组件

精灵渲染器组件，为节点添加精灵渲染功能。

### 构造函数

```javascript
const renderer = new plane.SpriteRenderer();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sprite` | `Sprite` | `null` | 精灵节点 |
| `texture` | `Image` | `null` | 纹理图片 |
| `color` | `Color` | `(1,1,1,1)` | 颜色调制 |
| `flip_h` | `boolean` | `false` | 水平翻转 |
| `flip_v` | `boolean` | `false` | 垂直翻转 |

### 示例

```javascript
class Player extends plane.Node2D {
    _ready() {
        super._ready();
        
        // 添加精灵渲染器组件
        const renderer = new plane.SpriteRenderer();
        renderer.texture = this.playerImage;
        renderer.color = new plane.Color(1, 0.8, 0.8, 1);
        this.add_component(renderer);
    }
}
```

---

## RigidBodyComponent 组件

刚体组件，为节点添加物理刚体功能。

### 构造函数

```javascript
const rigidbody = new plane.RigidBodyComponent();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `body` | `RigidBody2D` | `null` | 只读，刚体节点 |
| `mass` | `number` | `1` | 质量 |
| `friction` | `number` | `0.1` | 摩擦力 |
| `bounce` | `number` | `0` | 弹性系数 |
| `gravity_scale` | `number` | `1` | 重力倍率 |
| `linear_velocity` | `Vector2` | `(0, 0)` | 线速度 |
| `angular_velocity` | `number` | `0` | 角速度 |
| `freeze_rotation` | `boolean` | `false` | 冻结旋转 |
| `is_kinematic` | `boolean` | `false` | 是否为运动学刚体 |

### 方法

#### `add_force(force)`
施加力。

**参数：**
- `force` (`Vector2`) - 力向量

#### `add_impulse(impulse)`
施加冲量。

**参数：**
- `impulse` (`Vector2`) - 冲量向量

#### `set_velocity(velocity)`
设置速度。

**参数：**
- `velocity` (`Vector2`) - 速度向量

### 示例

```javascript
class PhysicsObject extends plane.Node2D {
    _ready() {
        super._ready();
        
        // 添加刚体组件
        const rigidbody = new plane.RigidBodyComponent();
        rigidbody.mass = 5;
        rigidbody.bounce = 0.3;
        rigidbody.gravity_scale = 1;
        this.add_component(rigidbody);
        
        // 施加力
        rigidbody.add_force(new plane.Vector2(100, 0));
    }
}
```

---

## ColliderComponent 组件

碰撞器组件，为节点添加碰撞检测功能。

### 构造函数

```javascript
const collider = new plane.ColliderComponent();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collider` | `Area2D` | `null` | 只读，碰撞区域节点 |
| `shape` | `Shape` | `null` | 碰撞形状 |
| `is_trigger` | `boolean` | `false` | 是否为触发器 |
| `collision_layer` | `number` | `1` | 碰撞层 |
| `collision_mask` | `number` | `1` | 碰撞掩码 |

### 示例

```javascript
class Detectable extends plane.Node2D {
    _ready() {
        super._ready();
        
        // 添加碰撞器组件
        const collider = new plane.ColliderComponent();
        collider.shape = new plane.CircleShape2D();
        collider.shape.radius = 20;
        collider.is_trigger = true;
        this.add_component(collider);
    }
}
```

---

## ScriptComponent 组件

脚本组件，允许为节点附加自定义脚本逻辑。

### 构造函数

```javascript
const script = new plane.ScriptComponent();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `script` | `Object` | `null` | 脚本对象 |
| `properties` | `Object` | `{}` | 脚本属性 |

### 示例

```javascript
// 定义脚本
const movementScript = {
    _ready() {
        console.log('脚本就绪');
    },
    
    _process(dt) {
        // 移动逻辑
        this.position = this.position.add(new plane.Vector2(50 * dt, 0));
    }
};

// 使用脚本组件
const node = new plane.Node2D();
const scriptComp = new plane.ScriptComponent();
scriptComp.script = movementScript;
node.add_component(scriptComp);
```

---

## 完整示例：组件组合

```javascript
class Enemy extends plane.Node2D {
    _ready() {
        super._ready();
        
        // 添加精灵渲染器
        const sprite = new plane.SpriteRenderer();
        sprite.texture = this.enemyImage;
        this.add_component(sprite);
        
        // 添加刚体
        const rigidbody = new plane.RigidBodyComponent();
        rigidbody.mass = 2;
        rigidbody.gravity_scale = 1;
        this.add_component(rigidbody);
        
        // 添加碰撞器
        const collider = new plane.ColliderComponent();
        collider.shape = new plane.CircleShape2D();
        collider.shape.radius = 15;
        this.add_component(collider);
    }
    
    _process(dt) {
        // 自定义逻辑
    }
}
```
