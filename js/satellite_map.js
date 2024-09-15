mapboxgl.accessToken = 'pk.eyJ1Ijoic3VuaGhoIiwiYSI6ImNrOHYydDcxaDA2Y2QzZ3ByNHhxaHRwNnUifQ.EY5JFYPs7LPFTtv0kmBKvw';

let satelliteMap;
let layers = {};

function initSatelliteMap() {
  if (satelliteMap) return Promise.resolve();

  console.log('初始化卫星地图');
  satelliteMap = new mapboxgl.Map({
    container: 'satelliteMapContainer',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [80, 30],
    zoom: 3
  });

  return new Promise(resolve => {
    satelliteMap.on('load', function() {
      console.log('卫星图加载完成');
      addChinaBoundary();
      addGuangdongBoundary();
      loadStudyAreas().then(() => {
        console.log('研究区加载完成', layers);
        initSatelliteOptions();
        resolve();
      });
    });
  });
}

function addChinaBoundary() {
  satelliteMap.addSource('china-boundary', {
    type: 'geojson',
    data: 'js/china_boundary.json'
  });

  satelliteMap.addLayer({
    'id': 'china-boundary',
    'type': 'line',
    'source': 'china-boundary',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'line-color': '#ffffff',
      'line-width': 2
    }
  });
}

function addGuangdongBoundary() {
  satelliteMap.addSource('guangdong-boundary', {
    type: 'geojson',
    data: 'js/guangdong_boundary.json'
  });

  satelliteMap.addLayer({
    'id': 'guangdong-boundary',
    'type': 'line',
    'source': 'guangdong-boundary',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'line-color': '#ff0000',
      'line-width': 2
    }
  });
}

function loadStudyAreas() {
  console.log('开始加载研究区');
  const studyAreas = {
    'xinjiang': 'js/akesu_boundary.json',
    'guangdong': 'js/zhanjiang_boundary.json',
    'centralAsiaRiver': 'js/zhongya_river_boundary.json',
    'world': 'js/world.zh.json'
  };

  const promises = Object.entries(studyAreas).map(([id, url]) => {
    console.log(`开始加载 ${id} 数据，URL: ${url}`);
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`${id} 数据加载成功`, data);
        if (id === 'world') {
          layers.centralAsia = {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: data.features.find(f => f.properties.name === "哈萨克斯坦").geometry
            }
          };
          layers.turkey = {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: data.features.find(f => f.properties.name === "土耳其").geometry
            }
          };
          layers.vietnam = {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: data.features.find(f => f.properties.name === "越南").geometry
            }
          };
        } else {
          layers[id] = {
            type: 'geojson',
            data: data
          };
        }
        console.log(`${id} 数据已添加到 layers 对象`, layers[id]);
      })
      .catch(error => {
        console.error(`加载 ${id} 数据失败`, error);
      });
  });

  return Promise.all(promises);
}

