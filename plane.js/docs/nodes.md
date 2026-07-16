# 节点类型 API 文档

## Node2D 类

继承自 `Node`。2D 节点基类，支持位置、旋转、缩放。

### 构造函数

```javascript
const node = new plane.Node2D();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `position` | `Vector2` | `(0, 0)` | 本地位置 |
| `rotation` | `number` | `0` | 本地旋转（弧度） |
| `scale` | `Vector2` | `(1, 1)` | 本地缩放 |
| `z_index` | `number` | `0` | Z 轴排序 |
| `visible` | `boolean` | `true` | 是否可见 |
| `global_position` | `Vector2` | 只读 | 全局位置 |
| `global_rotation` | `number` | 只读 | 全局旋转 |
| `global_scale` | `Vector2` | 只读 | 全局缩放 |

### 方法

#### 变换操作

```javascript
// 旋转
node.rotate(Math.PI / 4);

// 缩放
node.scale_by(new plane.Vector2(2, 2));

// 平移
node.translate(new plane.Vector2(10, 0));

// 朝向目标
node.look_at(new plane.Vector2(100, 200));
node.look_at_position(new plane.Vector2(100, 200));
```

#### 查询

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `get_angle_to(target)` | `number` | 到目标的角度 |
| `get_distance_to(target)` | `number` | 到目标的距离 |
| `is_position_inside(rect)` | `boolean` | 位置是否在矩形内 |

#### 物理移动

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `move_and_slide(velocity, floor_normal?)` | `Vector2` | 移动并滑动 |
| `move_and_collide(motion)` | `null` | 移动并碰撞 |

#### 绘制

| 方法 | 说明 |
|------|------|
| `draw(ctx, transform)` | 绘制（子类重写） |
| `_draw()` | 自定义绘制（子类重写） |

---

## Sprite 类

继承自 `Node2D`。显示纹理图。

### 构造函数

```javascript
const sprite = new plane.Sprite();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `texture` | `Image` | `null` | 纹理图片 |
| `rect` | `Rect2` | `Rect2()` | 显示区域 |
| `flip_h` | `boolean` | `false` | 水平翻转 |
| `flip_v` | `boolean` | `false` | 垂直翻转 |
| `centered` | `boolean` | `true` | 是否居中显示 |
| `offset` | `Vector2` | `(0, 0)` | 偏移 |
| `modulate` | `Color` | `(1,1,1,1)` | 颜色调制 |

### 示例

```javascript
const sprite = new plane.Sprite();
sprite.texture = await plane.load_image("assets/player.png");
sprite.position = new plane.Vector2(100, 100);
sprite.flip_h = true;
sprite.modulate = new plane.Color(1, 0.5, 0.5, 1); // 偏红
root.add_child(sprite);
```

---

## AnimatedSprite 类

继承自 `Sprite`。帧动画播放。

### 构造函数

```javascript
const anim = new plane.AnimatedSprite();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `frames` | `Image[]` | `[]` | 只读，帧列表 |
| `frame_duration` | `number` | `0.1` | 每帧持续时间（秒） |
| `current_frame` | `number` | `0` | 只读，当前帧索引 |
| `playing` | `boolean` | `false` | 只读，是否播放中 |
| `loop` | `boolean` | `true` | 是否循环 |
| `speed_scale` | `number` | `1` | 播放速度倍率 |
| `animation` | `string` | `""` | 只读，当前动画名 |
| `reverse` | `boolean` | `false` | 是否反向播放 |

### 方法

#### `add_animation(name, frames, frame_duration?)`
添加动画。

```javascript
anim.add_animation("walk", [frame1, frame2, frame3], 0.15);
anim.add_animation("idle", [frame1], 0.5);
```

#### `play(animation_name?)`
播放动画。

```javascript
anim.play("walk");
```

#### `stop()` / `pause()` / `resume()`
停止 / 暂停 / 恢复。

#### `set_frame(frame)`
设置当前帧。

#### `get_frame_count()` → `number`
获取帧数。

#### `get_animation_names()` → `string[]`
获取所有动画名。

#### `is_playing()` → `boolean`
是否正在播放。

### 回调

```javascript
anim._on_frame_change = (frame) => {
    console.log("帧切换:", frame);
};
anim._on_animation_finished = () => {
    console.log("动画结束");
};
```

---

## Label 类

继承自 `Node2D`。文本标签。

### 构造函数

```javascript
const label = new plane.Label();
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | `string` | `""` | 文本内容 |
| `font_size` | `number` | `16` | 字号 |
| `font_family` | `string` | `"sans-serif"` | 字体 |
| `color` | `Color` | 白色 | 文字颜色 |
| `centered` | `boolean` | `false` | 是否居中 |
| `autowrap` | `boolean` | `false` | 自动换行 |
| `align` | `number` | `0` | 水平对齐 |
| `valign` | `number` | `0` | 垂直对齐 |
| `outline_color` | `Color` | 透明 | 描边颜色 |
| `outline_size` | `number` | `0` | 描边大小 |
| `shadow_color` | `Color` | 透明 | 阴影颜色 |
| `shadow_offset` | `Vector2` | `(2, 2)` | 阴影偏移 |
| `bold` | `boolean` | `false` | 粗体 |
| `italic` | `boolean` | `false` | 斜体 |

