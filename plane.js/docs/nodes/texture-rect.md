# TextureRect

纹理矩形节点，用于显示纹理并支持平铺模式。

**继承：** `Node` → `Node2D` → `TextureRect`

## 构造函数

```javascript
const texRect = new plane.TextureRect();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `texture` | `Image` | `null` | 显示的纹理 |
| `rect` | `Rect2` | `(0,0,100,100)` | 显示区域 |
| `flip_h` | `boolean` | `false` | 水平翻转 |
| `flip_v` | `boolean` | `false` | 垂直翻转 |
| `tile_mode` | `number` | `0` | 平铺模式（0=无，1=平铺） |
| `stretch_mode` | `number` | `0` | 拉伸模式 |
| `modulate` | `Color` | `(1,1,1,1)` | 颜色调制 |

## 示例

```javascript
// 创建纹理矩形
const texRect = new plane.TextureRect();
const texture = await plane.load_image('pattern.png');
texRect.texture = texture;
texRect.rect = new plane.Rect2(0, 0, 400, 400);

// 启用平铺模式
texRect.tile_mode = 1;

scene.add_child(texRect);

// 翻转纹理
texRect.flip_h = true;
```

## 平铺模式

- `0` - 不平铺，直接显示
- `1` - 平铺模式，纹理会重复填充整个矩形区域

## 用途

- 背景图案
- 平铺纹理
- UI 纹理显示
