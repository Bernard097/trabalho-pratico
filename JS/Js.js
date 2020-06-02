var mymap = L.map('mymap').setView([37.5707, -18.5136], 6);

   L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(mymap);

function getColor(value) {
   return value > 1500	? '#b30000':
          value > 900	? '#e60000':
		  value > 600	? '#ff1a1a':
          value > 300	? '#ff4d4d':
          value > 150   ? '#ff8080':
          value > 50    ? '#ffb3b3':
		  value > 1     ? '#ffe6e6':
						  '#ffffff';
}

function style(feature){
   return {
       fillColor: getColor(feature.properties.Confirmado),   // pop_den is the field name for the population density data
       weight: 2,
       opacity: 1,
       color: 'gray',
       fillOpacity: 0.9
   };
}

function highlightFeature(e) {
   // Get access to the feature that was hovered through e.target
   var feature = e.target;

   // Set a thick grey border on the feature when as mouseover effect
   // Adjust the values below to change the highlighting styles of features on mouseover
   // Check out https://leafletjs.com/reference-1.3.4.html#path for more options for changing style
   feature.setStyle({
       weight: 5,
       color: '#666',
       fillOpacity: 0.7
   });

   // Bring the highlighted feature to front so that the border doesn’t clash with nearby states
   // But not for IE, Opera or Edge, since they have problems doing bringToFront on mouseover
   if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
       feature.bringToFront();
   }
}

var geojson; // define a variable to make the geojson layer accessible for the funtion to use

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature, // Do what defined by the highlightFeature function on mouseover
        mouseout: resetHighlight,    // Do what defined by the resetHighlight function on mouseout
    });
}

geojson = L.geoJson(data, {
    style:style,
    onEachFeature: onEachFeature
}).bindTooltip(function (layer){
    return'<b>'+ layer.feature.properties.Concelho + '</b>'
           + '<p style="color:black">' + layer.feature.properties.Confirmado.toString() + ' Casos confirmados </p>';
}).addTo(mymap);

 var legend = L.control({position: 'bottomright'}); // Try the other three corners if you like.

  legend.onAdd = function (mymap) {

      var div = L.DomUtil.create('div', 'legend'),
          grades = [0, 1, 50, 150, 300, 600, 900, 1500]; // The break values to define the intervals of population, note we begin from 0 here

      div.innerHTML = '<b>Casos confirmados de Covid-19<br> até 26 de Maio de 2020 <br></b>'; // The legend title, in this case it's Population Density 2011

      // Loop through our the classes and generate a label with a colored square for each interval.
      // If you are creating a similar choropleth map, you do not need to change lines below.
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i>' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(mymap);