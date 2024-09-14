
//左一 清远市
(function () {
    var myChart1 = echarts.init(document.querySelector(".bar .chart"));
    myChart1.showLoading();
    $.get('https://geo.datav.aliyun.com/areas_v3/bound/441800_full.json', function (geoJson) {
    myChart1.hideLoading();
    echarts.registerMap('清远市', geoJson);
    myChart1.setOption({
        // title: {
        //   text: '广东省清远市地理标志保护产品专用标志使用企业分布情况',
        //   subtext: '数据来源',
        //   sublink: 'https://ipggfw.gdqy.gov.cn/qingyuanshizhishichanqggfwpt/gzdt/tzgg/932'
        // },
        tooltip: {
        trigger: 'item',
        formatter: '{b} {c} (个)'
        },
        // toolbox: {
        // show: false,
        // orient: 'vertical',
        // left: 'right',
        // top: 'center',
        // feature: {
        //     dataView: { readOnly: false },
        //     restore: {},
        //     saveAsImage: {}
        // }
        // },
        grid: {
          width: '85%', // 限制地图宽度
          aspectRatio: 1 // 设置地图的宽高比为 1:1，保持地图的宽高比
        },
        visualMap: {
        textStyle: {
          color: '#fff'
        },
        min: 0,
        max: 100,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
            color: ['rgba(73, 169, 233, 0.8)', 'rgba(255, 219, 92, 0.8)', 'rgba(255, 159, 127, 0.8)']
        }
        
        },
        series: [
        {
            name: '地理标志保护产品专用标志使用企业数量',
            type: 'map',
            map: '清远市',
            label: {
            show: false
            },
            data: [
            // { name: '清远市', value: 6 },
            { name: '连州市', value: 25 },
            { name: '连南瑶族自治县', value: 1 },
            { name: '英德市', value: 77 },
            { name: '连山壮族瑶族自治县', value: 7 },
            { name: '阳山县', value: 4 },
            { name: '佛冈县', value: 3 },
            { name: '清城区', value: 0 },
            { name: '清新区', value: 0 }
            ],
            nameMap: {
            '清城区': '清城区',
            '清新区': '清新区',
            '佛冈县': '佛冈县',
            '阳山县': '阳山县',
            '连南瑶族自治县': '连南瑶族自治县',
            '连山壮族瑶族自治县': '连山壮族瑶族自治县',
            }
        }
        ]
    });
    });
    
    window.addEventListener('resize', function() {
    myChart1.resize();
    });

})();

//右一 广东省
(function(){
    var myChart = echarts.init(document.querySelector(".bar2 .chart"));
    // var dom = document.getElementById('container');
    // var myChart = echarts.init(document.getElementById('main02'),dom, null, {
    // renderer: 'canvas',
    // useDirtyRect: false
    // });
    // var app = {};
    // var ROOT_PATH = 'https://echarts.apache.org/examples';
    var option;

    myChart.showLoading();
    $.get('https://geo.datav.aliyun.com/areas_v3/bound/440000_full.json', function (geoJson) {
    myChart.hideLoading();
    echarts.registerMap('广东省', geoJson);
    myChart.setOption(
        (option = {
        // title: {
        //   text: '广东省地理标志保护产品专用标志使用企业分布情况',
        //   subtext: 'Sources of Data',
        //   sublink:
        //     'https://ipggfw.gdqy.gov.cn/qingyuanshizhishichanqggfwpt/gzdt/tzgg/932'
        // },
        tooltip: {
            trigger: 'item',
            formatter: '{b}{c} (个)'
        },
        // toolbox: {
        //     show: false,
        //     orient:'vertical',
        //     left: 'right',
        //     top: 'center',
        //     feature: {
        //     dataView: { readOnly: false },
        //     restore: {},
        //     saveAsImage: {}
        //     }
        // },
        visualMap: {
          textStyle: {
            color: '#fff'
          },
          min: 0,
          max: 550,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
          color: ['rgba(73, 169, 233, 0.8)', 'rgba(255, 219, 92, 0.8)', 'rgba(255, 159, 127, 0.8)']
          }
        },
        series: [
            {
            name: '广东省地理标志保护产品专用标志使用企业数量',
            type: 'map',
            map: '广东省',
            label: {
                show: false//是否在图上显示地名
            },
            data: [
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
            ]
            }
        ]
        })
    );
    });

    if (option && typeof option === 'object') {
    myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);


})();

