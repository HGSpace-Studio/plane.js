# Node

节点基类，所有游戏对象的基础。

**继承：** 无

## 构造函数

```javascript
const node = new plane.Node();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | `"Node"` | 节点名称 |
| `_parent` | `Node` | `null` | 父节点（内部） |
| `_children` | `Node[]` | `[]` | 子节点列表（内部） |
| `_visible` | `boolean` | `true` | 是否可见 |
| `_processing` | `boolean` | `false` | 是否启用 _process |
| `_physics_processing` | `boolean` | `false` | 是否启用 _physics_process |

## 生命周期方法

### _enter_tree()

节点进入场景树时调用。自动递归调用子节点。

### _exit_tree()

节点离开场景树时调用。

### _process(dt)

每帧处理回调。需要调用 `set_process(true)` 启用。

**参数：**
- `dt` (`number`) - 帧间隔时间（秒）

### _physics_process(dt)

物理帧处理回调。需要调用 `set_physics_process(true)` 启用。

**参数：**
- `dt` (`number`) - 固定物理步长（秒）

### _ready()

节点首次进入场景树时异步调用。

## 节点操作

### add_child(node, force_readable_name)

添加子节点。

**参数：**
- `node` (`Node`) - 要添加的子节点
- `force_readable_name` (`boolean`, 默认 `false`) - 是否自动生成可读名称

**示例：**
```javascript
const child = new plane.Node2D();
child.name = "Player";
parent.add_child(child);
```

### remove_child(node)

移除子节点。

**参数：**
- `node` (`Node`) - 要移除的子节点

### get_child(index)

获取指定索引的子节点。

**参数：**
- `index` (`number`) - 子节点索引

**返回：** `Node` 或 `null`

### get_child_count()

获取子节点数量。

**返回：** `number`

### get_children()

获取所有子节点的副本。

**返回：** `Node[]`

### find_child(name, recursive, owned_only)

按名称查找子节点。

**参数：**
- `name` (`string`) - 节点名称
- `recursive` (`boolean`, 默认 `false`) - 是否递归搜索
- `owned_only` (`boolean`, 默认 `false`) - 是否仅搜索 owned 节点

**返回：** `Node` 或 `null`

### find_node(name, recursive, owned_only)

按名称查找节点（包含自身）。

**参数：**
- `name` (`string`) - 节点名称
- `recursive` (`boolean`, 默认 `true`)
- `owned_only` (`boolean`, 默认 `true`)

**返回：** `Node` 或 `null`

### get_node(path)

通过路径获取节点。

**参数：**
- `path` (`string` | `NodePath`) - 节点路径，支持 `.`（当前）、`..`（父级）、`/`（根节点绝对路径）

**示例：**
```javascript
// 相对路径
const child = node.get_node("ChildName");
const grandchild = node.get_node("Child/Grandchild");

// 绝对路径
const root_child = node.get_node("/Root/Child");

// 使用 ..
const sibling = node.get_node("../Sibling");
```

### get_parent()

获取父节点。

**返回：** `Node` 或 `null`

### is_inside_tree()

节点是否在场景树中。

**返回：** `boolean`

### queue_free()

将节点标记为释放，在帧末自动从父节点移除。

### duplicate(flags)

复制节点及其子树。

**参数：**
- `flags` (`number`, 默认 `15`) - 复制标志

**返回：** `Node` - 复制的新节点

## 分组

### add_to_group(name, persistent)

将节点添加到分组。

**参数：**
- `name` (`string`) - 分组名称
- `persistent` (`boolean`, 默认 `false`)

### remove_from_group(name)

从分组中移除节点。

### is_in_group(name)

检查节点是否在指定分组中。

**返回：** `boolean`

### get_groups()

获取节点所在的所有分组。

**返回：** `string[]`

## 可见性与处理

### set_process(enabled)

启用/禁用每帧处理。

### set_physics_process(enabled)

启用/禁用物理帧处理。

### set_visible(visible)

设置节点可见性。

### is_visible()

获取节点可见性。

**返回：** `boolean`

## NodePath

节点路径类，用于表示节点树中的路径。

```javascript
const path = new plane.NodePath("Child/Grandchild");
path.get_name(0);    // "Child"
path.get_name(1);    // "Grandchild"
path.get_length();   // 2
path.is_absolute();  // false

const absPath = new plane.NodePath("/Root/Child");
absPath.is_absolute(); // true
```

### 静态方法

#### NodePath.from_node(node)

从节点创建路径。

**返回：** `NodePath` - 节点的绝对路径
