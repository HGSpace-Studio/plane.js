# SceneTree

场景树管理器，继承自 `Node`，管理场景切换和生命周期。

**继承：** `Node` → `SceneTree`

## 构造函数

```javascript
const tree = new plane.SceneTree();
```

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `current_scene` | `Node` | 当前场景（只读） |
| `root_viewport` | `Viewport` | 根视口（只读） |
| `paused` | `boolean` | 是否暂停 |
| `time_scale` | `number` | 时间缩放 |

## 方法

### set_root_viewport(viewport)

设置根视口。

### get_root_viewport()

获取根视口。

**返回：** `Viewport`

### change_scene(scene)

切换场景。旧场景会被 `queue_free()`。

**参数：**
- `scene` (`Node`) - 新场景节点

**示例：**
```javascript
const new_scene = new plane.Node();
tree.change_scene(new_scene);
```

### reload_current_scene()

重新加载当前场景（通过 `duplicate()` 复制）。

### quit()

发送退出请求事件。

### set_auto_accept_quit(value)

设置是否自动接受退出。

### set_quit_on_go_back(value)

设置返回时是否退出。

## 事件

SceneTree 在每帧处理时会发送以下事件：

- `process_frame` - 每帧处理时
- `physics_frame` - 物理帧时
- `quit_request` - 退出请求时

## 示例

```javascript
const tree = new plane.SceneTree();

// 创建场景
const level = new plane.Node2D();
level.name = "Level1";

// 切换场景
tree.change_scene(level);

// 暂停
tree.paused = true;

// 恢复
tree.paused = false;
```
