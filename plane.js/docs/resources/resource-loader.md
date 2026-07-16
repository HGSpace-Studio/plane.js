# ResourceLoader 资源加载器

资源加载器，管理资源的加载、缓存和卸载。采用单例模式。

## 获取实例

```javascript
const loader = plane.ResourceLoader.get_singleton();
```

## 方法

### load(path, type)

加载资源。

**参数：**
- `path` (`string`) - 资源路径
- `type` (`string`, 可选) - 资源类型，默认 `"Resource"`

**返回：** `Promise<Resource>` - 资源对象

**示例：**
```javascript
const loader = plane.ResourceLoader.get_singleton();

// 加载图片
const texture = await loader.load('player.png');

// 加载音频
const audio = await loader.load('sound.wav');

// 加载文本
const data = await loader.load('config.json');
```

### load_async(path, type)

异步加载资源（与 `load` 相同）。

**参数：**
- `path` (`string`) - 资源路径
- `type` (`string`, 可选) - 资源类型

**返回：** `Promise<Resource>`

### load_multiple(paths)

批量加载多个资源。

**参数：**
- `paths` (`string[]`) - 资源路径数组

**返回：** `Promise<Resource[]>`

**示例：**
```javascript
const resources = await loader.load_multiple([
    'player.png',
    'enemy.png',
    'background.jpg'
]);
```

### has(path)

检查资源是否已缓存。

**参数：**
- `path` (`string`) - 资源路径

**返回：** `boolean`

**示例：**
```javascript
if (loader.has('player.png')) {
    console.log('资源已缓存');
}
```

### get(path)

获取缓存的资源。

**参数：**
- `path` (`string`) - 资源路径

**返回：** `Resource|null` - 缓存的资源，未找到返回 `null`

### unload(path)

卸载指定资源。

**参数：**
- `path` (`string`) - 资源路径

**示例：**
```javascript
loader.unload('player.png');
```

### clear_cache()

清空所有缓存。

**示例：**
```javascript
loader.clear_cache();
```

### get_cache_info()

获取缓存信息。

**返回：** `Object` - 缓存统计信息
- `size` (`number`) - 缓存资源数量
- `hits` (`number`) - 缓存命中次数
- `misses` (`number`) - 缓存未命中次数
- `hit_rate` (`number`) - 命中率（百分比）

**示例：**
```javascript
const info = loader.get_cache_info();
console.log(`缓存大小: ${info.size}`);
console.log(`命中率: ${info.hit_rate.toFixed(2)}%`);
```

### add_format_loader(format, loader)

添加自定义格式加载器。

**参数：**
- `format` (`string`) - 文件扩展名
- `loader` (`Function`) - 加载函数

**示例：**
```javascript
loader.add_format_loader('json', (path) => {
    return fetch(path).then(r => r.json());
});
```

## 支持的资源类型

### 图片
- `.png`, `.jpg`, `.jpeg`, `.gif`
- 返回 `ImageTexture` 对象

### 音频
- `.wav`, `.mp3`, `.ogg`
- 返回 `AudioStream` 对象

### 文本
- 其他所有格式
- 返回文本内容字符串

## 缓存机制

- 自动缓存已加载的资源
- 最大缓存数量：100
- 超出限制时自动移除最早的缓存
- 相同路径的资源不会重复加载

## 示例：完整的资源加载流程

```javascript
const loader = plane.ResourceLoader.get_singleton();

// 加载游戏资源
const resources = await loader.load_multiple([
    'player.png',
    'enemy.png',
    'background.jpg',
    'music.mp3'
]);

// 使用资源
const playerSprite = new plane.Sprite();
playerSprite.texture = resources[0];

// 检查缓存状态
const cacheInfo = loader.get_cache_info();
console.log(`已加载 ${cacheInfo.size} 个资源`);

// 卸载不需要的资源
loader.unload('background.jpg');
```
