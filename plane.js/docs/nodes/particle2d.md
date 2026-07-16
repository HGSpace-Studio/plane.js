# Particle2D

2D 粒子系统节点，用于创建粒子效果。

**继承：** `Node` → `Node2D` → `Particle2D`

## 构造函数

```javascript
const particles = new plane.Particle2D();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `emitting` | `boolean` | `false` | 是否发射粒子 |
| `amount` | `number` | `100` | 最大粒子数 |
| `lifetime` | `number` | `1.0` | 粒子生命周期（秒） |
| `speed` | `number` | `100` | 初始速度 |
| `direction` | `number` | `-π/2` | 发射方向（弧度） |
| `gravity` | `Vector2` | `(0, 980)` | 重力 |

**发射参数：**
- `lifetime_random` (`number`) - 生命周期随机范围
- `speed_random` (`number`) - 速度随机范围
- `direction_random` (`number`) - 方向随机范围

**物理参数：**
- `radial_accel` (`number`) - 径向加速度
- `tangential_accel` (`number`) - 切向加速度
- `damping` (`number`) - 阻尼

**外观参数：**
- `angle` (`number`) - 初始角度
- `angle_random` (`number`) - 角度随机范围
- `rotate_speed` (`number`) - 旋转速度
- `scale` (`number`) - 缩放
- `texture` (`Image`) - 粒子纹理

**发射形状：**
- `emission_shape` (`number`) - 发射形状
  - `EMISSION_SHAPE_POINT` (0) - 点发射
  - `EMISSION_SHAPE_CIRCLE` (1) - 圆形发射
  - `EMISSION_SHAPE_RECTANGLE` (2) - 矩形发射
- `emission_shape_radius` (`number`) - 发射形状半径

## 方法

### start_emitting()

开始发射粒子。

```javascript
particles.start_emitting();
```

### stop_emitting()

停止发射粒子。

```javascript
particles.stop_emitting();
```

### clear()

清除所有粒子。

```javascript
particles.clear();
```

### get_active_particles()

获取活跃粒子数。

```javascript
const count = particles.get_active_particles();
```

## 示例

```javascript
// 创建火焰效果
const fire = new plane.Particle2D();
fire.emitting = true;
fire.amount = 50;
fire.lifetime = 0.8;
fire.speed = 80;
fire.direction = -Math.PI / 2;  // 向上
fire.direction_random = 0.3;
fire.gravity = new plane.Vector2(0, -50);  // 轻微向上
fire.speed_random = 20;
fire.scale = 0.5;
fire.scale_random = 0.2;

// 加载粒子纹理
fire.texture = await plane.load_image('particle.png');

fire.position = new plane.Vector2(400, 500);
scene.add_child(fire);

// 创建爆炸效果
const explosion = new plane.Particle2D();
explosion.emitting = true;
explosion.amount = 100;
explosion.lifetime = 0.5;
explosion.speed = 200;
explosion.direction_random = Math.PI * 2;  // 全方向
explosion.gravity = new plane.Vector2(0, 0);  // 无重力
explosion.emission_shape = plane.Particle2D.EMISSION_SHAPE_POINT;

explosion.position = new plane.Vector2(400, 300);
scene.add_child(explosion);

// 一次性爆炸
explosion._process = function(dt) {
    if (this.get_active_particles() === 0) {
        this.queue_free();
    }
};
```

## 发射形状

```javascript
// 圆形发射
particles.emission_shape = plane.Particle2D.EMISSION_SHAPE_CIRCLE;
particles.emission_shape_radius = 50;

// 矩形发射
particles.emission_shape = plane.Particle2D.EMISSION_SHAPE_RECTANGLE;
```

## 注意事项

- 粒子系统会自动更新和渲染
- 设置 `emitting = false` 会停止发射新粒子，但现有粒子会继续运动
- 使用 `clear()` 可以立即清除所有粒子
- 粒子纹理应该是小尺寸的图像以获得最佳性能
