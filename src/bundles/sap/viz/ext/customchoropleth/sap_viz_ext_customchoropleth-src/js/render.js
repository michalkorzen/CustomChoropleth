/*
 * A custom choropleth map extension for SAP Lumira.
 * =================================================
 * Modified by Michal Korzen, SAP Poland
 * Original by Mustafa Aydogdu, SAP Turkiye
 */

/*<<dependency*/
define("sap_viz_ext_customchoropleth-src/js/render", ["sap_viz_ext_customchoropleth-src/js/utils/util"], function(util){
/*dependency>>*/
		var cssLoadStatus = false;
		var centerStatus = false;
      
		var render = function(data, container) {
	  
		var module = this;
		
		//prepare canvas with width and height of container
		container.selectAll('svg').remove();
        
        var filePath='../sap/bi/bundles/sap/viz/ext/customchoropleth';  //For productive
        
        var mset1 = data.meta.measures(0); 
        var ms1 = mset1[0];                                                      
        var dset1 = data.meta.dimensions(0);
      	var shapeName = dset1[0];
		
		
        if(cssLoadStatus == false){    
			var element = document.createElement('link');
            element.type = 'text/css';
            element.rel = 'stylesheet';
            element.href = filePath + '/leaflet.css';  
			
			document.body.appendChild(element);
			cssLoadStatus=true;             
		}
       
	    var fdata = data.slice();

        var max2= -Infinity;
		var min2 = Infinity;
		
        fdata.forEach(function(d, i) { 
            if (d[ms1] > max2) {max2 = d[ms1]}
			if (d[ms1] < min2) {min2 = d[ms1]}
        });//end of find max

		
		var colors = this.properties().colorPalette;

        var colorScale2 = d3.scale.linear()
            .domain([min2,max2])
            .range([colors[3], colors[2]]);

		container.node().innerHTML="";
		var mapArea = document.createElement('div');
		mapArea.style.width = container.node().offsetWidth+'px';
		mapArea.style.height = container.node().offsetHeight+'px';
		container.node().appendChild(mapArea);

        require([
			filePath+'/leaflet.js',
			filePath+'/geojson.js'
			], function ( ) {
				// call google maps API after everything is loaded
				createMap();
        });
          
		function createMap() { 
			//Define layers
			var layerOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			});
				   
			var Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
				attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
			});

			var MapQuestOpen_OSM = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
				attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
				subdomains: '1234'
			});

			var OpenMapSurfer_Roads = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
				minZoom: 0,
				maxZoom: 20,
				attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
			});
			
			var MapBox = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
				id: 'examples.map-i86l3621'
			});
				   
			var map = L.map(mapArea, {layers: [layerOSM]});				   
			
			function style(feature) {
				return {
					fillColor: getColor(feature.properties.NAME),
					weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '2',
					fillOpacity: 0.7
				};
			}
			function setGeoStyle(layer){
				layer.setStyle(
				{
					fillColor: getColor(layer.feature.properties.NAME),
					weight: 1.5,
					opacity: 1,
					color: 'white',
					fillOpacity: 0.7
				});
			}		
			
			//region
			var geoLayers = new L.geoJson(mapdata[dset1[0]], {
				style: style,
				onEachFeature: function (feature, layer) {
					setPopup(layer);//layer.bindPopup(feature.properties.description);
				},
				filter: function(feature, layer) {
					var measureValue = null, indexer = 0;
					
					for(i=0; i<fdata.length;i++)
					{
						if(fdata[i][shapeName] == feature.properties.NAME)
						{
							measureValue = fdata[i][ms1];
							indexer = i;
							break;
						}
					}
					
					return (measureValue != null);
				}
			}).addTo(map);				
			
			function setPopup(layer){
				var measureValue = null;
				var indexer = 0;
				
				for(i=0; i<fdata.length;i++)
				{
					if(fdata[i][shapeName] == layer.feature.properties.NAME)
					{
						measureValue = fdata[i][ms1];
						indexer = i;
						break;
					}
				}
				
				function _getParent(element, className) {
					if(!element.parentNode) return false;
					var parent = element.parentNode;
					while (parent != null) {
						if (parent.className && L.DomUtil.hasClass(parent, className))
							return parent;
						parent = parent.parentNode;
					}
					return false;
				}					
					
				layer.bindPopup(
					'<table class="v-tooltip-dimension-measure" style="border-collapse: collapse;"><tr><td style="font-family:Arial;font-size:12px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;padding-bottom:8px;color:#666666" class="v-body-dimension-label">Region:</td><td style="font-family:Arial;font-size:13px;font-weight:bold;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;padding-left:7px;padding-bottom:8px;color:#666666" class="v-body-dimension-value">'+layer.feature.properties.NAME+'</td></tr><tr><td style="font-family:Arial;font-size:12px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;padding-bottom:0px;color:#666666" class="v-body-measure-label">'+ms1+':</td><td style="font-family:Arial;font-size:13px;font-weight:bold;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;padding-left:7px;padding-bottom:0px;color:#000000" class="v-body-measure-value">'+measureValue+'</td></tr></table>', 
					{
						closeButton: false, 
						offset: new L.Point(0, -2), 
						autoPan: false
					}
				);
				
				layer.on('mouseover', function (e) {							
					// get the element that the mouse hovered onto
					var target = e.originalEvent.fromElement || e.originalEvent.relatedTarget;
					var parent = _getParent(target, "leaflet-popup");
	 
					// check to see if the element is a popup, and if it is this marker's popup
					if (parent == e.layer._popup._container)
						return true;
					
					e.layer.openPopup();
					
					geoLayers.eachLayer(function (layer) {
						geoLayers.resetStyle(layer);
					});
					
					var layer = e.target;
					layer.setStyle({
						weight: 5,
						color: '#666',
						dashArray: '',
						fillOpacity: 0.7
					});
					
					if (!L.Browser.ie && !L.Browser.opera) {
						layer.bringToFront();
					}
				});
				
				layer.on('mousemove', function (e) {
					e.layer._popup.setLatLng(e.latlng);
				});
				
				layer.on('mouseout', function (e) {
					// get the element that the mouse hovered onto
					var target = e.originalEvent.toElement || e.originalEvent.relatedTarget;
					
					// check to see if the element is a popup
					if (_getParent(target, "leaflet-popup")) {
						L.DomEvent.on(e.layer._popup._container, "mouseout", this._popupMouseOut, this);
						return true;
					}
					
					e.layer.closePopup();
					
					geoLayers.eachLayer(function (layer) {
						geoLayers.resetStyle(layer);
					});
				});
				
				layer.on('click', function(e) {
					try {
						var clickedpoint = map.latLngToContainerPoint(e.latlng);
						// get context from the raw csv data
						var ctx = data[indexer].context(ms1);						

						// set ctx to the selectedObjects
						module.setSelectedObjects([ctx]);
						
						var d = [layer.feature.properties.NAME, fdata[indexer][ms1]];
						
						module.dispatch().showDataFilter({
							dataCtx: util.composeSelection(ms1, d, this, ctx)
						});	
					} catch(err) {
						alert(err.message);
					}
					
					$( "div.leaflet-popup-content-wrapper" ).append( $( "div#datafilter" ) );
				});
				
				map.on('click', function(e) {
					// remove selections
					module.setSelectedObjects([]);
					// hide the data filter
					module.dispatch().hideDataFilter();
				});
			}

			//Color function for geojson shapes
			function getColor(location){
				var layerColor = '#EFEDEA';//Default color for no data
				var measureValue = '';
				fdata.forEach(function(d, i) {
					if(location == d[shapeName]){
						measureValue = fdata[i][ms1];
						layerColor=colorScale2(measureValue);
					}
				});
				
				return layerColor;
			}
			
			// legend
			var legend = L.control({position: 'bottomright'});

			legend.onAdd = function (map) {
			
				var diff = max2 - min2;

				var div = L.DomUtil.create('div', 'info legend'),
					grades = [min2, Math.round(min2+0.2*diff), Math.round(min2+0.4*diff), Math.round(min2+0.6*diff), Math.round(min2+0.8*diff), max2],
					labels = [];

				// loop through our density intervals and generate a label with a colored square for each interval
				for (var i = 0; i < grades.length; i++) {
					div.innerHTML +=
						'<i style="background:' + colorScale2(grades[i] + 1) + '"></i> ' +
						grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
				}

				return div;
			};

			legend.addTo(map);			
					
			var baseMaps = {
				"OSM": layerOSM,
				"ESRI": Esri_WorldStreetMap,
				"Open Maps Surfer": OpenMapSurfer_Roads,
				"Map Quest": MapQuestOpen_OSM,
				"MapBox" : MapBox
			};
			
			var overlayMaps = {
				"Custom Layer (GeoJSON)": geoLayers
			};	
            
            map.fitBounds(geoLayers.getBounds());
			L.control.layers(baseMaps,overlayMaps).addTo(map);
		}
	};

	return render; 
});