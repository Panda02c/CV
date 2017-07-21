mapboxgl.accessToken = 'pk.eyJ1IjoicGFuZGFjYyIsImEiOiJjajJyaXFreGIwMGFqMzJxaWZzeWJhcGE4In0.POm7CcDIKMEFu1tYQdQVog';

// 考虑适配移动端

var isMobile = window.innerWidth < 640 ? true : false;

// 初始化地图显示变量   

var zoomOut = isMobile ? 11 : 12;
var zoom = zoomIn = isMobile ? 11.4 : 12.6;
var offset = isMobile ? [0, 50] : [0, 20];
var centerDefault = [121.460, 30.000];
var center = isMobile ? [121.460, 30.038] : centerDefault;
var pitch = angled = 60;
var eagleEye = 0;

// 初始化数据置空

var empty = {
    'type': 'FeatureCollection',
    'features': []
};

// 依据高程数据值扩大4倍拉伸显示

var extrudedProperties = {
    'fill-extrusion-height': {
        'property': 'e',
        'type': 'identity'
    },
    'fill-extrusion-color': '#FFFF00',
    'fill-extrusion-opacity': 0.8
};

var map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/streets-v9',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: center,
    minZoom: 11,
    zoom: zoom,
    pitch: pitch
});
// 加载geojson数据

