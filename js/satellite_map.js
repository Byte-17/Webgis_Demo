mapboxgl.accessToken = 'pk.eyJ1Ijoic3VuaGhoIiwiYSI6ImNrOHYydDcxaDA2Y2QzZ3ByNHhxaHRwNnUifQ.EY5JFYPs7LPFTtv0kmBKvw';

let satelliteMap;
let ndviLayerAdded = false;

function initSatelliteMap() {
  if (satelliteMap) return Promise.resolve();

  console.log('初始化卫星地图');
  satelliteMap = new mapboxgl.Map({
    container: 'satelliteMapContainer',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [113.280637, 23.125178], // 广东省中心坐标
    zoom: 7
  });

  return new Promise(resolve => {
    satelliteMap.on('load', function() {
      console.log('卫星图加载完成');
      addChinaBoundary();
      addGuangdongBoundary();
      addNDVILayer();
      initSatelliteOptions();
      resolve();
    });
  });
}

function addChinaBoundary() {
  // 保留您原有的添加中国边界的代码
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
  // 保留您原有的添加广东省边界的代码
  satelliteMap.addSource('guangdong-boundary', {
    type: 'geojson',
    data: 'https://geo.datav.aliyun.com/areas_v3/bound/440000_full.json'
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

function addNDVILayer() {
  console.log('开始添加 NDVI 图层');
  if (ndviLayerAdded) {
    console.log('NDVI 图层已经存在，不需要重复添加');
    return;
  }

  if (!satelliteMap.isStyleLoaded()) {
    console.log('地图样式尚未加载完成，等待加载...');
    satelliteMap.once('style.load', addNDVILayer);
    return;
  }

  console.log('添加 NDVI 源');
  satelliteMap.addSource('ndvi-source', {
    type: 'raster',
    tiles: ['https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=' + mapboxgl.accessToken],
    tileSize: 256
  });

  console.log('添加 NDVI 图层');
  satelliteMap.addLayer({
    id: 'ndvi-layer',
    type: 'raster',
    source: 'ndvi-source',
    paint: {
      'raster-opacity': 0.7,
      'raster-color': [
        'interpolate',
        ['linear'],
        ['band', 1],
        0, 'rgba(255,0,0,1)',
        0.1, 'rgba(255,255,0,1)',
        0.2, 'rgba(0,255,0,1)',
        0.3, 'rgba(0,128,0,1)',
        0.4, 'rgba(0,64,0,1)'
      ]
    },
    layout: {
      visibility: 'none'
    }
  }, 'china-boundary'); // 将 NDVI 图层插入到 china-boundary 图层之前

  ndviLayerAdded = true;
  console.log('NDVI 图层添加完成');
}

function showSatelliteMap() {
  console.log('显示卫星地图');
  const satelliteMapContainer = document.getElementById('satelliteMapContainer');
  const satelliteOptions = document.getElementById('satelliteOptions');

  satelliteMapContainer.style.display = 'block';
  satelliteOptions.style.display = 'block';

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

  satelliteMapContainer.style.display = 'none';
  satelliteOptions.style.display = 'none';
}

function initSatelliteOptions() {
  console.log('初始化卫星图选项');
  document.getElementById('showBoundaries').addEventListener('change', function(e) {
    const visibility = e.target.checked ? 'visible' : 'none';
    satelliteMap.setLayoutProperty('china-boundary', 'visibility', visibility);
    satelliteMap.setLayoutProperty('guangdong-boundary', 'visibility', visibility);
  });

  document.getElementById('showNDVI').addEventListener('change', function(e) {
    if (!ndviLayerAdded) {
      console.log('NDVI 图层尚未添加，正在添加...');
      addNDVILayer();
    }
    const visibility = e.target.checked ? 'visible' : 'none';
    if (satelliteMap.getLayer('ndvi-layer')) {
      satelliteMap.setLayoutProperty('ndvi-layer', 'visibility', visibility);
      console.log('NDVI 图层可见性已更改为:', visibility);
    } else {
      console.error('NDVI 图层不存在');
    }
  });
}

// 将函数挂载到 window 对象，以便在其他地方调用
window.showSatelliteMap = showSatelliteMap;
window.hideSatelliteMap = hideSatelliteMap;