mapboxgl.accessToken = 'pk.eyJ1Ijoic3VuaGhoIiwiYSI6ImNrOHYydDcxaDA2Y2QzZ3ByNHhxaHRwNnUifQ.EY5JFYPs7LPFTtv0kmBKvw';

let administrativeMap;
let enterprisesData;

function initAdministrativeMap() {
  if (administrativeMap) return;

  administrativeMap = new mapboxgl.Map({
    container: 'administrativeMapContainer',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [113.280637, 23.125178], // 广东省中心坐标
    zoom: 7
  });

  administrativeMap.on('load', function() {
    console.log('行政区划图加载完成');
    addAdministrativeBoundaries();
    loadEnterprises();
  });
}

function addAdministrativeBoundaries() {
  administrativeMap.addSource('guangdong-boundary', {
    type: 'geojson',
    data: 'js/guangdong_boundary.json'
  });

  administrativeMap.addLayer({
    id: 'guangdong-boundary-fill',
    type: 'fill',
    source: 'guangdong-boundary',
    paint: {
      'fill-color': 'rgba(200, 200, 200, 0.1)',
      'fill-outline-color': 'rgba(0, 0, 0, 1)'
    }
  });

  administrativeMap.addLayer({
    id: 'guangdong-boundary-line',
    type: 'line',
    source: 'guangdong-boundary',
    paint: {
      'line-color': '#36739c',
      'line-width': 2
    }
  });
}

function loadEnterprises() {
  fetch('js/enterprises_data.json')
    .then(response => response.json())
    .then(data => {
      enterprisesData = data;
      addEnterprisesSource();
      addClusterSource();
      addEnterprisesLayer();
      addHeatmapLayer();
      addClustersLayer();
      initAdministrativeOptions();
    })
    .catch(error => console.error('加载企业数据失败:', error));
}

function addEnterprisesSource() {
  administrativeMap.addSource('enterprises', {
    type: 'geojson',
    data: enterprisesData
  });
}

function addClusterSource() {
  administrativeMap.addSource('enterprises-cluster', {
    type: 'geojson',
    data: enterprisesData,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });
}

function addEnterprisesLayer() {
  // 单个点图层
  administrativeMap.addLayer({
    id: 'unclustered-points',
    type: 'circle',
    source: 'enterprises',
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 6,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  // 点标签图层
  administrativeMap.addLayer({
    id: 'unclustered-point-labels',
    type: 'symbol',
    source: 'enterprises',
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 1.25],
      'text-anchor': 'top',
      'text-size': 12
    },
    paint: {
      'text-color': '#000',
      'text-halo-color': '#fff',
      'text-halo-width': 1
    }
  });

  administrativeMap.on('click', 'unclustered-points', function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var properties = e.features[0].properties;

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`<h3>${properties.name}</h3><p>类型: ${properties.type}</p>`)
      .addTo(administrativeMap);
  });
}

function addHeatmapLayer() {
  administrativeMap.addLayer({
    id: 'heatmap',
    type: 'heatmap',
    source: 'enterprises',
    paint: {
      // 增加权重以使热点更加明显
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'mag'],
        0, 0,
        6, 1
      ],
      // 增加强度以扩大热力图范围
      'heatmap-intensity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0, 1,
        9, 3
      ],
      // 调整颜色渐变以更好地显示密度
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(33,102,172,0)',
        0.2, 'rgb(103,169,207)',
        0.4, 'rgb(209,229,240)',
        0.6, 'rgb(253,219,199)',
        0.8, 'rgb(239,138,98)',
        1, 'rgb(178,24,43)'
      ],
      // 显著增加半径以扩大热力图范围
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0, 10,
        9, 50
      ],
      // 稍微降低不透明度以平衡更大的范围
      'heatmap-opacity': 0.6
    }
  }, 'waterway-label');
}

function addClustersLayer() {
  // 聚类圆圈图层
  administrativeMap.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'enterprises-cluster',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    }
  });

  // 聚类数量标签图层
  administrativeMap.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'enterprises-cluster',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  // 聚类点击事件
  administrativeMap.on('click', 'clusters', function(e) {
    var features = administrativeMap.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    var clusterId = features[0].properties.cluster_id;
    administrativeMap.getSource('enterprises-cluster').getClusterExpansionZoom(clusterId, function(err, zoom) {
      if (err) return;

      administrativeMap.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      });
    });
  });

  administrativeMap.on('mouseenter', 'clusters', function() {
    administrativeMap.getCanvas().style.cursor = 'pointer';
  });

  administrativeMap.on('mouseleave', 'clusters', function() {
    administrativeMap.getCanvas().style.cursor = '';
  });
}

