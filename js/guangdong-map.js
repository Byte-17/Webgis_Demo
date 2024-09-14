let myChart;
let option = {};

function initGuangdongMap() {
  if (!myChart) {
    const echartsContainer = document.getElementById('thematicMapContainer');
    myChart = echarts.init(echartsContainer);
  }

  fetch('https://geo.datav.aliyun.com/areas_v3/bound/440000_full.json')
    .then(response => response.json())
    .then(geoJson => {
      echarts.registerMap('guangdong', geoJson);
      const option = createGuangdongMapOption();
      myChart.setOption(option);
    })
    .catch(error => {
      console.error('获取地图数据失败:', error);
    });
}

function showGuangdongMap() {
  const thematicMapContainer = document.getElementById('thematicMapContainer');
  thematicMapContainer.style.display = 'block';
  if (myChart) {
    myChart.resize();
  } else {
    initGuangdongMap();
  }
}

function hideGuangdongMap() {
  const thematicMapContainer = document.getElementById('thematicMapContainer');
  thematicMapContainer.style.display = 'none';
}

const data = [
  { name: '广州市', value: 20 },
  { name: '深圳市', value: 1 },
  { name: '珠海市', value: 39 },
  { name: '汕头市', value: 9 },
  { name: '佛山市', value: 15 },
  { name: '韶关市', value: 61 },
  { name: '河源市', value: 13 },
  { name: '梅州市', value: 67 },
  { name: '惠州市', value: 13 },
  { name: '汕尾市', value: 3 },
  { name: '东莞市', value: 1 },
  { name: '中山市', value: 84 },
  { name: '江门市', value: 518 },
  { name: '阳江市', value: 9 },
  { name: '湛江市', value: 111 },
  { name: '茂名市', value: 50 },
  { name: '肇庆市', value: 36 },
  { name: '清远市', value: 139 },
  { name: '潮州市', value: 226 },
  { name: '揭阳市', value: 10 },
  { name: '云浮市', value: 42 }
];

function createGuangdongMapOption() {
  // 创建广东地图的 ECharts 配置项
  return {
    backgroundColor: 'transparent',
    title: {
      text: '广东省地理标志企业分布',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 家企业'
    },
    visualMap: {
      min: 0,
      max: 520,
      left: 'right',
      top: 'center',
      orient: 'vertical',
      itemWidth: 15,
      itemHeight: 80,
      text: ['高', '低'],
      inRange: {
        color: ['rgba(73, 169, 233, 0.8)', 'rgba(255, 219, 92, 0.8)', 'rgba(255, 159, 127, 0.8)']
      },
      calculable: true,
      textStyle: {
        color: '#fff'
      },
      show: true
    },
    series: [{
      name: '地理标志企业数量',
      type: 'map',
      map: 'guangdong',
      roam: true,
      data: data,
      label: {
        show: true,
        color: '#000',
        fontSize: 10
      },
      itemStyle: {
        areaColor: 'rgba(73, 169, 233, 0.3)',
        borderColor: 'rgba(255, 255, 255, 0.5)'
      },
      emphasis: {
        label: {
          color: '#fff',
          fontSize: 12
        },
        itemStyle: {
          areaColor: 'rgba(73, 169, 233, 0.7)'
        }
      }
    }]
  };
}

function initChart() {
  const echartsContainer = document.getElementById('echartsContainer');
  myChart = echarts.init(echartsContainer);
  console.log('ECharts实例已创建');
  initGuangdongMap(myChart);
}

window.addEventListener('resize', function() {
  if (myChart) {
    myChart.resize();
  }
});

// 如果需要从外部访问，可以将函数挂载到 window 对象
window.initGuangdongMap = initGuangdongMap;
window.showGuangdongMap = showGuangdongMap;
window.hideGuangdongMap = hideGuangdongMap;

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', initChart);
