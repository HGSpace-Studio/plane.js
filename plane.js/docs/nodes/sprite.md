# Sprite

精灵节点，用于显示纹理图像。

**继承：** `Node` → `Node2D` → `Sprite`

## 构造函数

```javascript
const sprite = new plane.Sprite();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `texture` | `Image` | `null` | 显示的纹理图像 |
| `rect` | `Rect2` | `(0,0,0,0)` | 纹理的显示区域 |
| `flip_h` | `boolean` | `false` | 水平翻转 |
| `flip_v` | `boolean` | `false` | 垂直翻转 |
| `centered` | `boolean` | `true` | 是否以中心为锚点 |
| `offset` | `Vector2` | `(0,0)` | 显示偏移 |
| `modulate` | `Color` | `(1,1,1,1)` | 颜色调制 |

## 方法

### set_flip_h(flip)

设置水平翻转。

```javascript
sprite.set_flip_h(true);
```

### set_flip_v(flip)

设置垂直翻转。

```javascript
sprite.set_flip_v(true);
```

## 生命周期

### _ready()

自动设置 rect 大小为纹理尺寸（如果未手动设置）。

## 示例

```javascript
// 创建精灵
const sprite = new plane.Sprite();

// 加载纹理
const texture = await plane.load_image('player.png');
sprite.texture = texture;

// 设置位置
sprite.position = new plane.Vector2(100, 100);

// 翻转
sprite.flip_h = true;

// 颜色调制（半透明红色）
sprite.modulate = new plane.Color(1, 0, 0, 0.5);

// 显示纹理的一部分
sprite.rect = new plane.Rect2(0, 0, 32, 32);

// 添加到场景
scene.add_child(sprite);
```

## 注意事项

- 纹理加载是异步的，使用 `await plane.load_image()`
- 如果 `centered` 为 true，精灵会以中心点为锚点显示
- `modulate` 会影响整体颜色和透明度
