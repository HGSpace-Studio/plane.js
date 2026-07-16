# ColorRect

纯色矩形节点，用于绘制简单的色块。

**继承：** `Node` → `Node2D` → `ColorRect`

## 构造函数

```javascript
const rect = new plane.ColorRect();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `color` | `Color` | `(1,1,1,1)` | 矩形颜色 |
| `rect` | `Rect2` | `(0,0,100,100)` | 矩形区域 |
| `draw_center` | `boolean` | `false` | 是否以中心为锚点 |

## 示例

```javascript
// 创建矩形
const rect = new plane.ColorRect();
rect.color = plane.Color.RED;
rect.rect = new plane.Rect2(0, 0, 200, 100);
rect.position = new plane.Vector2(100, 100);

// 以中心为锚点
rect.draw_center = true;

scene.add_child(rect);

// 用作背景
const background = new plane.ColorRect();
background.color = new plane.Color(0.2, 0.2, 0.3, 1);
background.rect = new plane.Rect2(0, 0, 800, 600);
scene.add_child(background);
```

## 用途

- 简单的背景色块
- UI 元素背景
- 调试可视化
- 占位符
