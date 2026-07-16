# Panel

面板控件，用于创建背景区域。

**继承：** `Node` → `Node2D` → `Control` → `Panel`

## 构造函数

```javascript
const panel = new plane.Panel();
```

## 属性

Panel 继承自 Control，没有额外的属性。

## 方法

Panel 继承自 Control，没有额外的方法。

## 示例

```javascript
// 创建基础面板
const background_panel = new plane.Panel();
background_panel.rect_position = new plane.Vector2(50, 50);
background_panel.rect_size = new plane.Vector2(300, 200);

scene.add_child(background_panel);

// 创建带样式的面板
const styled_panel = new plane.Panel();
styled_panel.rect_position = new plane.Vector2(400, 50);
styled_panel.rect_size = new plane.Vector2(300, 200);

// 设置背景样式
const style = new plane.StyleBoxFlat();
style.bg_color = new plane.Color(0.15, 0.15, 0.2, 0.9);
style.border_width_left = 2;
style.border_width_right = 2;
style.border_width_top = 2;
style.border_width_bottom = 2;
style.border_color = new plane.Color(0.3, 0.3, 0.4);
style.corner_radius_top_left = 10;
style.corner_radius_top_right = 10;
style.corner_radius_bottom_left = 10;
style.corner_radius_bottom_right = 10;

styled_panel.add_stylebox_override("panel", style);

scene.add_child(styled_panel);

// 创建 UI 面板
const ui_panel = new plane.Panel();
ui_panel.rect_position = new plane.Vector2(100, 300);
ui_panel.rect_size = new plane.Vector2(600, 200);

// 添加标题
const title = new plane.Label();
title.text = "游戏信息";
title.rect_position = new plane.Vector2(10, 10);
title.add_color_override("font_color", plane.Color.WHITE);
ui_panel.add_child(title);

// 添加内容
const info = new plane.Label();
info.text = "分数: 1000\n生命: 100\n等级: 5";
info.rect_position = new plane.Vector2(10, 40);
info.add_color_override("font_color", plane.Color.WHITE);
ui_panel.add_child(info);

scene.add_child(ui_panel);

// 创建半透明遮罩
const overlay = new plane.Panel();
overlay.rect_position = new plane.Vector2(0, 0);
overlay.rect_size = new plane.Vector2(800, 600);

const overlay_style = new plane.StyleBoxFlat();
overlay_style.bg_color = new plane.Color(0, 0, 0, 0.5);
overlay.add_stylebox_override("panel", overlay_style);

scene.add_child(overlay);

// 在遮罩上添加按钮
const resume_button = new plane.Button();
resume_button.text = "继续游戏";
resume_button.rect_position = new plane.Vector2(350, 280);
resume_button.rect_size = new plane.Vector2(100, 40);
overlay.add_child(resume_button);
```

## 用途

Panel 常用于：
- 创建背景区域
- 分组 UI 元素
- 创建弹窗和对话框
- 创建半透明遮罩
- 作为容器使用

## 注意事项

- Panel 是一个简单的容器控件
- 可以通过 StyleBox 自定义外观
- Panel 本身不处理布局，需要手动设置子控件位置
- 如果需要自动布局，使用 VBoxContainer 或 HBoxContainer
