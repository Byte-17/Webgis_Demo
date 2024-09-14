(function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGFwcHlvbGFmIiwiYSI6ImNrYjZlNDJpdjFkdzkyb2xlMmpicHBwaWIifQ.08Ff3Wvg7vKNTq4QOLhqIQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',//地图样式
        center: [113.4, 24.15],//英德市
  		zoom: 9,
    });
    mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js');
        map.addControl(new MapboxLanguage({
            defaultLanguage: 'zh'
    }));

	        //添加全国图层
    map.on('load', function() {

		// 添加中国的底图
		map.addSource('china', {
		'type': 'geojson',
		'data': 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
		});

		map.addLayer({
		'id': 'china-layer',
		'type': 'fill',
		'source': 'china',
		'paint': {
			'fill-color':'rgba(255, 255, 255, 0.3)',
			'fill-outline-color': 'rgba(0, 0, 0, 1)',
		},
		});

        map.on('mouseenter', 'states-layer', function() {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'states-layer', function() {
            map.getCanvas().style.cursor = '';
        });

		//广东省
		fetch('https://geo.datav.aliyun.com/areas_v3/bound/440000_full.json')
		.then(response => response.json())
		.then(data => {
		var guangdongGeoJSON = data;
		// 添加广东省地图
		map.addSource('guangdong', {
			'type': 'geojson',
			'data': guangdongGeoJSON,
		});
		// 添加广东省边界
		map.addLayer({
			'id': 'guangdong-boundary',
			'type': 'fill',
		'source': 'guangdong',
			'paint': {
			'fill-color': 'rgba(173, 216, 230, 0.2)',
			'fill-outline-color': 'rgba(0, 0, 0, 1)',
			},
		});
		});

		// 添加英德底图
		fetch('https://geo.datav.aliyun.com/areas_v3/bound/441881.json')
		.then(response => response.json())
		.then(data => {
			var yingdeGeoJSON = data;
			// 添加英德图层
			map.addSource('yingde', {
			'type': 'geojson',
			'data': yingdeGeoJSON,
			});

			// Add a layer showing the state polygons.
			map.addLayer({
			'id': 'yingde-layer',
			'type': 'fill',
			'source': 'yingde',
			'paint': {
				'fill-color': 'rgba(255,222,173, 0.2)',
				'fill-outline-color': 'rgba(255,140,0,1)'
			}
			});
			map.setLayoutProperty('yingde-layer', 'visibility', 'true');
		})
		.catch(error => console.error('Error loading GeoJSON:', error));
    });


	// 创建标注点
	var markersData = [
    {
        name: '广东鸿雁茶业有限公司',
        origin: '英德市',
        product: '茶叶',
        service: '茶叶加工、茶叶出口',
        address: '英德市英红镇坑口咀原广东省农业科学院茶叶研究所',
        phone: '0763-2288888',
        fax: '0763-2288889',
        email: 'gdhytea@126.com',
        position: [113.393, 24.201],
		image: './鸿雁.jpg'
    },
    {
        name: '广东英九庄园绿色产业发展有限公司',
        origin: '英德市',
        product: '茶叶',
        service: '茶叶种植、茶叶加工',
        address: '英德市英红镇381县道龙头影村',
        phone: '0763-2286666',
        fax: '0763-2286669',
        email: 'gdjztea@126.com',
        position: [113.375, 24.187],
		image: './英九 (2).jpg'
    },
    {
        name: '英德市上茗轩茶叶有限责任公司',
        origin: '英德市',
        product: '茶叶',
        service: '茶叶加工、茶叶出口',
        address: '清远市英德市456乡道与600乡道交叉口西南150米',
        phone: '0763-2287777',
        fax: '0763-2287779',
        email: 'ymxtea@126.com',
        position: [113.396, 24.153],
		image: './上铭轩.jpg'
    },
    {
        name: '英德科创小镇茶产业发展有限公司（红旗茶厂）',
        origin: '英德市',
        product: '茶叶',
        service: '茶叶加工、茶叶出口',
        address: '英德市英红镇红旗居委（茗茶一路原红旗茶厂）生产车间02号',
        phone: '0763-2288880',
        fax: '0763-2288881',
        email: 'hkctea@126.com',
        position: [113.394, 24.187],
		image: './红旗.jpg'
    },
    {
        name: '广东省农业科学院茶叶研究所(英德实验基地)',
        origin: '英德市',
        product: '茶叶',
        service: '茶叶研究、茶叶技术服务',
        address: '清远市英德市茗香路7号',
        phone: '0763-2289999',
        fax: '0763-2289990',
        email: 'gdtea@126.com',
        position: [113.395, 24.201],
		image: './茶叶研究所.jpg'
    }
];


	markersData.forEach(function(markerData) {
		var markerElement = document.createElement('div');
		markerElement.className = 'marker';
		markerElement.style.backgroundImage = 'url(https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png)';
		markerElement.style.backgroundSize = 'cover';
		markerElement.style.width = '21px';
		markerElement.style.height = '30px';

		var popupContent = `
		<div class="popup-content">
		<div class="left-content">
			<h4>${markerData.name}</h4>
			<p>地址：${markerData.address}</p>
			<p>电话：${markerData.phone}</p>
			<p>传真：${markerData.fax}</p>
			<p>邮箱：${markerData.email}</p>
			<p>地理标志产品：${markerData.product}</p>
			<p>特色服务：${markerData.service}</p>
		</div>
		<div class="image-content">
		<img src="${markerData.image}" alt="${markerData.name}" style="max-width: 200px; max-height: 200px;">

      </div>
		</div>
	`;

			// 创建标注点
		var marker = new mapboxgl.Marker(markerElement)
			.setLngLat(markerData.position)
			.addTo(map);

		// 创建弹出窗口
		var popup = new mapboxgl.Popup({ offset: [0, -15] }).setHTML(popupContent);

		// 添加鼠标悬停事件
		marker.getElement().addEventListener('mouseenter', function() {
			marker.setPopup(popup)
			.togglePopup();
		});

		// 添加鼠标离开事件
		marker.getElement().addEventListener('mouseleave', function() {
			// marker.togglePopup();
		});
		});
})();
