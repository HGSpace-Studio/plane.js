# Animation

动画资源类，用于定义动画数据。

## 构造函数

```javascript
const animation = new plane.Animation();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `length` | `number` | `1.0` | 动画长度（秒） |
| `loop` | `boolean` | `false` | 是否循环 |
| `step` | `number` | `0.1` | 步长 |

## 方法

### add_track(path)

添加动画轨道。

**参数：**
- `path` (`string`) - 属性路径，如 "position" 或 "modulate"

**返回：** `number` - 轨道索引

```javascript
const pos_track = animation.add_track("position");
const rot_track = animation.add_track("rotation");
```

### add_keyframe(track_idx, time, value)

添加关键帧。

**参数：**
- `track_idx` (`number`) - 轨道索引
- `time` (`number`) - 时间（秒）
- `value` (`any`) - 关键帧值

```javascript
// 位置动画
animation.add_keyframe(0, 0.0, new plane.Vector2(0, 0));
animation.add_keyframe(0, 1.0, new plane.Vector2(100, 0));

// 旋转动画
animation.add_keyframe(1, 0.0, 0);
animation.add_keyframe(1, 1.0, Math.PI * 2);
```

### get_track_count()

获取轨道数量。

**返回：** `number`

```javascript
const count = animation.get_track_count();
```

### remove_track(track_idx)

移除轨道。

**参数：**
- `track_idx` (`number`) - 轨道索引

```javascript
animation.remove_track(0);
```

## 示例

```javascript
// 创建移动动画
const move_anim = new plane.Animation();
move_anim.length = 2.0;
move_anim.loop = true;

// 添加位置轨道
const pos_track = move_anim.add_track("position");
move_anim.add_keyframe(pos_track, 0.0, new plane.Vector2(0, 0));
move_anim.add_keyframe(pos_track, 1.0, new plane.Vector2(100, 0));
move_anim.add_keyframe(pos_track, 2.0, new plane.Vector2(0, 0));

// 创建旋转动画
const rotate_anim = new plane.Animation();
rotate_anim.length = 1.0;
rotate_anim.loop = true;

const rot_track = rotate_anim.add_track("rotation");
rotate_anim.add_keyframe(rot_track, 0.0, 0);
rotate_anim.add_keyframe(rot_track, 1.0, Math.PI * 2);
```

## 注意事项

- Animation 是资源类，不包含播放逻辑
- 使用 AnimationPlayer 来播放动画
- 关键帧之间会自动插值
- 支持 Vector2、Color、number 等类型的插值
