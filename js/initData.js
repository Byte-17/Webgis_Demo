if (!localStorage.getItem('mapbox_token')) {
    localStorage.setItem('mapbox_token', btoa('your_mapbox_token_here'));
}

if (!localStorage.getItem('mapData')) {
    const mapData = {
        // 模拟的地图数据
        points: [
            { id: 1, name: "企业A", lat: 23.5, lon: 113.2, type: "食品" },
            { id: 2, name: "企业B", lat: 23.7, lon: 113.4, type: "工艺品" },
            { id: 3, name: "企业C", lat: 23.6, lon: 113.3, type: "农产品" },
            // 可以根据需要添加更多点
        ],
        regions: [
            { id: 1, name: "清城区", center: [23.5, 113.2], enterprises: 10 },
            { id: 2, name: "清新区", center: [23.7, 113.4], enterprises: 15 },
            // 可以根据需要添加更多区域
        ],
        statistics: {
            totalEnterprises: 123,
            typeDistribution: {
                "食品": 50,
                "工艺品": 30,
                "农产品": 43
            }
        }
    };
    localStorage.setItem('mapData', btoa(JSON.stringify(mapData)));
}