function initSatelliteOptions() {
  console.log('初始化卫星图选项');
  const showBoundariesCheckbox = document.getElementById('showBoundaries');
  const showStudyAreaCheckbox = document.getElementById('showStudyArea');
  const studyAreaOptions = document.getElementById('studyAreaOptions');

  if (showBoundariesCheckbox) {
    showBoundariesCheckbox.addEventListener('change', function(e) {
      const visibility = e.target.checked ? 'visible' : 'none';
      satelliteMap.setLayoutProperty('china-boundary', 'visibility', visibility);
      satelliteMap.setLayoutProperty('guangdong-boundary', 'visibility', visibility);
      console.log(`行政边界可见性设置为: ${visibility}`);
    });
  }

  if (showStudyAreaCheckbox && studyAreaOptions) {
    showStudyAreaCheckbox.addEventListener('change', function(e) {
      studyAreaOptions.style.display = e.target.checked ? 'block' : 'none';
      console.log(`研究区选项显示状态: ${e.target.checked ? '显示' : '隐藏'}`);
    });
  }

  document.querySelectorAll('#studyAreaOptions input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function(e) {
      const id = e.target.value;
      console.log(`切换 ${id} 研究区的显示状态`);
      if (this.checked) {
        if (layers[id]) {
          console.log(`尝试添加 ${id} 图层`, layers[id]);
          if (!satelliteMap.getSource(id)) {
            console.log(`添加 ${id} 数据源`);
            satelliteMap.addSource(id, layers[id]);
          }
          if (!satelliteMap.getLayer(id)) {
            console.log(`添加 ${id} 图层`);
            satelliteMap.addLayer({
              'id': id,
              'type': 'fill',
              'source': id,
              'paint': {
                'fill-color': id === 'centralAsiaRiver' ? 'blue' : 'red',
                'fill-opacity': 0.4
              }
            });
          } else {
            console.log(`设置 ${id} 图层可见性为可见`);
            satelliteMap.setLayoutProperty(id, 'visibility', 'visible');
          }
          console.log(`缩放到 ${id} 区域`);
          fitMapToLayer(id);
        } else {
          console.error(`${id} 图层数据不存在`, layers);
        }
        if (id === 'centralAsia' && layers.centralAsiaRiver) {
          console.log('添加中亚两河流域边界');
          if (!satelliteMap.getSource('centralAsiaRiver')) {
            satelliteMap.addSource('centralAsiaRiver', layers.centralAsiaRiver);
          }
          if (!satelliteMap.getLayer('centralAsiaRiver')) {
            satelliteMap.addLayer({
              'id': 'centralAsiaRiver',
              'type': 'fill',
              'source': 'centralAsiaRiver',
              'paint': {
                'fill-color': 'blue',
                'fill-opacity': 0.2
              }
            });
          } else {
            satelliteMap.setLayoutProperty('centralAsiaRiver', 'visibility', 'visible');
          }
        }
      } else {
        console.log(`隐藏 ${id} 图层`);
        if (satelliteMap.getLayer(id)) {
          satelliteMap.setLayoutProperty(id, 'visibility', 'none');
        }
        if (id === 'centralAsia' && satelliteMap.getLayer('centralAsiaRiver')) {
          console.log('隐藏中亚两河流域边界');
          satelliteMap.setLayoutProperty('centralAsiaRiver', 'visibility', 'none');
        }
      }
    });
  });
}

function fitMapToLayer(id) {
  if (layers[id] && layers[id].data) {
    const bounds = new mapboxgl.LngLatBounds();
    const geometry = layers[id].data.geometry || layers[id].data.features[0].geometry;
    const coordinates = geometry.coordinates;
    
    // 处理多种几何类型
    if (geometry.type === 'Polygon') {
      coordinates[0].forEach(coord => bounds.extend(coord));
    } else if (geometry.type === 'MultiPolygon') {
      coordinates.forEach(polygon => {
        polygon[0].forEach(coord => bounds.extend(coord));
      });
    }

    // 为不同区域设置不同的缩放级别和填充
    let padding = { top: 20, bottom: 20, left: 20, right: 20 };
    let maxZoom = 10;

    if (id === 'turkey') {
      maxZoom = 6;  // 降低土耳其的最大缩放级别
      padding = { top: 50, bottom: 50, left: 50, right: 50 };  // 增加填充
    } else if (id === 'xinjiang') {
      maxZoom = 5;  // 为新疆设置更低的最大缩放级别
      padding = { top: 150, bottom: 150, left: 150, right: 150 };  // 增加填充
    } else if (id === 'guangdong') {
      maxZoom = 7;  // 为湛江保持原来的缩放级别
      padding = { top: 100, bottom: 100, left: 100, right: 100 };  // 增加填充
    }

    satelliteMap.fitBounds(bounds, {
      padding: padding,
      maxZoom: maxZoom,
      duration: 1000  // 添加动画效果
    });
  } else {
    console.error(`无法为 ${id} 找到有效的边界数据`);
  }
}

function showSatelliteMap() {
  console.log('显示卫星地图');
  const satelliteMapContainer = document.getElementById('satelliteMapContainer');
  const satelliteOptions = document.getElementById('satelliteOptions');

  if (satelliteMapContainer) satelliteMapContainer.style.display = 'block';
  if (satelliteOptions) satelliteOptions.style.display = 'block';

  if (!satelliteMap) {
    initSatelliteMap().then(() => {
      console.log('卫星地图初始化完成');
    });
  } else {
    satelliteMap.resize();
  }
}

function hideSatelliteMap() {
  console.log('隐藏卫星地图');
  const satelliteMapContainer = document.getElementById('satelliteMapContainer');
  const satelliteOptions = document.getElementById('satelliteOptions');

  if (satelliteMapContainer) satelliteMapContainer.style.display = 'none';
  if (satelliteOptions) satelliteOptions.style.display = 'none';
}

window.showSatelliteMap = showSatelliteMap;
window.hideSatelliteMap = hideSatelliteMap;