# Label

文本标签节点，用于显示文本。

**继承：** `Node` → `Node2D` → `Label`

## 构造函数

```javascript
const label = new plane.Label();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | `string` | `""` | 显示的文本 |
| `font_size` | `number` | `16` | 字体大小 |
| `font_family` | `string` | `"sans-serif"` | 字体族 |
| `color` | `Color` | `(1,1,1,1)` | 文本颜色 |
| `centered` | `boolean` | `false` | 是否居中对齐 |
| `autowrap` | `boolean` | `false` | 是否自动换行 |
| `align` | `number` | `0` | 水平对齐方式 |
| `valign` | `number` | `0` | 垂直对齐方式 |
| `outline_color` | `Color` | `(0,0,0,0)` | 描边颜色 |
| `outline_size` | `number` | `0` | 描边大小 |
| `shadow_color` | `Color` | `(0,0,0,0)` | 阴影颜色 |
| `shadow_offset` | `Vector2` | `(2,2)` | 阴影偏移 |
| `bold` | `boolean` | `false` | 是否粗体 |
| `italic` | `boolean` | `false` | 是否斜体 |

## 示例

```javascript
// 创建标签
const label = new plane.Label();
label.text = "Hello, plane.js!";
label.position = new plane.Vector2(100, 100);

// 设置样式
label.font_size = 24;
label.color = plane.Color.YELLOW;
label.bold = true;

// 居中对齐
label.centered = true;

// 添加阴影
label.shadow_color = new plane.Color(0, 0, 0, 0.5);
label.shadow_offset = new plane.Vector2(2, 2);

// 添加到场景
scene.add_child(label);

// 动态更新文本
let score = 0;
label._process = function(dt) {
    this.text = `Score: ${score}`;
};
```

## 多行文本

```javascript
const multiline = new plane.Label();
multiline.text = "Line 1\nLine 2\nLine 3";
multiline.autowrap = true;
```

## 注意事项

- 文本使用 Canvas 2D API 渲染
- 支持换行符 `\n`
- `centered` 为 true 时，文本会以节点位置为中心点
