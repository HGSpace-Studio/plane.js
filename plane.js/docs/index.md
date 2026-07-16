# plane.js API 文档

## 概述

plane.js 是一个轻量级的 2D 游戏引擎，采用节点树架构，提供完整的 2D 游戏开发功能。

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
            
            // 创建玩家节点
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

## 核心模块

### [plane 对象](./core/plane.md)
引擎主对象，提供全局访问点和核心功能。

### [Node](./core/node.md)
节点基类，所有游戏对象的基础。

### [Node2D](./core/node2d.md)
2D 节点，支持位置、旋转、缩放等变换。

### [SceneTree](./core/scene-tree.md)
场景树管理器，管理场景切换和生命周期。

### [Engine](./core/engine.md)
引擎核心，管理游戏循环和物理更新。

### [EventBus](./core/event-bus.md)
事件系统，用于节点间通信。

## 数学模块

### [Vector2](./math/vector2.md)
2D 向量类，提供向量运算功能。

### [Rect2](./math/rect2.md)
2D 矩形类，用于碰撞检测和区域计算。

### [Transform2D](./math/transform2d.md)
2D 变换类，管理位置、旋转、缩放。

### [Color](./math/color.md)
颜色类，支持 RGBA 颜色操作。

### [MathUtils](./math/math-utils.md)
数学工具函数集合。

## 节点类型

### [Sprite](./nodes/sprite.md)
精灵节点，用于显示纹理图像。

### [AnimatedSprite](./nodes/animated-sprite.md)
动画精灵，支持帧动画播放。

### [Label](./nodes/label.md)
文本标签节点。

### [ColorRect](./nodes/color-rect.md)
纯色矩形节点。

### [TextureRect](./nodes/texture-rect.md)
纹理矩形节点。

### [Container](./nodes/container.md)
容器节点，用于布局管理。

### [TileMap](./nodes/tilemap.md)
瓦片地图节点。

### [Particle2D](./nodes/particle2d.md)
2D 粒子系统。

## 渲染系统

### [Renderer](./renderer/renderer.md)
渲染器，管理 Canvas 2D 绘制。

### [Camera2D](./camera/camera2d.md)
2D 摄像机，控制视口和跟随。

## 输入系统

### [Input](./input/input.md)
输入管理器，处理键盘、鼠标、触摸输入。

## 音频系统

### [AudioManager](./audio/audio-manager.md)
音频管理器，处理音效和音乐播放。

### [AudioStreamPlayer](./audio/audio-stream-player.md)
音频流播放器节点。

## 物理系统

### [RigidBody2D](./physics/rigidbody2d.md)
2D 刚体，支持物理模拟。

### [CharacterBody2D](./physics/characterbody2d.md)
2D 角色体，用于角色控制。

### [StaticBody2D](./physics/static-body2d.md)
2D 静态体，用于静态碰撞体。

### [Area2D](./physics/area2d.md)
2D 区域，用于检测重叠。

### [CollisionShape2D](./physics/collision-shape2d.md)
碰撞形状节点。

## 动画系统

### [Animation](./animation/animation.md)
动画资源类。

### [AnimationPlayer](./animation/animation-player.md)
动画播放器节点。

### [Tween](./animation/tween.md)
补间动画节点。

## UI 控件

### [Control](./ui/control.md)
UI 控件基类。

### [Button](./ui/button.md)
按钮控件。

### [ProgressBar](./ui/progress-bar.md)
进度条控件。

### [Panel](./ui/panel.md)
面板控件。

### [TextEdit](./ui/text-edit.md)
文本编辑控件。

## 场景系统

### [Scene](./scene/scene.md)
场景容器，管理场景生命周期和节点树。

### [Viewport](./scene/scene.md#viewport-类)
视口，管理画布和渲染。

### [World2D](./scene/scene.md#world2d-类)
2D世界，管理物理空间和导航。

### [PhysicsDirectSpaceState2D](./scene/scene.md#physicsdirectspacestate2d-类)
物理空间状态，提供物理查询功能。

## 组件系统

### [Component](./components/component.md)
组件基类，提供组合式功能添加。

### [SpriteRenderer](./components/component.md#spriterenderer-组件)
精灵渲染器组件。

### [RigidBodyComponent](./components/component.md#rigidbodycomponent-组件)
刚体组件。

### [ColliderComponent](./components/component.md#collidercomponent-组件)
碰撞器组件。

### [ScriptComponent](./components/component.md#scriptcomponent-组件)
脚本组件。

## 事件系统

### [Signal](./core/events.md#signal-类)
信号类，实现观察者模式。

### [EventBus](./core/events.md#eventbus-类)
事件总线，管理多个命名信号。

### [全局事件](./core/events.md#全局事件总线)
引擎全局事件总线。

## 资源管理

### [ResourceLoader](./resources/resource-loader.md)
资源加载器，管理资源缓存和加载。

### [Texture](./resources/texture.md)
纹理资源类。

## 示例代码

### 创建基本场景

```javascript
// 创建场景树
const scene = new plane.SceneTree();

// 创建玩家
const player = new plane.Sprite();
player.texture = await plane.load_image('player.png');
player.position = new plane.Vector2(400, 300);

// 添加到场景
scene.add_child(player);

// 启动引擎
plane.start(scene);
```

### 处理输入

```javascript
class Player extends plane.Node2D {
    _process(dt) {
        const speed = 200;
        const velocity = new plane.Vector2(0, 0);
        
        if (plane.Input.is_action_pressed('move_left')) {
            velocity.x -= speed;
        }
        if (plane.Input.is_action_pressed('move_right')) {
            velocity.x += speed;
        }
        if (plane.Input.is_action_pressed('move_up')) {
            velocity.y -= speed;
        }
        if (plane.Input.is_action_pressed('move_down')) {
            velocity.y += speed;
        }
        
        this.position = this.position.add(velocity.multiply(dt));
    }
}
```

### 使用物理

```javascript
// 创建刚体
const body = new plane.RigidBody2D();
body.mass = 1.0;
body.gravity_scale = 1.0;

// 添加碰撞形状
const shape = new plane.CollisionShape2D();
shape.shape = new plane.CircleShape2D();
shape.shape.radius = 20;
body.add_child(shape);

// 添加力
body.add_impulse(new plane.Vector2(0, -500));
```

### 播放动画

```javascript
// 创建动画精灵
const sprite = new plane.AnimatedSprite();

// 添加动画帧
const frames = [
    await plane.load_image('frame1.png'),
    await plane.load_image('frame2.png'),
    await plane.load_image('frame3.png')
];

sprite.add_animation('walk', frames, 0.1);
sprite.play('walk');
```

### 使用摄像机

```javascript
// 创建摄像机
const camera = new plane.Camera2D();
camera.smooth_enabled = true;
camera.smooth_speed = 5.0;

// 设置跟随目标
camera.set_follow_target(player);

// 添加到场景
scene.add_child(camera);
```

## 事件系统

### 内置事件

- `plane_ready` - 引擎初始化完成
- `plane_initialized` - 引擎已初始化
- `engine_started` - 引擎启动
- `engine_initialized` - 引擎初始化
- `process_frame` - 每帧处理
- `physics_frame` - 物理帧
- `quit_request` - 退出请求

### 使用事件

```javascript
// 监听事件
global_events.connect('plane_ready', () => {
    console.log('引擎已就绪');
});

// 发送事件
global_events.emit('custom_event', data);

// 一次性监听
global_events.connect_once('plane_ready', () => {
    console.log('只会执行一次');
});
```

## 许可证

MIT License
