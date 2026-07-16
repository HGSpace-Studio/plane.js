# Renderer

渲染器类，负责管理 Canvas 2D 渲染。

## 获取实例

渲染器通常由 Viewport 自动创建和管理，一般不需要手动创建。

```javascript
const renderer = viewport.renderer;
```

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `clear_color` | `Color` | 清屏颜色 |
| `camera` | `Camera2D` | 当前摄像机 |

## 绘制方法

### draw_rect(rect, color, filled)

绘制矩形。

**参数：**
- `rect` (`Rect2`) - 矩形区域
- `color` (`Color`) - 颜色
- `filled` (`boolean`, 默认 `true`) - 是否填充

```javascript
renderer.draw_rect(
    new plane.Rect2(100, 100, 50, 50),
    plane.Color.RED,
    true
);
```

### draw_circle(center, radius, color, filled)

绘制圆形。

**参数：**
- `center` (`Vector2`) - 圆心位置
- `radius` (`number`) - 半径
- `color` (`Color`) - 颜色
- `filled` (`boolean`, 默认 `true`) - 是否填充

```javascript
renderer.draw_circle(
    new plane.Vector2(200, 200),
    30,
    plane.Color.BLUE,
    true
);
```

### draw_line(from, to, color, width)

绘制线段。

**参数：**
- `from` (`Vector2`) - 起点
- `to` (`Vector2`) - 终点
- `color` (`Color`) - 颜色
- `width` (`number`, 默认 `1`) - 线宽

```javascript
renderer.draw_line(
    new plane.Vector2(0, 0),
    new plane.Vector2(100, 100),
    plane.Color.GREEN,
    2
);
```

### draw_texture(texture, position)

绘制纹理。

**参数：**
- `texture` (`Image`) - 纹理图像
- `position` (`Vector2`) - 位置

```javascript
const img = await plane.load_image('sprite.png');
renderer.draw_texture(img, new plane.Vector2(100, 100));
```

### draw_texture_region(texture, rect, src_rect)

绘制纹理的一部分。

**参数：**
- `texture` (`Image`) - 纹理图像
- `rect` (`Rect2`) - 目标区域
- `src_rect` (`Rect2`) - 源区域

```javascript
renderer.draw_texture_region(
    texture,
    new plane.Rect2(100, 100, 32, 32),
    new plane.Rect2(0, 0, 16, 16)
);
```

### draw_string(text, position, color, font_size)

绘制文本。

**参数：**
- `text` (`string`) - 文本内容
- `position` (`Vector2`) - 位置
- `color` (`Color`) - 颜色
- `font_size` (`number`, 默认 `16`) - 字体大小

```javascript
renderer.draw_string(
    "Hello World",
    new plane.Vector2(100, 100),
    plane.Color.WHITE,
    20
);
```

## 渲染控制

### clear()

清除画布。

```javascript
renderer.clear();
```

### set_camera(camera)

设置摄像机。

```javascript
renderer.set_camera(camera);
```

## 自定义绘制

在节点中重写 `_draw` 方法可以访问渲染器：

```javascript
class CustomNode extends plane.Node2D {
    _draw(renderer) {
        renderer.draw_rect(
            new plane.Rect2(0, 0, 50, 50),
            plane.Color.RED
        );
        
        renderer.draw_circle(
            new plane.Vector2(25, 25),
            10,
            plane.Color.YELLOW
        );
    }
}
```

## 注意事项

- 所有绘制坐标都受摄像机影响
- 绘制顺序由节点的 z_index 决定
- 自定义绘制应该在 `_draw` 方法中进行
