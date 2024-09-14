# WebGIS 演示项目

浏览网址：https://byte-17.github.io/Webgis_Demo/

## 项目描述

这是一个基于 Web 的地理信息系统（WebGIS）演示项目，展示了广东省地理标志保护产品专用标志使用企业的分布情况。项目集成了多种地图类型和数据可视化技术，为用户提供了丰富的地理信息交互体验。

## 功能特点

- 多图层展示：包括专题图层、遥感影像和行政地图
- 地理标志企业数据可视化
- 行政边界显示
- 热力图和聚类展示
- NDVI（归一化植被指数）图层
- 交互式数据探索
- 响应式设计，适配不同设备

## 技术栈

- HTML5 / CSS3 / JavaScript
- Mapbox GL JS：用于创建交互式地图
- ECharts：用于数据可视化
- OpenLayers：用于 NDVI 图层展示
- GeoTIFF.js：用于处理地理空间栅格数据

## 如何使用

1. 访问项目网址：https://byte-17.github.io/Webgis_Demo/
2. 使用图层控制面板切换不同的地图类型：
   - 专题图层：展示广东省地理标志企业分布
   - 遥感影像：查看卫星图像和行政边界
   - 行政地图：探索行政区划和企业分布
3. 在遥感影像模式下，可以选择显示或隐藏行政边界
4. 在行政地图模式下，可以切换显示企业标记、热力图或聚类视图
5. 使用鼠标或触摸屏进行地图缩放和平移操作
6. 点击地图上的标记或区域以获取更多详细信息

## 本地开发

1. 克隆仓库：
   ```
   git clone https://github.com/Byte-17/Webgis_Demo.git
   ```
2. 进入项目目录：
   ```
   cd Webgis_Demo
   ```
3. 使用本地服务器运行项目，例如 Python 的 http.server：
   ```
   python -m http.server 8000
   ```
4. 在浏览器中访问 `http://localhost:8000`

## 数据来源

- 地理标志企业数据：[数据来源链接或描述]
- 地图边界数据：阿里云数据可视化平台
- 遥感影像：Mapbox 卫星图层

## 贡献

欢迎贡献代码或提出建议！请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