function initAdministrativeOptions() {
  document.getElementById('showEnterprises').checked = true;
  document.getElementById('showHeatmap').checked = false;
  document.getElementById('showCluster').checked = false;

  setLayerVisibility('unclustered-points', 'visible');
  setLayerVisibility('unclustered-point-labels', 'visible');
  setLayerVisibility('heatmap', 'none');
  setLayerVisibility('clusters', 'none');
  setLayerVisibility('cluster-count', 'none');

  document.getElementById('showEnterprises').addEventListener('change', function(e) {
    const visibility = e.target.checked ? 'visible' : 'none';
    setLayerVisibility('unclustered-points', visibility);
    setLayerVisibility('unclustered-point-labels', visibility);
    
    // 如果显示企业点，则关闭聚类
    if (e.target.checked) {
      document.getElementById('showCluster').checked = false;
      setLayerVisibility('clusters', 'none');
      setLayerVisibility('cluster-count', 'none');
    }
  });

  document.getElementById('showHeatmap').addEventListener('change', function(e) {
    setLayerVisibility('heatmap', e.target.checked ? 'visible' : 'none');
  });

  document.getElementById('showCluster').addEventListener('change', function(e) {
    const visibility = e.target.checked ? 'visible' : 'none';
    setLayerVisibility('clusters', visibility);
    setLayerVisibility('cluster-count', visibility);
    
    // 如果显示聚类，则关闭企业点
    if (e.target.checked) {
      document.getElementById('showEnterprises').checked = false;
      setLayerVisibility('unclustered-points', 'none');
      setLayerVisibility('unclustered-point-labels', 'none');
    }
  });
}

function setLayerVisibility(layerId, visibility) {
  if (administrativeMap.getLayer(layerId)) {
    administrativeMap.setLayoutProperty(layerId, 'visibility', visibility);
  }
}

window.showAdministrativeMap = showAdministrativeMap;
window.hideAdministrativeMap = hideAdministrativeMap;

function showAdministrativeMap() {
  const administrativeMapContainer = document.getElementById('administrativeMapContainer');
  const administrativeOptions = document.getElementById('administrativeOptions');

  administrativeMapContainer.style.display = 'block';
  administrativeOptions.style.display = 'block';

  if (!administrativeMap) {
    initAdministrativeMap();
  } else {
    administrativeMap.resize();
  }
}

function hideAdministrativeMap() {
  const administrativeMapContainer = document.getElementById('administrativeMapContainer');
  const administrativeOptions = document.getElementById('administrativeOptions');

  administrativeMapContainer.style.display = 'none';
  administrativeOptions.style.display = 'none';
}

function initializeLayers() {
  // 添加所有点的数据源
  administrativeMap.addSource('all-points', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: enterprisesData
    }
  });

  // 添加聚类数据源
  administrativeMap.addSource('clustered-points', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: enterprisesData
    },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

  // 添加所有点的图层
  administrativeMap.addLayer({
    id: 'all-points-layer',
    type: 'circle',
    source: 'all-points',
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  // 添加聚类图层
  administrativeMap.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'clustered-points',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    }
  });

  // 添加聚类计数图层
  administrativeMap.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'clustered-points',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  // 添加未聚类的点图层
  administrativeMap.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'clustered-points',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  // 添加点击事件等...
}

function updateLayers() {
  var showAllPoints = document.getElementById('showAllPoints').checked;
  var showCluster = document.getElementById('showCluster').checked;

  administrativeMap.setLayoutProperty('all-points-layer', 'visibility', showAllPoints ? 'visible' : 'none');
  
  administrativeMap.setLayoutProperty('clusters', 'visibility', showCluster ? 'visible' : 'none');
  administrativeMap.setLayoutProperty('cluster-count', 'visibility', showCluster ? 'visible' : 'none');
  administrativeMap.setLayoutProperty('unclustered-point', 'visibility', showCluster ? 'visible' : 'none');
}

// 在地图加载完成后初始化图层
administrativeMap.on('load', function() {
  initializeLayers();
  
  // 绑定复选框事件
  document.getElementById('showAllPoints').addEventListener('change', updateLayers);
  document.getElementById('showCluster').addEventListener('change', updateLayers);
  
  // 初始化图层可见性
  updateLayers();
});