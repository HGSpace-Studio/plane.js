# Button

按钮控件，用于用户交互。

**继承：** `Node` → `Node2D` → `Control` → `Button`

## 构造函数

```javascript
const button = new plane.Button();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | `string` | `""` | 按钮文本 |
| `icon` | `Texture` | `null` | 按钮图标 |
| `flat` | `boolean` | `false` | 是否扁平样式 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `toggle_mode` | `boolean` | `false` | 是否切换模式 |
| `pressed` | `boolean` | `false` | 是否按下 |
| `group` | `ButtonGroup` | `null` | 按钮组 |
| `action_mode` | `number` | `0` | 动作模式 |

## 方法

### is_pressed()

检查是否按下。

**返回：** `boolean`

```javascript
if (button.is_pressed()) {
    console.log("按钮被按下");
}
```

### is_hovered()

检查是否悬停。

**返回：** `boolean`

```javascript
if (button.is_hovered()) {
    console.log("鼠标悬停在按钮上");
}
```

### set_pressed(pressed)

设置按下状态（仅切换模式）。

```javascript
button.toggle_mode = true;
button.set_pressed(true);
```

## 信号

### pressed()

按钮被按下时触发。

```javascript
button.connect("pressed", () => {
    console.log("按钮被按下");
});
```

### button_down()

按钮被按下时触发（与 pressed 相同）。

```javascript
button.connect("button_down", () => {
    console.log("按钮按下");
});
```

### button_up()

按钮被释放时触发。

```javascript
button.connect("button_up", () => {
    console.log("按钮释放");
});
```

### toggled(pressed)

切换模式状态改变时触发。

```javascript
button.toggle_mode = true;
button.connect("toggled", (pressed) => {
    console.log("按钮状态:", pressed);
});
```

## 示例

```javascript
// 创建按钮
const start_button = new plane.Button();
start_button.text = "开始游戏";
start_button.rect_position = new plane.Vector2(300, 200);
start_button.rect_size = new plane.Vector2(200, 50);

// 设置样式
start_button.add_color_override("font_color", plane.Color.WHITE);
start_button.add_color_override("font_color_hover", plane.Color.YELLOW);
start_button.add_color_override("font_color_pressed", plane.Color.GREEN);

scene.add_child(start_button);

// 监听点击事件
start_button.connect("pressed", () => {
    console.log("开始游戏");
    // 切换到游戏场景
});

// 创建切换按钮
const toggle_button = new plane.Button();
toggle_button.text = "音乐: 开";
toggle_button.toggle_mode = true;
toggle_button.pressed = true;
toggle_button.rect_position = new plane.Vector2(300, 300);
toggle_button.rect_size = new plane.Vector2(200, 50);

scene.add_child(toggle_button);

toggle_button.connect("toggled", (pressed) => {
    toggle_button.text = pressed ? "音乐: 开" : "音乐: 关";
    if (pressed) {
        // 开启音乐
    } else {
        // 关闭音乐
    }
});

// 创建按钮组
const group = new plane.ButtonGroup();

const option1 = new plane.Button();
option1.text = "选项 1";
option1.toggle_mode = true;
option1.group = group;

const option2 = new plane.Button();
option2.text = "选项 2";
option2.toggle_mode = true;
option2.group = group;

const option3 = new plane.Button();
option3.text = "选项 3";
option3.toggle_mode = true;
option3.group = group;

// 同一时间只能有一个按钮被选中
```

## 动作模式

- `0` - 按钮释放时触发
- `1` - 按钮按下时触发

## 注意事项

- Button 继承自 Control，支持所有 UI 属性
- toggle_mode 为 true 时，按钮会在按下和释放之间切换
- ButtonGroup 用于创建单选按钮组
- 可以使用 add_color_override 自定义按钮颜色
