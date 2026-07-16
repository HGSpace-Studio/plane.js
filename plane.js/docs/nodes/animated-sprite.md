# AnimatedSprite

动画精灵节点，支持帧动画播放。

**继承：** `Node` → `Node2D` → `Sprite` → `AnimatedSprite`

## 构造函数

```javascript
const animSprite = new plane.AnimatedSprite();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `frames` | `Image[]` | `[]` | 动画帧数组（只读） |
| `frame_duration` | `number` | `0.1` | 每帧持续时间（秒） |
| `current_frame` | `number` | `0` | 当前帧索引（只读） |
| `playing` | `boolean` | `false` | 是否正在播放（只读） |
| `loop` | `boolean` | `true` | 是否循环播放 |
| `speed_scale` | `number` | `1` | 播放速度倍数 |
| `animation` | `string` | `""` | 当前动画名称（只读） |
| `reverse` | `boolean` | `false` | 是否反向播放 |

## 方法

### add_animation(name, frames, frame_duration)

添加动画。

**参数：**
- `name` (`string`) - 动画名称
- `frames` (`Image[]`) - 帧数组
- `frame_duration` (`number`, 默认 `0.1`) - 每帧持续时间

```javascript
const frames = [
    await plane.load_image('walk1.png'),
    await plane.load_image('walk2.png'),
    await plane.load_image('walk3.png')
];
animSprite.add_animation('walk', frames, 0.1);
```

### play(animation_name)

播放动画。

**参数：**
- `animation_name` (`string`, 可选) - 动画名称，不填则播放当前动画

```javascript
animSprite.play('walk');
```

### stop()

停止播放。

```javascript
animSprite.stop();
```

### pause()

暂停播放。

```javascript
animSprite.pause();
```

### resume()

恢复播放。

```javascript
animSprite.resume();
```

### set_frame(frame)

设置当前帧。

```javascript
animSprite.set_frame(2);
```

### get_frame_count()

获取帧数。

```javascript
const count = animSprite.get_frame_count();
```

### get_animation_names()

获取所有动画名称。

```javascript
const names = animSprite.get_animation_names();  // ['walk', 'run', 'jump']
```

### is_playing()

检查是否正在播放。

```javascript
if (animSprite.is_playing()) {
    console.log('正在播放');
}
```

## 回调

### on_frame_change

帧变化回调。

```javascript
animSprite._on_frame_change = (frame) => {
    console.log('当前帧:', frame);
};
```

### on_animation_finished

动画结束回调。

```javascript
animSprite._on_animation_finished = () => {
    console.log('动画播放完成');
};
```

## 示例

```javascript
// 创建动画精灵
const player = new plane.AnimatedSprite();

// 加载动画帧
const walkFrames = [];
for (let i = 1; i <= 4; i++) {
    walkFrames.push(await plane.load_image(`walk_${i}.png`));
}

const runFrames = [];
for (let i = 1; i <= 6; i++) {
    runFrames.push(await plane.load_image(`run_${i}.png`));
}

// 添加动画
player.add_animation('walk', walkFrames, 0.15);
player.add_animation('run', runFrames, 0.1);

// 播放动画
player.play('walk');

// 根据输入切换动画
player._process = function(dt) {
    if (plane.Input.is_action_pressed('run')) {
        if (this.animation !== 'run') {
            this.play('run');
        }
    } else if (plane.Input.is_action_pressed('move')) {
        if (this.animation !== 'walk') {
            this.play('walk');
        }
    } else {
        this.stop();
    }
};

// 监听动画完成
player._on_animation_finished = function() {
    console.log('动画完成');
};

scene.add_child(player);
```
