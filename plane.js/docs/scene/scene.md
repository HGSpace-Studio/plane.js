# Scene 场景系统

场景系统管理游戏的场景切换、视口渲染和2D世界。

## Scene 类

场景容器，管理场景的生命周期和节点树。

### 构造函数

```javascript
const scene = new plane.Scene();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `root_node` | `Node` | 只读 | 根节点 |
| `name` | `string` | `"Scene"` | 场景名称 |
| `path` | `string` | `""` | 场景路径 |
| `loaded` | `boolean` | `false` | 只读，是否已加载 |
| `active` | `boolean` | `false` | 是否激活 |

### 方法

#### `load()`
加载场景，调用根节点的 `_enter_tree()`。

**示例：**
```javascript
const scene = new plane.Scene();
scene.name = "Level1";
scene.add_child(player);
scene.load();
```

#### `unload()`
卸载场景，调用根节点的 `_exit_tree()`。

#### `add_child(node)`
添加子节点到场景。

**参数：**
- `node` (`Node`) - 要添加的节点

#### `remove_child(node)`
从场景移除子节点。

**参数：**
- `node` (`Node`) - 要移除的节点

#### `find_node(name, recursive?, owned_only?)`
查找节点。

**参数：**
- `name` (`string`) - 节点名称
- `recursive` (`boolean`, 默认 `true`) - 是否递归查找
- `owned_only` (`boolean`, 默认 `true`) - 是否只查找拥有的节点

**返回：** `Node` - 找到的节点

#### `get_node(path)`
通过路径获取节点。

**参数：**
- `path` (`string`) - 节点路径

**返回：** `Node` - 节点实例

**示例：**
```javascript
const player = scene.get_node("Player");
const weapon = scene.get_node("Player/Weapon");
```

### 完整示例

```javascript
// 创建场景
const level1 = new plane.Scene();
level1.name = "Level1";

// 添加游戏对象
const player = new plane.Sprite();
player.texture = playerImage;
player.position = new plane.Vector2(100, 100);
level1.add_child(player);

const enemy = new plane.Sprite();
enemy.texture = enemyImage;
enemy.position = new plane.Vector2(300, 200);
level1.add_child(enemy);

// 加载场景
level1.load();

// 切换到场景
plane.get_tree().change_scene(level1);
```

---

## Viewport 类

继承自 `Node2D`。视口，管理画布和渲染。

### 构造函数

```javascript
const viewport = new plane.Viewport();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `canvas` | `HTMLCanvasElement` | `null` | 只读，画布元素 |
| `renderer` | `Renderer` | `null` | 只读，渲染器 |
| `world_2d` | `World2D` | `null` | 只读，2D世界 |
| `camera` | `Camera2D` | `null` | 当前摄像机 |
| `size` | `Vector2` | `(800, 600)` | 视口大小 |
| `transparent_background` | `boolean` | `false` | 透明背景 |
| `clear_color` | `Color` | `(0.1, 0.1, 0.15, 1)` | 清屏颜色 |

### 方法

#### `_setup_canvas()`
设置画布，创建 canvas 元素并添加到 DOM。

#### `set_camera(camera)`
设置摄像机。

**参数：**
- `camera` (`Camera2D`) - 摄像机实例

#### `get_camera()`
获取当前摄像机。

**返回：** `Camera2D` - 摄像机实例

#### `resize(width, height)`
调整视口大小。

**参数：**
- `width` (`number`) - 新宽度
- `height` (`number`) - 新高度

**示例：**
```javascript
const viewport = new plane.Viewport();
viewport.resize(1024, 768);
```

### 完整示例

```javascript
// 创建视口
const viewport = new plane.Viewport();
viewport.size = new plane.Vector2(800, 600);
viewport.clear_color = new plane.Color(0.2, 0.3, 0.4, 1);

// 设置摄像机
const camera = new plane.Camera2D();
camera.smooth_enabled = true;
viewport.set_camera(camera);

// 添加到场景树
root.add_child(viewport);
```

---

## World2D 类

2D世界，管理物理空间和导航。

### 构造函数

```javascript
const world = new plane.World2D();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `physics_space` | `Object` | `null` | 物理空间 |
| `navigation_map` | `Object` | `null` | 导航地图 |
| `layer_count` | `number` | `32` | 只读，图层数量 |

### 方法

#### `get_direct_space_state()`
获取物理空间状态，用于物理查询。

**返回：** `PhysicsDirectSpaceState2D` - 物理空间状态

**示例：**
```javascript
const world = new plane.World2D();
const spaceState = world.get_direct_space_state();

