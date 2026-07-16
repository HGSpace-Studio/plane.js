# AudioManager

音频管理器，负责播放音效和音乐。

## 获取实例

```javascript
const audio = plane.AudioManager.get_singleton();
```

## 方法

### play_sound(path, volume, loop)

播放音效。

**参数：**
- `path` (`string`) - 音频文件路径
- `volume` (`number`, 默认 `1.0`) - 音量 (0.0 - 1.0)
- `loop` (`boolean`, 默认 `false`) - 是否循环

**返回：** `AudioBufferSourceNode`

```javascript
const sound = audio.play_sound('sounds/explosion.mp3', 0.8, false);
```

### play_music(path, volume, loop)

播放背景音乐。

**参数：**
- `path` (`string`) - 音频文件路径
- `volume` (`number`, 默认 `1.0`) - 音量
- `loop` (`boolean`, 默认 `true`) - 是否循环

**返回：** `AudioBufferSourceNode`

```javascript
const music = audio.play_music('music/bgm.mp3', 0.5, true);
```

### stop_sound(source)

停止音效。

**参数：**
- `source` (`AudioBufferSourceNode`) - 要停止的音频源

```javascript
audio.stop_sound(sound);
```

### stop_all_sounds()

停止所有音效。

```javascript
audio.stop_all_sounds();
```

### stop_all_music()

停止所有音乐。

```javascript
audio.stop_all_music();
```

### set_listener_position(position)

设置听者位置（用于 3D 音效）。

**参数：**
- `position` (`Vector2`) - 听者位置

```javascript
audio.set_listener_position(camera.position);
```

### get_listener_position()

获取听者位置。

**返回：** `Vector2`

## 通过 plane 对象播放

```javascript
// 播放音效
const sound = plane.play_sound('sounds/click.mp3', 1.0, false);

// 停止音效
plane.stop_sound(sound);

// 停止所有音效
plane.stop_all_sounds();
```

## 示例

```javascript
class Game extends plane.Node2D {
    _ready() {
        // 播放背景音乐
        this.bgm = plane.AudioManager.get_singleton().play_music(
            'music/bgm.mp3',
            0.5,
            true
        );
    }
    
    on_player_shoot() {
        // 播放射击音效
        plane.AudioManager.get_singleton().play_sound(
            'sounds/shoot.mp3',
            0.7,
            false
        );
    }
    
    on_player_jump() {
        // 使用 plane 对象播放
        plane.play_sound('sounds/jump.mp3', 0.6, false);
    }
    
    on_game_over() {
        // 停止背景音乐
        plane.AudioManager.get_singleton().stop_all_music();
        
        // 播放结束音效
        plane.play_sound('sounds/gameover.mp3', 1.0, false);
    }
}
```

## 支持的音频格式

- MP3
- WAV
- OGG

## 注意事项

- 音频文件会被缓存，重复加载不会重新下载
- 音效和音乐使用不同的通道管理
- 音量范围是 0.0（静音）到 1.0（最大音量）
- 循环播放的音乐会一直播放直到手动停止
