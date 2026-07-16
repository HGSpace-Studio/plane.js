# Control

UI 控件基类，所有 UI 元素的基础。

**继承：** `Node` → `Node2D` → `Control`

## 构造函数

```javascript
const control = new plane.Control();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `rect_position` | `Vector2` | `(0, 0)` | 位置 |
| `rect_size` | `Vector2` | `(0, 0)` | 大小 |
| `rect_min_size` | `Vector2` | `(0, 0)` | 最小大小 |
| `rect_rotation` | `number` | `0` | 旋转角度 |
| `rect_scale` | `Vector2` | `(1, 1)` | 缩放 |
| `rect_pivot_offset` | `Vector2` | `(0, 0)` | 轴心点偏移 |
| `anchor_left` | `number` | `0` | 左锚点 (0-1) |
| `anchor_top` | `number` | `0` | 上锚点 (0-1) |
| `anchor_right` | `number` | `0` | 右锚点 (0-1) |
| `anchor_bottom` | `number` | `0` | 下锚点 (0-1) |
| `margin_left` | `number` | `0` | 左边距 |
| `margin_top` | `number` | `0` | 上边距 |
| `margin_right` | `number` | `0` | 右边距 |
| `margin_bottom` | `number` | `0` | 下边距 |
| `grow_horizontal` | `number` | `1` | 水平增长方向 |
| `grow_vertical` | `number` | `1` | 垂直增长方向 |
| `focus_mode` | `number` | `0` | 焦点模式 |
| `mouse_filter` | `number` | `0` | 鼠标过滤模式 |

## 方法

### get_rect()

获取控件矩形。

**返回：** `Rect2`

```javascript
const rect = control.get_rect();
```

### get_global_rect()

获取全局矩形。

**返回：** `Rect2`

```javascript
const global_rect = control.get_global_rect();
```

### has_point(point)

检查点是否在控件内。

**返回：** `boolean`

```javascript
if (control.has_point(mouse_pos)) {
    console.log("鼠标在控件内");
}
```

### grab_focus()

获取焦点。

```javascript
control.grab_focus();
```

### release_focus()

释放焦点。

```javascript
control.release_focus();
```

### has_focus()

检查是否有焦点。

**返回：** `boolean`

```javascript
if (control.has_focus()) {
    console.log("控件有焦点");
}
```

## 锚点系统

锚点用于定义控件相对于父容器的大小和位置。

```javascript
// 填满父容器
control.anchor_left = 0;
control.anchor_top = 0;
control.anchor_right = 1;
control.anchor_bottom = 1;

// 居中显示
control.anchor_left = 0.5;
control.anchor_top = 0.5;
control.anchor_right = 0.5;
control.anchor_bottom = 0.5;
control.rect_position = new plane.Vector2(-50, -25);
control.rect_size = new plane.Vector2(100, 50);

// 右上角
control.anchor_left = 1;
control.anchor_top = 0;
control.anchor_right = 1;
control.anchor_bottom = 0;
```

## 焦点模式

- `0` - 无焦点
- `1` - 可点击获取焦点
- `2` - 所有焦点

## 鼠标过滤模式

- `0` - 接收所有鼠标事件
- `1` - 忽略鼠标事件
- `2` - 停止鼠标事件传播

## 示例

```javascript
// 创建基础控件
const panel = new plane.Control();
panel.rect_position = new plane.Vector2(100, 100);
panel.rect_size = new plane.Vector2(200, 150);

// 设置锚点（左上角）
panel.anchor_left = 0;
panel.anchor_top = 0;
panel.anchor_right = 0;
panel.anchor_bottom = 0;

// 设置边距
panel.margin_left = 10;
panel.margin_top = 10;
panel.margin_right = 10;
panel.margin_bottom = 10;

scene.add_child(panel);

// 检查点击
if (plane.Input.is_mouse_button_just_pressed(0)) {
    const mouse_pos = plane.Input.get_mouse_position();
    if (panel.has_point(mouse_pos)) {
        console.log("面板被点击");
    }
}
```

## 注意事项

- Control 是所有 UI 控件的基类
- 使用锚点系统可以创建响应式布局
- 焦点系统用于键盘导航
- 鼠标过滤模式控制控件如何响应鼠标事件
