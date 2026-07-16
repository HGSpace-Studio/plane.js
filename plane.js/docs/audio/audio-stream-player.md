# AudioStreamPlayer

音频流播放器节点，用于在场景中播放音频。

**继承：** `Node` → `AudioStreamPlayer`

## 构造函数

```javascript
const audio = new plane.AudioStreamPlayer();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `stream` | `string` | `null` | 音频文件路径 |
| `volume_db` | `number` | `0` | 音量（分贝） |
| `pitch_scale` | `number` | `1.0` | 音高缩放 |
| `autoplay` | `boolean` | `false` | 是否自动播放 |
| `playing` | `boolean` | `false` | 是否正在播放（只读） |

## 方法

### play()

开始播放。

```javascript
audio.play();
```

### stop()

停止播放。

```javascript
audio.stop();
```

### pause()

暂停播放。

```javascript
audio.pause();
```

### resume()

恢复播放。

```javascript
audio.resume();
```

## 示例

```javascript
// 创建音频播放器
const bgm = new plane.AudioStreamPlayer();
bgm.stream = 'music/bgm.mp3';
bgm.volume_db = -10;  // 降低 10 分贝
bgm.autoplay = true;  // 自动播放

scene.add_child(bgm);

// 控制播放
bgm.stop();
bgm.play();

// 音效播放器
const sfx_player = new plane.AudioStreamPlayer();
sfx_player.stream = 'sounds/explosion.mp3';
sfx_player.pitch_scale = 1.2;  // 提高音高

scene.add_child(sfx_player);
sfx_player.play();
```

## 注意事项

- `autoplay` 为 true 时，节点进入场景树后会自动播放
- `volume_db` 使用分贝单位，0 为原始音量，负值降低音量
- `pitch_scale` 可以改变音高，1.0 为原始速度
