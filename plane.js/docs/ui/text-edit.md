# TextEdit

文本编辑控件，用于输入和编辑文本。

**继承：** `Node` → `Node2D` → `Control` → `TextEdit`

## 构造函数

```javascript
const text_edit = new plane.TextEdit();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | `string` | `""` | 文本内容 |
| `placeholder_text` | `string` | `""` | 占位符文本 |
| `editable` | `boolean` | `true` | 是否可编辑 |
| `cursor_position` | `number` | `0` | 光标位置 |
| `selection_enabled` | `boolean` | `true` | 是否启用选择 |
| `wrap_enabled` | `boolean` | `false` | 是否启用换行 |
| `max_length` | `number` | `0` | 最大长度（0为无限制） |
| `secret` | `boolean` | `false` | 是否为密码模式 |

## 方法

### get_text()

获取文本内容。

**返回：** `string`

```javascript
const text = text_edit.get_text();
console.log(text);
```

### set_text(text)

设置文本内容。

```javascript
text_edit.set_text("Hello World");
```

### clear()

清空文本。

```javascript
text_edit.clear();
```

### select_all()

选择所有文本。

```javascript
text_edit.select_all();
```

### deselect()

取消选择。

```javascript
text_edit.deselect();
```

### get_selected_text()

获取选中的文本。

**返回：** `string`

```javascript
const selected = text_edit.get_selected_text();
```

### cut()

剪切选中文本。

```javascript
text_edit.cut();
```

### copy()

复制选中文本。

```javascript
text_edit.copy();
```

### paste()

粘贴文本。

```javascript
text_edit.paste();
```

### undo()

撤销。

```javascript
text_edit.undo();
```

### redo()

重做。

```javascript
text_edit.redo();
```

### insert_text_at_cursor(text)

在光标位置插入文本。

```javascript
text_edit.insert_text_at_cursor("Hello");
```

### search(text, flags)

搜索文本。

**返回：** `Object` - 搜索结果

```javascript
const result = text_edit.search("hello", 0);
```

## 信号

### text_changed()

文本改变时触发。

```javascript
text_edit.connect("text_changed", () => {
    console.log("文本已改变:", text_edit.get_text());
});
```

### cursor_changed()

光标位置改变时触发。

```javascript
text_edit.connect("cursor_changed", () => {
    console.log("光标位置:", text_edit.cursor_position);
});
```

### focus_entered()

获取焦点时触发。

```javascript
text_edit.connect("focus_entered", () => {
    console.log("获取焦点");
});
```

### focus_exited()

失去焦点时触发。

```javascript
text_edit.connect("focus_exited", () => {
    console.log("失去焦点");
});
```

## 示例

```javascript
// 创建文本编辑器
const name_input = new plane.TextEdit();
name_input.rect_position = new plane.Vector2(100, 100);
name_input.rect_size = new plane.Vector2(200, 30);
name_input.placeholder_text = "输入你的名字";
name_input.max_length = 20;

scene.add_child(name_input);

// 监听文本改变
name_input.connect("text_changed", () => {
    const text = name_input.get_text();
    console.log("当前输入:", text);
});

// 创建密码输入框
const password_input = new plane.TextEdit();
password_input.rect_position = new plane.Vector2(100, 150);
password_input.rect_size = new plane.Vector2(200, 30);
password_input.placeholder_text = "输入密码";
password_input.secret = true;  // 密码模式

scene.add_child(password_input);

// 创建多行文本编辑器
const chat_input = new plane.TextEdit();
chat_input.rect_position = new plane.Vector2(100, 200);
chat_input.rect_size = new plane.Vector2(400, 100);
chat_input.wrap_enabled = true;
chat_input.placeholder_text = "输入消息...";

scene.add_child(chat_input);

// 创建只读文本显示
const log_display = new plane.TextEdit();
log_display.rect_position = new plane.Vector2(100, 350);
log_display.rect_size = new plane.Vector2(400, 150);
log_display.editable = false;
log_display.set_text("游戏日志:\n- 游戏开始\n- 玩家进入");

scene.add_child(log_display);

// 添加日志
function add_log(message) {
    const current = log_display.get_text();
    log_display.set_text(current + "\n- " + message);
}

// 提交按钮
const submit_button = new plane.Button();
submit_button.text = "提交";
submit_button.rect_position = new plane.Vector2(320, 100);
submit_button.rect_size = new plane.Vector2(80, 30);

scene.add_child(submit_button);

submit_button.connect("pressed", () => {
    const name = name_input.get_text();
    const password = password_input.get_text();
    console.log("提交:", name, password);
    
    // 清空输入
    name_input.clear();
    password_input.clear();
});
```

## 自定义样式

```javascript
const styled_edit = new plane.TextEdit();
styled_edit.rect_position = new plane.Vector2(100, 100);
styled_edit.rect_size = new plane.Vector2(300, 40);

// 设置正常状态样式
const normal_style = new plane.StyleBoxFlat();
normal_style.bg_color = new plane.Color(0.2, 0.2, 0.2);
normal_style.border_width_left = 1;
normal_style.border_width_right = 1;
normal_style.border_width_top = 1;
normal_style.border_width_bottom = 1;
normal_style.border_color = new plane.Color(0.4, 0.4, 0.4);
normal_style.corner_radius_top_left = 5;
normal_style.corner_radius_top_right = 5;
normal_style.corner_radius_bottom_left = 5;
normal_style.corner_radius_bottom_right = 5;

styled_edit.add_stylebox_override("normal", normal_style);

// 设置焦点状态样式
const focus_style = new plane.StyleBoxFlat();
focus_style.bg_color = new plane.Color(0.25, 0.25, 0.25);
focus_style.border_width_left = 2;
focus_style.border_width_right = 2;
focus_style.border_width_top = 2;
focus_style.border_width_bottom = 2;
focus_style.border_color = new plane.Color(0.3, 0.6, 1.0);
focus_style.corner_radius_top_left = 5;
focus_style.corner_radius_top_right = 5;
focus_style.corner_radius_bottom_left = 5;
focus_style.corner_radius_bottom_right = 5;

styled_edit.add_stylebox_override("focus", focus_style);

scene.add_child(styled_edit);
```

## 注意事项

- TextEdit 支持多行文本编辑
- secret 模式会隐藏输入内容（用于密码）
- 可以通过 placeholder_text 设置提示文本
- editable 为 false 时只能显示文本，不能编辑
- 支持基本的文本操作：剪切、复制、粘贴、撤销、重做
