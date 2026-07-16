# ProgressBar

进度条控件，用于显示进度。

**继承：** `Node` → `Node2D` → `Control` → `ProgressBar`

## 构造函数

```javascript
const progress = new plane.ProgressBar();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `min_value` | `number` | `0` | 最小值 |
| `max_value` | `number` | `100` | 最大值 |
| `value` | `number` | `0` | 当前值 |
| `step` | `number` | `1` | 步长 |
| `percent_visible` | `boolean` | `true` | 是否显示百分比 |
| `show_percentage` | `boolean` | `true` | 是否显示百分比文本 |

## 方法

### get_as_ratio()

获取当前值与最大值的比率。

**返回：** `number` (0-1)

```javascript
const ratio = progress.get_as_ratio();
console.log(ratio);  // 0.5 表示 50%
```

### set_as_ratio(ratio)

设置比率。

**参数：**
- `ratio` (`number`) - 比率 (0-1)

```javascript
progress.set_as_ratio(0.75);  // 设置为 75%
```

### get_percentage()

获取百分比。

**返回：** `number`

```javascript
const percent = progress.get_percentage();
console.log(percent);  // 75
```

## 信号

### value_changed(value)

值改变时触发。

```javascript
progress.connect("value_changed", (value) => {
    console.log("进度:", value);
});
```

## 示例

```javascript
// 创建进度条
const health_bar = new plane.ProgressBar();
health_bar.rect_position = new plane.Vector2(100, 50);
health_bar.rect_size = new plane.Vector2(200, 20);
health_bar.min_value = 0;
health_bar.max_value = 100;
health_bar.value = 100;

scene.add_child(health_bar);

// 更新生命值
function take_damage(amount) {
    health_bar.value -= amount;
    if (health_bar.value < 0) {
        health_bar.value = 0;
    }
}

function heal(amount) {
    health_bar.value += amount;
    if (health_bar.value > health_bar.max_value) {
        health_bar.value = health_bar.max_value;
    }
}

// 加载进度条
const loading_bar = new plane.ProgressBar();
loading_bar.rect_position = new plane.Vector2(200, 300);
loading_bar.rect_size = new plane.Vector2(400, 30);
loading_bar.min_value = 0;
loading_bar.max_value = 1;
loading_bar.value = 0;
loading_bar.percent_visible = false;

scene.add_child(loading_bar);

// 更新加载进度
let load_progress = 0;
loading_bar._process = function(delta) {
    load_progress += delta * 0.1;  // 每秒加载 10%
    if (load_progress > 1) {
        load_progress = 1;
    }
    this.value = load_progress;
};

// 使用比率设置
const xp_bar = new plane.ProgressBar();
xp_bar.rect_position = new plane.Vector2(100, 100);
xp_bar.rect_size = new plane.Vector2(300, 25);
xp_bar.min_value = 0;
xp_bar.max_value = 1000;
xp_bar.value = 0;

scene.add_child(xp_bar);

// 设置经验值
function set_xp(current, max) {
    xp_bar.max_value = max;
    xp_bar.value = current;
    // 或者使用比率
    // xp_bar.set_as_ratio(current / max);
}

set_xp(500, 1000);  // 50%
```

## 自定义样式

```javascript
const styled_bar = new plane.ProgressBar();
styled_bar.rect_position = new plane.Vector2(100, 200);
styled_bar.rect_size = new plane.Vector2(300, 30);

// 设置背景颜色
styled_bar.add_stylebox_override("background", (() => {
    const style = new plane.StyleBoxFlat();
    style.bg_color = new plane.Color(0.2, 0.2, 0.2);
    style.corner_radius_top_left = 5;
    style.corner_radius_top_right = 5;
    style.corner_radius_bottom_left = 5;
    style.corner_radius_bottom_right = 5;
    return style;
})());

// 设置填充颜色
styled_bar.add_stylebox_override("fill", (() => {
    const style = new plane.StyleBoxFlat();
    style.bg_color = new plane.Color(0, 0.8, 0);
    style.corner_radius_top_left = 5;
    style.corner_radius_top_right = 5;
    style.corner_radius_bottom_left = 5;
    style.corner_radius_bottom_right = 5;
    return style;
})());

scene.add_child(styled_bar);
```

## 注意事项

- ProgressBar 的值会自动限制在 min_value 和 max_value 之间
- percent_visible 控制是否显示百分比文本
- 可以使用 set_as_ratio 直接设置 0-1 的比率
- 进度条会自动插值显示平滑的进度变化
