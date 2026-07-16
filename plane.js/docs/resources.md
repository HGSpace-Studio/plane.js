# 资源模块 API 文档

## ResourceLoader 类

资源加载器（单例），支持图片、音频、文本的异步加载与缓存。

### 获取实例

```javascript
const loader = plane.ResourceLoader.get_singleton();
```

### 方法

#### `load(path, type?)` → `Promise`
加载资源。

```javascript
// 加载图片
const texture = await loader.load("assets/player.png");
// texture = { type: "ImageTexture", data: Image, width, height, path }

// 加载音频
const audio = await loader.load("assets/bgm.mp3");
// audio = { type: "AudioStream", data: Audio, duration, path }

// 加载文本
const text = await loader.load("data/level.json");
// text = { data: "...", path, type }
```

| 参数 | 类型 | 默认值 | 说明 |
|------