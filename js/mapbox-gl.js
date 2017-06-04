// JavaScript Document
mapboxgl.accessToken = 'pk.eyJ1IjoicGFuZGFjYyIsImEiOiJjajJyaXFreGIwMGFqMzJxaWZzeWJhcGE4In0.POm7CcDIKMEFu1tYQdQVog';
var map = new mapboxgl.Map({
	container:'location-left',
	style: 'mapbox://styles/mapbox/light-v9',
	zoom:9.8,
	center:[116.3692, 39.9625]
});

var nav=new mapboxgl.NavigationControl();
map.addControl(nav,'top-left');

var geolocation=new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    }
})
map.addControl(geolocation);


var marker = new mapboxgl.Marker()
  .setLngLat([116.3408, 39.9889]).addTo(map);
  

map.on('load', function () {
    // Add a layer showing the places.
    map.addLayer({
         "id": "places",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
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
            }
        },

        "layout": {
            "icon-image": "{icon}-15",
            "icon-allow-overlap": true
			
        		}
     
    });
    //位置标注
    map.on('click', 'places', function (e) {
        new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.description)
            .addTo(map);
    });

    
    map.on('mouseenter', 'places', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

   
    map.on('mouseleave', 'places', function () {
        map.getCanvas().style.cursor = '';
    });
});
