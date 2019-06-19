// Create a map object
var myMap = L.map("map", {
  center: [37.77986, -122.42905],
  zoom: 3
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

function getColor(d) {
  return d > 5 ?  "red":
         d > 4  ? "brown" :
         d > 3 ?  "orange" :
         d > 2 ? "yellow" :
         d > 1  ? '#FD8D3C' :
         d > 0   ? '#FEB24C' :
                   '#FED976' ;
}

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(queryUrl, function(data) {
  console.log(data);
  for (var i = 0; i < data.features.length; i++) {
    console.log(data.features[i]);
   // beatCol = colorFactor(palette = 'RdYlGn', data.features[i].properties.mag);
    L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: getColor(data.features[i].properties.mag),
     
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: data.features[i].properties.mag*50000
    }).bindPopup("<h3>" + data.features[i].properties.place +
    "</h3><hr><p>" + new Date(data.features[i].properties.time) + "</p>").addTo(myMap);
  }
});


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(myMap);

