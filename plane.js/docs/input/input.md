# Input

输入管理器，处理键盘、鼠标和触摸输入。

## 获取实例

```javascript
const input = plane.Input.get_singleton();
// 或者
const input = plane.Input;
```

## 键盘输入

### is_key_pressed(keycode)

检查按键是否被按下。

**参数：**
- `keycode` (`string`) - 按键代码

**返回：** `boolean`

```javascript
if (plane.Input.is_key_pressed('KeyW')) {
    player.move_up();
}
```

### is_key_just_pressed(keycode)

检查按键是否刚刚被按下（本帧）。

```javascript
if (plane.Input.is_key_just_pressed('Space')) {
    player.jump();
}
```

### is_key_just_released(keycode)

检查按键是否刚刚被释放（本帧）。

```javascript
if (plane.Input.is_key_just_released('KeyE')) {
    player.interact();
}
```

## 鼠标输入

### get_mouse_position()

获取鼠标位置。

**返回：** `Vector2` - 屏幕坐标

```javascript
const mouse_pos = plane.Input.get_mouse_position();
```

### is_mouse_button_pressed(button)

检查鼠标按钮是否被按下。

**参数：**
- `button` (`number`) - 按钮代码（0=左键，1=中键，2=右键）

**返回：** `boolean`

```javascript
if (plane.Input.is_mouse_button_pressed(0)) {
    console.log('左键按下');
}
```

### is_mouse_button_just_pressed(button)

检查鼠标按钮是否刚刚被按下。

```javascript
if (plane.Input.is_mouse_button_just_pressed(2)) {
    console.log('右键刚被按下');
}
```

### is_mouse_button_just_released(button)

检查鼠标按钮是否刚刚被释放。

```javascript
if (plane.Input.is_mouse_button_just_released(0)) {
    console.log('左键刚被释放');
}
```

## 触摸输入

### is_touching()

检查是否有触摸。

**返回：** `boolean`

```javascript
if (plane.Input.is_touching()) {
    const touch_pos = plane.Input.get_touch_position(0);
    player.move_to(touch_pos);
}
```

### get_touch_position(index)

获取触摸位置。

**参数：**
- `index` (`number`, 默认 `0`) - 触摸点索引

**返回：** `Vector2`

```javascript
const touch1 = plane.Input.get_touch_position(0);
const touch2 = plane.Input.get_touch_position(1);
```

## 输入动作

输入动作允许你定义逻辑输入（如 "jump"、"fire"），并映射到多个物理按键。

### add_action(name, keys)

添加输入动作。

**参数：**
- `name` (`string`) - 动作名称
- `keys` (`string[]`) - 按键代码数组

```javascript
plane.Input.add_action('jump', ['Space', 'KeyW', 'ArrowUp']);
plane.Input.add_action('fire', ['KeyJ', 'Mouse0']);
```

### is_action_pressed(action)

检查动作是否被按下。

```javascript
if (plane.Input.is_action_pressed('jump')) {
    player.jump();
}
```

### is_action_just_pressed(action)

检查动作是否刚刚被按下。

```javascript
if (plane.Input.is_action_just_pressed('fire')) {
    player.shoot();
}
```

### is_action_just_released(action)

检查动作是否刚刚被释放。

```javascript
if (plane.Input.is_action_just_released('fire')) {
    player.stop_shooting();
}
```

## 常用按键代码

### 字母键
- `KeyA` - `KeyZ`

### 数字键
- `Digit0` - `Digit9`

### 方向键
- `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`

### 功能键
- `Space` - 空格
- `Enter` - 回车
- `Escape` - ESC
- `Tab` - Tab
- `Backspace` - 退格
- `ShiftLeft`, `ShiftRight` - Shift
- `ControlLeft`, `ControlRight` - Ctrl
- `AltLeft`, `AltRight` - Alt

### 鼠标按钮
- `Mouse0` - 左键
- `Mouse1` - 中键
- `Mouse2` - 右键

## 完整示例

```javascript
// 初始化输入动作
plane.Input.add_action('move_left', ['KeyA', 'ArrowLeft']);
plane.Input.add_action('move_right', ['KeyD', 'ArrowRight']);
plane.Input.add_action('move_up', ['KeyW', 'ArrowUp']);
plane.Input.add_action('move_down', ['KeyS', 'ArrowDown']);
plane.Input.add_action('jump', ['Space']);
plane.Input.add_action('fire', ['KeyJ', 'Mouse0']);

class Player extends plane.Node2D {
    _process(dt) {
        // 移动
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
        
        // 跳跃
        if (plane.Input.is_action_just_pressed('jump')) {
            this.jump();
        }
        
        // 射击
        if (plane.Input.is_action_just_pressed('fire')) {
            const mouse_pos = plane.Input.get_mouse_position();
            this.shoot_towards(mouse_pos);
        }
    }
    
    jump() {
        console.log('Jump!');
    }
    
    shoot_towards(target) {
        const direction = target.subtract(this.position).normalized();
        console.log('Shoot towards:', direction);
    }
}
```

## 注意事项

- 按键代码使用 KeyboardEvent.code 格式
- 鼠标按钮代码：0=左键，1=中键，2=右键
- 触摸输入在移动设备上可用
- 输入动作可以映射多个按键，提高可访问性
