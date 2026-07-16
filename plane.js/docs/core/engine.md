# Engine

引擎核心类，管理游戏循环、物理更新和帧率控制。

## 获取实例

```javascript
const engine = plane.Engine.get_singleton();
```

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `active` | `boolean` | 引擎是否激活（只读） |
| `paused` | `boolean` | 是否暂停 |
| `quit` | `boolean` | 是否退出（只读） |
| `delta_time` | `number` | 帧间隔时间（只读） |
| `physics_delta_time` | `number` | 物理帧间隔（只读） |
| `time_scale` | `number` | 时间缩放 |
| `fps` | `number` | 当前帧率（只读） |
| `root` | `Node` | 根节点（只读） |
| `main_loop` | `MainLoop` | 主循环（只读） |

## 方法

### Engine.get_instance() / Engine.get_singleton()

获取引擎单例。

**返回：** `Engine`

### initialize(root_viewport)

初始化引擎。

**参数：**
- `root_viewport` (`Viewport`) - 根视口

### start(main_loop)

启动引擎。

**参数：**
- `main_loop` (`Node`) - 主循环节点

### get_delta_time()

获取帧间隔时间（考虑时间缩放）。

**返回：** `number`

### get_physics_delta_time()

获取物理帧间隔时间。

**返回：** `number`

### get_fixed_time()

获取固定物理时间。

**返回：** `number`

### queue_free(node)

将节点加入释放队列。

### quit()

退出引擎。

### set_root_node(node)

设置根节点。

### add_to_group(node, group, persistent)

将节点添加到分组。

### remove_from_group(node, group)

从分组中移除节点。

### get_nodes_in_group(group)

获取分组中的所有节点。

**返回：** `Node[]`

### get_realtime_elapsed()

获取实时运行时间。

**返回：** `number` - 秒

### get_root()

获取根节点。

**返回：** `Node`

## 内部机制

- 使用 `requestAnimationFrame` 驱动游戏循环
- 物理更新使用固定步长（默认 1/60 秒）
- 最大物理子步数：4
- 最大 delta 限制：0.1 秒

## 事件

- `engine_initialized` - 引擎初始化完成
- `engine_started` - 引擎启动
- `engine_quit` - 引擎退出