//左二 清远市图表
(function () {
  var myChart_demo = echarts.init(document.querySelector(".line .chart"));
  var option = {
    color: ['rgba(73, 169, 233, 0.8)', 'rgba(144, 237, 125, 0.8)', 'rgba(255, 159, 127, 0.8)', 'rgba(255, 219, 92, 0.8)', 'rgba(190, 135, 226, 0.8)', 'rgba(248, 177, 149, 0.8)', 'rgba(158, 224, 158, 0.8)', 'rgba(255, 192, 203, 0.8)'],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      show:false,
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: "rgba(0, 0, 0, 0.7)",
        fontSize: 10
      }
    },
    series: [{
      name: '地区分布',
      type: 'pie',
      radius: ["20%", "60%"],
      center: ['50%', '60%'],
      // 半径模式  area面积模式
      roseType: 'radius',
      // 图形的文字标签
      label: {
        fontsize: 10
      },
      // 引导线调整
      labelLine: {
        // 连接扇形图线长(斜线)
        length: 6,
        // 连接文字线长(横线)
        length2: 8
      },
      data: [
      { name: '连州市', value: 25 },
      { name: '连南瑶族自治县', value: 1 },
      { name: '英德市', value: 77 },
      { name: '连山壮族瑶族自治县', value: 7 },
      { name: '阳山县', value: 4 },
      { name: '佛冈县', value: 3 },
      { name: '清城区', value: 0 },
      { name: '清新区', value: 0 }
      ]
    }]
  };

  myChart_demo.setOption(option);
  window.addEventListener('resize', function () {
    myChart_demo.resize();
  })
})();


//右二 广东省图表
(function () {
  var myChart_demo = echarts.init(document.querySelector(".line2 .chart"));
  var option = {
    color: ['rgba(73, 169, 233, 0.8)', 'rgba(144, 237, 125, 0.8)', 'rgba(255, 159, 127, 0.8)', 'rgba(255, 219, 92, 0.8)', 'rgba(190, 135, 226, 0.8)', 'rgba(248, 177, 149, 0.8)', 'rgba(158, 224, 158, 0.8)', 'rgba(255, 192, 203, 0.8)'],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      show:false,
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: "rgba(0, 0, 0, 0.7)",
        fontSize: 10
      }
    },
    series: [{
      name: '地区分布',
      type: 'pie',
      radius: ["20%", "60%"],
      center: ['50%', '60%'],
      // 半径模式  area面积模式
      roseType: 'radius',
      // 图形的文字标签
      label: {
        fontsize: 10
      },
      // 引导线调整
      labelLine: {
        // 连接扇形图线长(斜线)
        length: 6,
        // 连接文字线长(横线)
        length2: 8
      },
      data: [
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
      ]
    }]
  };

  myChart_demo.setOption(option);
  window.addEventListener('resize', function () {
    myChart_demo.resize();
  })
})();

//左三列表
(function () {
      // 导入 Excel 文件并读取数据
      function importExcelFile(filePath) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', filePath, true);
        xhr.responseType = 'arraybuffer';
  
        xhr.onload = function(e) {
          var arraybuffer = xhr.response;
          var data = new Uint8Array(arraybuffer);
          var workbook = XLSX.read(data, {type: 'array'});
          var worksheet = workbook.Sheets[workbook.SheetNames[0]];
          var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
          var textContainer = document.getElementById('textContainer');
          var text = '';
          jsonData.forEach(function(row, index) {
            if (index === 0) return; // 跳过标题行
            text += `<div class="enterprise-item">
              <div class="enterprise-name">${row[0]}</div>
              <div class="enterprise-info">
                产品：${row[1]}<br>
                地理标志：${row[2]}<br>
                统一社会信用代码：${row[3] || '无'}
              </div>
            </div>`;
          });
          textContainer.innerHTML = text + text; // 重复一次内容以确保连续滚动
  
          // 设置动画持续时间
          var scrollHeight = textContainer.scrollHeight;
          var containerHeight = document.querySelector('.scroll-container').offsetHeight;
          var duration = scrollHeight / containerHeight * 3; // 20秒滚动一个容器高度
          textContainer.style.animation = `scroll-animation ${duration}s linear infinite`;
        };
  
        xhr.send();
      }
  
      // 指定 Excel 文件路径，并导入及读取数据
      var excelFilePath = '地理标志保护产品专用标志使用企业名录.xlsx';
      importExcelFile(excelFilePath);
})();


//右三列表
(function () {
  // 导入 Excel 文件并读取数据
  function importExcelFile(filePath) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', filePath, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
      var arraybuffer = xhr.response;
      var data = new Uint8Array(arraybuffer);
      var workbook = XLSX.read(data, {type: 'array'});
      var worksheet = workbook.Sheets[workbook.SheetNames[0]];
      var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      var textContainer = document.getElementById('textContainer1');
      var text = '';
      jsonData.forEach(function(row, index) {
        if (index === 0) return; // 跳过标题行
        text += `<div class="enterprise-item">
          <div class="enterprise-name">${row[0]}</div>
          <div class="enterprise-info">
            产品：${row[1]}<br>
            地理标志：${row[2]}<br>
            统一社会信用代码：${row[3] || '无'}
          </div>
        </div>`;
      });
      textContainer.innerHTML = text + text; // 重复一次内容以确保连续滚动

      // 设置动画持续时间
      var scrollHeight = textContainer.scrollHeight;
      var containerHeight = textContainer.parentElement.offsetHeight;
      var duration = scrollHeight / containerHeight * 3; // 30秒滚动一个容器高度
      textContainer.style.animation = `scroll-animation ${duration}s linear infinite`;
    };

    xhr.send();
  }
  // 指定 Excel 文件路径，并导入及读取数据
  var excelFilePath = '广东省地理标志产品专用标志核准使用企业贴标信息汇编.xlsx';
  importExcelFile(excelFilePath);
})();