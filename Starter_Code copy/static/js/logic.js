// Creating the map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// The function to determine the marker size based on earthquake magnitude
function getRadius(magnitude) {
    return magnitude * 4;
}

// The function to determine the marker color based on earthquake depth
function getColor(depth) {
    if (depth > 90) return "#d73027";
    if (depth > 70) return "#fc8d59";
    if (depth > 50) return "#fee08b";
    if (depth > 30) return "#d9ef8b";
    if (depth > 10) return "#91cf60";
    return "#1a9850";
}

// Getting our GeoJSON data
d3.json(link).then(function(data) {

    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // Define how each feature should be represented as a layer
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag), // Marker based on magnitude
                fillColor: getColor(feature.geometry.coordinates[2]), // Marker color based on depth
                color: "#000", // Border color
                weight: 1, // Border width
                opacity: 1, // Border opacity
                fillOpacity: 0.8 // Fill opacity
            });
        },
        // Define what happens when a marker is clicked
        onEachFeature: function (feature, layer) {
            // Bind a popup to each marker displaying details about the earthquake
            layer.bindPopup(`
                <h3>Location: ${feature.properties.place}</h3>
                <hr>
                <p>Magnitude: ${feature.properties.mag}</p>
                <p>Depth: ${feature.geometry.coordinates[2]} km</p>
                <p>Date: ${new Date(feature.properties.time)}</p>
            `);
            layer.bindTooltip(`${feature.properties.place} - Magnitude: ${feature.properties.mag}`);
        }
    }).addTo(myMap);
});
      
// Create a legend control to provide context for the data on the map
let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend"),
        depths = [0, 10, 30, 50, 70, 90],
        labels = [];

    // Generate a label with a colored square for each depth interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

// Add the legend to the map
legend.addTo(myMap);
