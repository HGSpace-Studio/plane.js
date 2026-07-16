# plane.js API 文档

完整的 plane.js 2D 游戏引擎 API 文档。

## 文档结构

### 核心模块 (core/)
- **plane.md** - 引擎主对象
- **node.md** - 节点基类
- **node2d.md** - 2D节点
- **scene-tree.md** - 场景树
- **engine.md** - 引擎核心
- **event-bus.md** - 事件总线
- **events.md** - 事件系统

### 数学模块 (math/)
- **vector2.md** - 2D向量
- **rect2.md** - 2D矩形
- **transform2d.md** - 2D变换
- **color.md** - 颜色类
- **math-utils.md** - 数学工具

### 节点类型 (nodes/)
- **sprite.md** - 精灵节点
- **animated-sprite.md** - 动画精灵
- **label.md** - 文本标签
- **color-rect.md** - 颜色矩形
- **texture-rect.md** - 纹理矩形
- **container.md** - 容器节点
- **tilemap.md** - 瓦片地图
- **particle2d.md** - 粒子系统

### 物理系统 (physics/)
- **rigidbody2d.md** - 刚体
- **characterbody2d.md** - 角色体
- **staticbody2d.md** - 静态体
- **area2d.md** - 检测区域
- **collision-shape2d.md** - 碰撞形状

### 动画系统 (animation/)
- **animation.md** - 动画资源
- **animation-player.md** - 动画播放器
- **tween.md** - 补间动画

### UI控件 (ui/)
- **control.md** - UI基类
- **button.md** - 按钮
- **progress-bar.md** - 进度条
- **panel.md** - 面板
- **text-edit.md** - 文本编辑

### 场景系统 (scene/)
- **scene.md** - 场景管理

### 组件系统 (components/)
- **component.md** - 组件系统

### 资源管理 (resources/)
- **resource-loader.md** - 资源加载器
- **texture.md** - 纹理资源

### 其他系统
- **renderer/renderer.md** - 渲染器
- **input/input.md** - 输入系统
- **audio/audio-manager.md** - 音频管理器
- **audio/audio-stream-player.md** - 音频播放器
- **camera/camera2d.md** - 2D摄像机

## 快速开始

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Game</title>
</head>
<body>
    <script type="module">
        import './plane.js/src/index.js';
        
        // 等待引擎初始化
        global_events.connect('plane_ready', () => {
            // 创建场景
            const scene = new plane.SceneTree();
            
            // 创建玩家
            const player = new plane.Sprite();
            player.texture = await plane.load_image('player.png');
            player.position = new plane.Vector2(400, 300);
            
            scene.add_child(player);
            
            // 启动引擎
            plane.start(scene);
        });
    </script>
</body>
</html>
```

## 主要特性

- 节点树架构
- 2D渲染系统
- 物理引擎
- 动画系统
- UI控件
- 资源管理
- 输入处理
- 音频系统
- 摄像机系统

## 许可证

MIT License
