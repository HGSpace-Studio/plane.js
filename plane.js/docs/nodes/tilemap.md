# TileMap

瓦片地图节点，用于显示基于图块的地图。

**继承：** `Node` → `Node2D` → `TileMap`

## 构造函数

```javascript
const tilemap = new plane.TileMap();
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tile_set` | `TileSet` | `null` | 瓦片集 |
| `cell_size` | `Vector2` | `(32,32)` | 单元格大小 |
| `cell_origin` | `Vector2` | `(0,0)` | 单元格原点 |
| `tile_size` | `Vector2` | `(32,32)` | 瓦片大小 |

## TileSet 类

瓦片集定义了瓦片的纹理和布局。

```javascript
const tileset = new plane.TileSet();
const texture = await plane.load_image('tiles.png');
tileset.texture = texture;
tileset.tile_size = new plane.Vector2(32, 32);
tileset.set_tile_count(16);  // 设置瓦片数量
```

**属性：**
- `texture` (`Image`) - 瓦片集纹理
- `tile_size` (`Vector2`) - 单个瓦片大小
- `tile_origin` (`Vector2`) - 瓦片原点

**方法：**
- `set_tile_count(count)` - 设置瓦片总数
- `get_tile_count()` - 获取瓦片总数
- `get_tile_texture_region(tile_id)` - 获取瓦片在纹理中的区域
- `has_tile(tile_id)` - 检查瓦片是否存在

**常量：**
- `TileSet.FLIP_X` - 水平翻转标志
- `TileSet.FLIP_Y` - 垂直翻转标志
- `TileSet.TRANSPOSE` - 转置标志

## TileMap 方法

### add_layer()

添加图层。

```javascript
tilemap.add_layer();
```

### remove_layer(index)

移除图层。

```javascript
tilemap.remove_layer(0);
```

### set_cell(layer_id, x, y, tile_id, flip_h, flip_v, transpose)

设置单元格。

**参数：**
- `layer_id` (`number`) - 图层索引
- `x` (`number`) - 单元格 X 坐标
- `y` (`number`) - 单元格 Y 坐标
- `tile_id` (`number`) - 瓦片 ID
- `flip_h` (`boolean`, 默认 `false`) - 水平翻转
- `flip_v` (`boolean`, 默认 `false`) - 垂直翻转
- `transpose` (`boolean`, 默认 `false`) - 转置

```javascript
// 在图层 0 的 (5, 3) 位置放置瓦片 2
tilemap.set_cell(0, 5, 3, 2);

// 翻转瓦片
tilemap.set_cell(0, 6, 3, 2, true, false);
```

### get_cell(layer_id, x, y)

获取单元格数据。

```javascript
const cell = tilemap.get_cell(0, 5, 3);
if (cell) {
    console.log('瓦片 ID:', cell.tile_id);
}
```

### clear_cell(layer_id, x, y)

清除单元格。

```javascript
tilemap.clear_cell(0, 5, 3);
```

### get_layer_count()

获取图层数量。

```javascript
const layers = tilemap.get_layer_count();
```

## 示例

```javascript
// 创建瓦片集
const tileset = new plane.TileSet();
const texture = await plane.load_image('tiles.png');
tileset.texture = texture;
tileset.tile_size = new plane.Vector2(16, 16);
tileset.set_tile_count(64);

// 创建瓦片地图
const tilemap = new plane.TileMap();
tilemap.tile_set = tileset;
tilemap.cell_size = new plane.Vector2(16, 16);

// 添加图层
tilemap.add_layer();  // 地面层
tilemap.add_layer();  // 装饰层

// 绘制地面
for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 15; y++) {
        tilemap.set_cell(0, x, y, 0);  // 瓦片 0 是地面
    }
}

// 绘制墙壁
for (let x = 0; x < 20; x++) {
    tilemap.set_cell(1, x, 0, 1);      // 上墙
    tilemap.set_cell(1, x, 14, 1);     // 下墙
}
for (let y = 0; y < 15; y++) {
    tilemap.set_cell(1, 0, y, 1);      // 左墙
    tilemap.set_cell(1, 19, y, 1);     // 右墙
}

scene.add_child(tilemap);
```

## 坐标系

- 单元格坐标：`(x, y)` 表示第 x 列，第 y 行
- 世界坐标：`cell_position * cell_size + cell_origin`