// 查询点处的碰撞体
const results = spaceState.intersect_point(
    new plane.Vector2(100, 100),
    1  // 碰撞掩码
);
```

#### `set_layer_name(layer, name)`
设置图层名称。

**参数：**
- `layer` (`number`) - 图层索引（0-31）
- `name` (`string`) - 图层名称

#### `get_layer_name(layer)`
获取图层名称。

**参数：**
- `layer` (`number`) - 图层索引（0-31）

**返回：** `string` - 图层名称

**示例：**
```javascript
world.set_layer_name(0, "Player");
world.set_layer_name(1, "Enemy");
world.set_layer_name(2, "Ground");

console.log(world.get_layer_name(0)); // "Player"
```

---

## PhysicsDirectSpaceState2D 类

物理空间状态，提供物理查询功能。

### 构造函数

```javascript
const spaceState = world.get_direct_space_state();
```

### 方法

#### `intersect_point(position, collision_mask?)`
查询指定点处的碰撞体。

**参数：**
- `position` (`Vector2`) - 查询位置
- `collision_mask` (`number`, 默认 `1`) - 碰撞掩码

**返回：** `Array` - 碰撞结果数组

**示例：**
```javascript
const results = spaceState.intersect_point(
    new plane.Vector2(100, 100),
    0b11  // 检测第0和第1层
);

for (const result of results) {
    console.log("碰撞到:", result.body);
}
```

#### `intersect_shape(shape, transform, collision_mask?)`
查询与形状相交的碰撞体。

**参数：**
- `shape` (`Shape`) - 碰撞形状
- `transform` (`Transform2D`) - 变换矩阵
- `collision_mask` (`number`, 默认 `1`) - 碰撞掩码

**返回：** `Array` - 碰撞结果数组

**示例：**
```javascript
const circle = new plane.CircleShape2D();
circle.radius = 50;

const transform = new plane.Transform2D(0, new plane.Vector2(200, 200));

const results = spaceState.intersect_shape(circle, transform, 1);
```

#### `cast_motion(shape, start, end, collision_mask?)`
投射运动，检测运动路径上的碰撞。

**参数：**
- `shape` (`Shape`) - 碰撞形状
- `start` (`Vector2`) - 起始位置
- `end` (`Vector2`) - 结束位置
- `collision_mask` (`number`, 默认 `1`) - 碰撞掩码

**返回：** `Array` - 碰撞结果数组，按碰撞距离排序

**示例：**
```javascript
const results = spaceState.cast_motion(
    shape,
    new plane.Vector2(0, 0),
    new plane.Vector2(100, 0),
    1
);

if (results.length > 0) {
    const firstHit = results[0];
    console.log("首次碰撞位置:", firstHit.position);
    console.log("碰撞距离比例:", firstHit.fraction);
}
```

#### `get_rest_info(shape, transform, collision_mask?)`
获取形状的静止信息。

**参数：**
- `shape` (`Shape`) - 碰撞形状
- `transform` (`Transform2D`) - 变换矩阵
- `collision_mask` (`number`, 默认 `1`) - 碰撞掩码

**返回：** `Object|null` - 碰撞信息，无碰撞返回 `null`

---

## 完整示例：场景管理

```javascript
// 创建游戏场景
const gameScene = new plane.Scene();
gameScene.name = "Game";

// 创建视口
const viewport = new plane.Viewport();
viewport.size = new plane.Vector2(800, 600);
viewport.clear_color = new plane.Color(0.1, 0.15, 0.2, 1);

// 创建摄像机
const camera = new plane.Camera2D();
camera.smooth_enabled = true;
camera.smooth_speed = 5;
viewport.set_camera(camera);

// 创建玩家
const player = new plane.Sprite();
player.texture = playerImage;
player.position = new plane.Vector2(400, 300);
gameScene.add_child(player);

// 设置摄像机跟随
camera.set_follow_target(player);

// 创建敌人
const enemy = new plane.Sprite();
enemy.texture = enemyImage;
enemy.position = new plane.Vector2(600, 400);
gameScene.add_child(enemy);

// 加载场景
gameScene.load();

// 切换到游戏场景
plane.get_tree().change_scene(gameScene);

// 场景切换示例
function goToMenu() {
    const menuScene = new plane.Scene();
    menuScene.name = "Menu";
    
    const menuButton = new plane.Button();
    menuButton.text = "Start Game";
    menuButton.position = new plane.Vector2(400, 300);
    menuScene.add_child(menuButton);
    
    menuScene.load();
    plane.get_tree().change_scene(menuScene);
}
```
