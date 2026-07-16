# AnimationPlayer

动画播放器节点，用于播放和管理动画。

**继承：** `Node` → `Node2D` → `AnimationPlayer`

## 构造函数

```javascript
const player = new plane.AnimationPlayer();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `current_animation` | `string` | `""` | 当前动画名称 |
| `speed_scale` | `number` | `1.0` | 播放速度缩放 |
| `autoplay` | `string` | `""` | 自动播放的动画名称 |

## 方法

### add_animation(name, animation)

添加动画。

**参数：**
- `name` (`string`) - 动画名称
- `animation` (`Animation`) - 动画资源

```javascript
const anim = new plane.Animation();
// ... 配置动画
player.add_animation("walk", anim);
```

### play(name, custom_blend, custom_speed, from_end)

播放动画。

**参数：**
- `name` (`string`) - 动画名称
- `custom_blend` (`number`, 可选) - 混合时间
- `custom_speed` (`number`, 可选) - 自定义速度
- `from_end` (`boolean`, 可选) - 是否从末尾开始

```javascript
player.play("walk");
player.play("jump", 0, 1.5);  // 1.5倍速播放
```

### play_backwards(name)

反向播放动画。

```javascript
player.play_backwards("walk");
```

### stop(reset)

停止播放。

**参数：**
- `reset` (`boolean`, 默认 `true`) - 是否重置到初始状态

```javascript
player.stop();
player.stop(false);  // 保持当前位置
```

### pause()

暂停播放。

```javascript
player.pause();
```

### resume()

恢复播放。

```javascript
player.resume();
```

### is_playing()

检查是否正在播放。

**返回：** `boolean`

```javascript
if (player.is_playing()) {
    console.log("正在播放动画");
}
```

### get_current_animation()

获取当前动画名称。

**返回：** `string`

```javascript
const current = player.get_current_animation();
```

### get_current_animation_length()

获取当前动画长度。

**返回：** `number`

```javascript
const length = player.get_current_animation_length();
```

### get_current_animation_position()

获取当前播放位置。

**返回：** `number`

```javascript
const pos = player.get_current_animation_position();
```

### seek(seconds, update)

跳转到指定时间。

**参数：**
- `seconds` (`number`) - 时间（秒）
- `update` (`boolean`, 默认 `true`) - 是否立即更新

```javascript
player.seek(0.5);  // 跳转到0.5秒
```

### has_animation(name)

检查是否存在指定动画。

**返回：** `boolean`

```javascript
if (player.has_animation("walk")) {
    player.play("walk");
}
```

### get_animation_list()

获取所有动画名称列表。

**返回：** `Array<string>`

```javascript
const animations = player.get_animation_list();
animations.forEach(name => {
    console.log(name);
});
```

## 信号

### animation_finished(name)

动画播放完成时触发。

```javascript
player.connect("animation_finished", (name) => {
    console.log("动画完成:", name);
});
```

### animation_changed(old_name, new_name)

动画切换时触发。

```javascript
player.connect("animation_changed", (old_name, new_name) => {
    console.log(`从 ${old_name} 切换到 ${new_name}`);
});
```

## 示例

```javascript
// 创建动画播放器
const anim_player = new plane.AnimationPlayer();

// 创建行走动画
const walk_anim = new plane.Animation();
walk_anim.length = 1.0;
walk_anim.loop = true;

const pos_track = walk_anim.add_track("position");
walk_anim.add_keyframe(pos_track, 0.0, new plane.Vector2(0, 0));
walk_anim.add_keyframe(pos_track, 0.5, new plane.Vector2(0, -10));
walk_anim.add_keyframe(pos_track, 1.0, new plane.Vector2(0, 0));

anim_player.add_animation("walk", walk_anim);

// 创建跳跃动画
const jump_anim = new plane.Animation();
jump_anim.length = 0.5;
jump_anim.loop = false;

const jump_pos_track = jump_anim.add_track("position");
jump_anim.add_keyframe(jump_pos_track, 0.0, new plane.Vector2(0, 0));
jump_anim.add_keyframe(jump_pos_track, 0.25, new plane.Vector2(0, -50));
jump_anim.add_keyframe(jump_pos_track, 0.5, new plane.Vector2(0, 0));

anim_player.add_animation("jump", jump_anim);

scene.add_child(anim_player);

// 播放动画
anim_player.play("walk");

// 监听动画完成
anim_player.connect("animation_finished", (name) => {
    if (name === "jump") {
        anim_player.play("walk");
    }
});

// 根据输入切换动画
if (plane.Input.is_action_just_pressed("jump")) {
    anim_player.play("jump");
}
```

## 注意事项

- AnimationPlayer 会自动插值关键帧之间的值
- 可以播放多个动画，并通过混合实现平滑过渡
- 使用 speed_scale 可以改变所有动画的播放速度
- autoplay 属性可以设置启动时自动播放的动画
