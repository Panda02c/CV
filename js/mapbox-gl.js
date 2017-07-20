mapboxgl.accessToken = 'pk.eyJ1IjoicGFuZGFjYyIsImEiOiJjajJyaXFreGIwMGFqMzJxaWZzeWJhcGE4In0.POm7CcDIKMEFu1tYQdQVog';

var map = new mapboxgl.Map({
	container:'location-left',
	style: 'mapbox://styles/mapbox/light-v9',
	zoom:9.8,
	center:[116.3692, 39.9625]
});

var nav=new mapboxgl.NavigationControl();
map.addControl(nav,'top-left');

var marker = new mapboxgl.Marker()
  .setLngLat([116.3408, 39.9889]).addTo(map);

//标注位置

var address={
            
                "type": "FeatureCollection",
                "features": [{                             
                    "type": "Feature",
                    "properties": {
                        "description": "<strong>中国地质大学（北京）</strong><p>我在这儿等着你~</p><p>北京市，海淀区，学院路29号</p>",
                        "icon": "star"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [116.3408, 39.9885]
                    }
            }]

    };

var j=0;

map.on('load', function () {

    map.addSource("address",{
        "type": "geojson",
        "data": address
    });
    
    map.addLayer({
        'id': 'hola',
        'type': 'circle',
        'source': 'address',
        'paint': {
        'circle-radius': 3,
        'circle-color': '#e1e1e1',
        'circle-stroke-width': 1,
        'circle-stroke-color':'#A2A2A2',
        'circle-stroke-opacity':0.8

        }
    });
    map.addLayer({
        "id": "star",
        "type": "symbol",
        "source":"address",
        "layout": {
            "icon-image": "{icon}-15",
            "icon-allow-overlap": true
                }
    });

    //位置标注
    map.on('click', 'star', function (e) {
        new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.description)
            .addTo(map);
    });

    
    map.on('mouseenter', 'star', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

   
    map.on('mouseleave', 'star', function () {
        map.getCanvas().style.cursor = '';
    });

    var r=40;
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

    var animatePace=100;
    breathInterval = setInterval(Breath, animatePace);

});