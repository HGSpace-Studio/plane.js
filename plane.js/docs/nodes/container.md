# Container

容器节点，用于布局管理。

**继承：** `Node` → `Node2D` → `Container`

## 构造函数

```javascript
const container = new plane.Container();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `alignment` | `number` | `0` | 对齐方式（0=左/上，1=居中，2=右/下） |
| `custom_minimum_size` | `Vector2` | `(0,0)` | 最小尺寸 |
| `rect` | `Rect2` | `(0,0,200,200)` | 容器区域 |
| `fit_content` | `boolean` | `false` | 是否根据内容调整大小 |

## 子类

### VBoxContainer

垂直布局容器。

```javascript
const vbox = new plane.VBoxContainer();
vbox.spacing = 10;  // 子元素间距
```

**属性：**
- `spacing` (`number`, 默认 `4`) - 子元素间距

### HBoxContainer

水平布局容器。

```javascript
const hbox = new plane.HBoxContainer();
hbox.spacing = 10;
```

**属性：**
- `spacing` (`number`, 默认 `4`) - 子元素间距

## 示例

```javascript
// 垂直布局
const vbox = new plane.VBoxContainer();
vbox.rect = new plane.Rect2(100, 100, 200, 400);
vbox.spacing = 10;
vbox.alignment = 1;  // 居中对齐
vbox.fit_content = true;

// 添加按钮
const btn1 = new plane.Button();
btn1.text = "Button 1";
btn1.rect = new plane.Rect2(0, 0, 180, 40);

const btn2 = new plane.Button();
btn2.text = "Button 2";
btn2.rect = new plane.Rect2(0, 0, 180, 40);

vbox.add_child(btn1);
vbox.add_child(btn2);

scene.add_child(vbox);

// 水平布局
const hbox = new plane.HBoxContainer();
hbox.rect = new plane.Rect2(100, 500, 400, 50);
hbox.spacing = 20;
hbox.alignment = 1;

const label = new plane.Label();
label.text = "Score: 100";

const progressBar = new plane.ProgressBar();
progressBar.rect = new plane.Rect2(0, 0, 200, 30);

hbox.add_child(label);
hbox.add_child(progressBar);

scene.add_child(hbox);
```

## 布局行为

- `VBoxContainer` 会垂直排列子元素
- `HBoxContainer` 会水平排列子元素
- `spacing` 控制子元素之间的间距
- `alignment` 控制子元素的对齐方式
- `fit_content` 为 true 时，容器会根据子元素自动调整大小