mapboxgl.util.getJSON('route.geojson', function(err, resp) {

    map.on('load', function() {

        // 依据不同平台设置导航位置

        if (isMobile) { map.addControl(new mapboxgl.NavigationControl(), 'bottom-left') } else { map.addControl(new mapboxgl.NavigationControl(), 'top-right') };

        // 设置光源，突出拉伸的显示 position:[r,a,p] ([半径，方位角，极角]）

        map.setLight({ intensity: 0.6, position: [1, 180, 60] });

        // 添加数据源

        map.addSource('route', {
            'type': 'geojson',
            'data': resp
        });

        map.addSource('routeline', {
            'type': 'geojson',
            'data': empty
        });
        map.addSource('along', {
            'type': 'geojson',
            'data': empty
        });

        //设置图层样式： route路线  routeline拉伸 along位置点

        map.addLayer({
            'id': 'route',
            'source': 'route',
            'type': 'line',
            'paint': {
                'line-color': 'rgba(255,255,255,0.8)',
                "line-width": 2
            }
        });
        
        map.addLayer({
            'id': 'routeline',
            'source': 'routeline',
            'type': 'fill-extrusion',
            'paint': extrudedProperties
        });

        map.addLayer({
            'id': 'hola',
            'type': 'circle',
            'source': 'along',
            'paint': {
            'circle-radius': 3,
            'circle-color': '#e1e1e1',
            'circle-stroke-width': 1,
            'circle-stroke-color':'#486DE0',
            'circle-stroke-opacity':0.8

            }
        });

        map.addLayer({
          'id': 'along',
          'type': 'circle',
          'source': 'along',
          'paint': {
            'circle-radius': 5,
            'circle-color': '#486DE0',
            'circle-stroke-width': 2,
            'circle-stroke-color':'#ffffff'
          }
        });
        var j=0;
        var r=30;
        var opacity=0.9;
        function Breath(){

            if(j<=r && opacity>0){
                map.setPaintProperty('hola','circle-stroke-width',j);
                map.setPaintProperty('hola','circle-stroke-opacity',opacity);
                //halo透明度随半径非线性变化（随半径增大，透明度）
                opacity=(j-4*r)*(j-4*r)/(7*r*r)-9/7;
                j=j+2;
            }else{
                    
                if(j>0){
                        map.setPaintProperty('hola','circle-stroke-width',j);
                        map.setPaintProperty('hola','circle-stroke-opacity',0);
                        j=j-4;
                }else{
            
                    j=0;    
                    opacity=0.9;
                    };

            };
        };

        var breathPace=100;
        breathInterval = setInterval(Breath, breathPace);

        //   hover popup 展示位置的高程信息

        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            anchor: 'top',
            offset: 5
        });

        map.on('mousemove', function(e) {

            var hover = map.queryRenderedFeatures([
                [e.point.x, e.point.y + 200],
                [e.point.x, e.point.y]
            ], { layers: ['routeline'] });

            map.getCanvas().style.cursor = (hover.length) ? 'pointer' : '';

            if (!hover.length) {
                popup.remove();
                return;
            }

            var feature = hover[0];
            popup.setLngLat(feature.geometry.coordinates[[0],[0]])
                .setHTML(Math.floor(feature.properties.e*0.25) + ' m')
                .addTo(map);
        });

    });

    // 比赛相关信息提示变量

    var elevationTxt = document.getElementById('elevation');
    var distanceTxt = document.getElementById('distance');
    var timeTxt = document.getElementById('time');
    var paceTxt = document.getElementById('pace');
    var pace = paceTxt.textContent = 5;

    function resetMetrics() {
        elevationTxt.textContent = Math.floor((resp.features[0].properties.e)*0.25) + ' m';
        distanceTxt.textContent = '0 m';
        timeTxt.textContent = '00:00';
    };

    resetMetrics();

    // 鼠标滑过高程剖面图，比赛位置点的状态更新

    var graph = document.getElementById('graph');
    var playhead = document.getElementById('playhead');
    var cursorDown = false;
    var progress = 0;
    //兼容移动端：window.innerWidth
    var dashWidth = isMobile ? window.innerWidth : 300        
    function updateOnGraphEvent() {
        if (animateInterval != null) {
            stopAnimate();
            updateProgress();
            animateInterval = setInterval(animate, animatePace);
        } else {
            updateProgress();
        };
    };

    //web端，高程剖面progress控制进程

    graph.addEventListener('mousemove', function(e) {
        var mouseX = isMobile ? e.pageX : e.pageX - 10;
        progress = Math.floor(mouseX / dashWidth * resp.features.length);
        updateOnGraphEvent();
    });

    // 移动端，高程剖面progress控制进程

    graph.addEventListener('touchend', function() { cursorDown = false; });
    graph.addEventListener('touchstart', function(e) { cursorDown = true; });
    graph.addEventListener('touchmove', function(e) {
        if (cursorDown) {
            progress = Math.floor(e.changedTouches[0].pageX / dashWidth * resp.features.length);
            updateOnGraphEvent();
        };
    });

    // 依据progress控制方向bearing,turf.bearing()

    var bearing = bearingPrev = turf.bearing(resp.features[0].geometry.coordinates[0], resp.features[2].geometry.coordinates[0]);

    function getBearing() {

        var featureNow = resp.features[progress];
        var featureNext = resp.features[progress + 20]; //改变20，减小旋转浮动
        var bearingNow = (featureNext === undefined) ? bearingPrev : turf.bearing(featureNow.geometry.coordinates[0], featureNext.geometry.coordinates[0]);
        bearing = Math.abs(bearingNow - bearingPrev) > 90 ? bearingPrev : bearingNow;
        bearingPrev = bearingNow;

    };

    // routelineLimit

    var routelineLimit = resp.features.length;

    function returnrouteline(value) { return resp.features.indexOf(value) <= routelineLimit; };

    var routeline = {
        'type': 'FeatureCollection',
        'features': resp.features.filter(returnrouteline)
    };

    // 依据 progress 获取 geojson indexOf

    function returnroutelineProgress(value) { return resp.features.indexOf(value) <= progress ; };

    // 刷新比赛进程

    var isInrouteline = false;   
    var lines = resp;
    // 每个点位置点都位于单段矢量的0距离初
    var along = turf.along(lines.features[0], 0, 'kilometers');
    var partlength=turf.lineDistance(lines.features[0]);
	var dist=0;
    
    function updateProgress() {

        if (progress < routelineLimit) {

        	// 设置位置点
   			along = turf.along(lines.features[progress], partlength, 'kilometers');
   			map.getSource('along').setData({
              	type: 'FeatureCollection',
              	features: [along]
            	});

            // 更新显示数据
            var totalTime = Math.floor((progress * 0.043) * pace);
            var hrs = (Math.floor(totalTime / 60));
            var minutes = totalTime - (60 * hrs);
            elevationTxt.textContent = Math.floor((resp.features[progress].properties.e)*0.25) + ' m';
            distanceTxt.textContent = Math.floor(progress *42.21) + ' m';//modified
            timeTxt.textContent = (minutes < 10) ? '0' + hrs + ':0' + minutes : '0' + hrs + ':' + minutes;
            // playhead控制进度条
            playhead.style.left = progress / routelineLimit * 100 + '%';

            //设置高程拉伸数据
            map.getSource('routeline').setData({
                'type': 'FeatureCollection',
                'features': resp.features.filter(returnroutelineProgress)
            });
        }
        else{
                stopAnimate();
            };

            // 更新地图位置中心

            center = resp.features[progress].geometry.coordinates[0];
            getBearing();

            map.easeTo({
                center: center,
                bearing: bearing + 90,
                duration: 500,
                offset: offset,
                easing: function(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
            });
     
    };

    // 设置步速

    document.getElementById('less').addEventListener('click', function() {
        if (pace > 1) {
            pace--;
            paceTxt.textContent = pace;
        };
    });
    document.getElementById('more').addEventListener('click', function() {
        if (pace < 20) {
            pace++;
            paceTxt.textContent = pace;
        };
    });

    // 位置点移动速度

    var animatePace = (pace * 100); 

    // “跟随pitch60”和“总览egaleEye0”视角设置 

    function setPitch() {
        if (animateInterval != null) {
            stopAnimate();
            map.flyTo({
                center: center,
                pitch: pitch,
                zoom: zoom+2.5,
                duration: 100
            });
            animateInterval = setInterval(animate, animatePace);
        } else {
            map.flyTo({
                center: center,
                pitch: pitch,
                zoom: zoom,
                duration: 100
            });
        };
    };

    document.getElementById('two').addEventListener('click', function() {
        pitch = eagleEye;
        zoom = zoomOut;
        setPitch();
    });

    document.getElementById('three').addEventListener('click', function() {
        pitch = angled;
        zoom = zoomIn;
        setPitch();
    });

    // 移动控制

    var play = document.getElementById('play');
    var pause = document.getElementById('pause');
    var reset = document.getElementById('reset');
    var setPace = document.getElementById('setpace');

    var animateInterval = null;

    function animate() {
    	updateProgress();
    	progress++;
    };

    function stopAnimate() {
        clearInterval(animateInterval);
        animateInterval = null;
    };

    // 开始键

    play.addEventListener('click', function() {

        setPace.style.display = 'none';
        play.classList.add('hidden');
        pause.classList.remove('hidden');
        reset.classList.remove('hidden');
        animateInterval = setInterval(animate, animatePace);

    });

    // 停止键

    pause.addEventListener('click', function() {
        if (animateInterval != null) {
            stopAnimate();
            pause.textContent = '开始';
        } else {
            animateInterval = setInterval(animate, animatePace);
            pause.textContent = '停止';
        };
    });

    // 重置键

    reset.addEventListener('click', function() {

        stopAnimate();

        map.getSource('routeline').setData(empty);
        map.getSource('along').setData(empty);

        playhead.style.left = progress = 0;
        dist=0;
        center = centerDefault;
        pitch = angled;
        zoom = zoomIn;

        map.easeTo({
            center: center,
            bearing: 0,
            pitch: pitch,
            zoom: zoom
        });

        setPace.style.display = 'block';
        play.classList.remove('hidden');
        pause.classList.add('hidden');
        reset.classList.add('hidden');
        pause.textContent = '停止';

        resetMetrics();        
        
    });

});