### 示例

```javascript
const label = new plane.Label();
label.text = "Hello plane.js!";
label.font_size = 24;
label.color = plane.Color.YELLOW;
label.bold = true;
label.position = new plane.Vector2(100, 50);
root.add_child(label);
```

---

## ColorRect 类

继承自 `Node2D`。纯色矩形。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `color` | `Color` | 白色 | 填充颜色 |
| `rect` | `Rect2` | `(0,0,100,100)` | 矩形区域 |
| `draw_center` | `boolean` | `false` | 是否居中绘制 |

### 示例

```javascript
const rect = new plane.ColorRect();
rect.color = plane.Color.RED;
rect.rect = new plane.Rect2(0, 0, 200, 100);
rect.position = new plane.Vector2(50, 50);
root.add_child(rect);
```

---

## TextureRect 类

继承自 `Node2D`。纹理矩形。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `texture` | `Image` | `null` | 纹理 |
| `rect` | `Rect2` | `(0,0,100,100)` | 显示区域 |
| `flip_h` | `boolean` | `false` | 水平翻转 |
| `flip_v` | `boolean` | `false` | 垂直翻转 |
| `tile_mode` | `number` | `0` | 平铺模式 |
| `stretch_mode` | `number` | `0` | 拉伸模式 |
| `modulate` | `Color` | 白色 | 颜色调制 |

---

## Container 类

继承自 `Node2D`。容器节点。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `alignment` | `number` | `0` | 对齐方式 |
| `custom_minimum_size` | `Vector2` | `(0, 0)` | 最小尺寸 |
| `rect` | `Rect2` | `(0,0,200,200)` | 容器区域 |
| `fit_content` | `boolean` | `false` | 自适应内容 |

### VBoxContainer

垂直布局容器。

```javascript
const vbox = new plane.VBoxContainer();
vbox.spacing = 8;
vbox.fit_content = true;
vbox.add_child(button1);
vbox.add_child(button2);
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `spacing` | `number` | `4` | 子元素间距 |

### HBoxContainer

水平布局容器。

```javascript
const hbox = new plane.HBoxContainer();
hbox.spacing = 8;
hbox.add_child(label1);
hbox.add_child(label2);
```

---

## TileMap / TileSet 类

### TileSet 类

瓦片集，定义瓦片纹理和大小。

```javascript
const tileset = new plane.TileSet();
tileset.texture = myImage;
tileset.tile_size = new plane.Vector2(32, 32);
tileset.set_tile_count(16);
```

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| `texture` | `Image` | 瓦片纹理图集 |
| `tile_size` | `Vector2` | 单个瓦片大小 |
| `tile_origin` | `Vector2` | 瓦片原点 |
| `get_tile_texture_region(tile_id)` | `Rect2` | 获取瓦片在图集中的区域 |
| `has_tile(tile_id)` | `boolean` | 是否存在该瓦片 |
| `set_tile_count(count)` | - | 设置瓦片总数 |
| `get_tile_count()` | `number` | 获取瓦片总数 |

### TileMap 类

继承自 `Node2D`。瓦片地图。

```javascript
const tilemap = new plane.TileMap();
tilemap.tile_set = tileset;
tilemap.cell_size = new plane.Vector2(32, 32);

// 添加图层
tilemap.add_layer();

// 设置瓦片
tilemap.set_cell(0, 5, 3, 1); // 图层0, x=5, y=3, tile_id=1

// 获取瓦片
const cell = tilemap.get_cell(0, 5, 3);
```

| 方法 | 说明 |
|------|------|
| `add_layer()` | 添加图层 |
| `remove_layer(index)` | 移除图层 |
| `set_cell(layer_id, x, y, tile_id, flip_h?, flip_v?, transpose?)` | 设置瓦片 |
| `get_cell(layer_id, x, y)` | 获取瓦片数据 |
| `clear_cell(layer_id, x, y)` | 清除瓦片 |
| `get_layer_count()` → `number` | 获取图层数 |

---

## Particle2D 类

继承自 `Node2D`。粒子系统。

### 静态常量

| 常量 | 值 | 说明 |
|------|------|------|
| `EMISSION_SHAPE_POINT` | `0` | 点发射 |
| `EMISSION_SHAPE_CIRCLE` | `1` | 圆形发射 |
| `EMISSION_SHAPE_RECTANGLE` | `2` | 矩形发射 |

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `emitting` | `boolean` | `false` | 是否发射 |
| `amount` | `number` | `100` | 最大粒子数 |
| `lifetime` | `number` | `1.0` | 粒子寿命（秒） |
| `speed` | `number` | `100` | 初始速度 |
| `direction` | `number` | `-PI/2` | 发射方向（弧度） |
| `gravity` | `Vector2` | `(0, 980)` | 重力 |

### 方法

```javascript
const particles = new plane.Particle2D();
particles.emitting = true;
particles.amount = 200;
particles.lifetime = 2.0;
particles.speed = 150;
particles.gravity = new plane.Vector2(0, 500);
root.add_child(particles);
```

| 方法 | 说明 |
|------|------|
| `start_emitting()` | 开始发射 |
| `stop_emitting()` | 停止发射 |
| `clear()` | 清除所有粒子 |
| `get_active_particles()` → `number` | 获取活跃粒子数 |
