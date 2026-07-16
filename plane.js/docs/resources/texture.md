# Texture 纹理资源

纹理资源类，用于管理图像纹理数据。

## 构造函数

```javascript
const texture = new plane.Texture();
```

## 属性

### width

纹理宽度（只读）。

**类型：** `number`

### height

纹理高度（只读）。

**类型：** `number`

### data

纹理原始数据（只读）。

**类型：** `any`

## 继承自 Resource

Texture 继承自 Resource 类，具有以下属性和方法：

### path

资源路径。

**类型：** `string`

### name

资源名称。

**类型：** `string`

### loaded

是否已加载。

**类型：** `boolean`

### error

加载错误信息。

**类型：** `Error|null`

### load()

加载资源。

**返回：** `Promise<Resource>`

**示例：**
```javascript
const texture = new plane.Texture();
texture.path = 'player.png';
await texture.load();
```

### reload()

重新加载资源。

**返回：** `Promise<Resource>`

---

# ImageTexture 图像纹理

图像纹理类，继承自 Texture，专门用于处理图像资源。

## 构造函数

```javascript
const imageTexture = new plane.ImageTexture();
```

## 属性

### image

图像数据（HTML Image 对象）。

**类型：** `HTMLImageElement`

### format

图像格式。

**类型：** `number`

## 方法

### load_from_image(image)

从 Image 对象加载纹理。

**参数：**
- `image` (`HTMLImageElement`) - 图像对象

**示例：**
```javascript
const img = new Image();
img.src = 'player.png';
img.onload = () => {
    const texture = new plane.ImageTexture();
    texture.load_from_image(img);
    console.log(`纹理尺寸: ${texture.width}x${texture.height}`);
};
```

### load_from_path(path)

从路径加载纹理。

**参数：**
- `path` (`string`) - 图像路径

**返回：** `Promise<ImageTexture>`

**示例：**
```javascript
const texture = new plane.ImageTexture();
await texture.load_from_path('player.png');

// 使用纹理
const sprite = new plane.Sprite();
sprite.texture = texture;
```

## 完整示例

```javascript
// 方式1：使用 ResourceLoader
const loader = plane.ResourceLoader.get_singleton();
const texture = await loader.load('player.png');

// 方式2：直接创建 ImageTexture
const imageTexture = new plane.ImageTexture();
await imageTexture.load_from_path('player.png');

// 应用到精灵
const sprite = new plane.Sprite();
sprite.texture = imageTexture;
sprite.position = new plane.Vector2(100, 100);
```
