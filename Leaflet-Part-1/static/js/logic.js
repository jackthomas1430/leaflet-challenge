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

    // Iterate over each feature in the GeoJSON data
    data.features.forEach(function(feature) {
        // Get the latitude and longitude from the coordinates array
        let latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

        // Create a circle marker at the latitude and longitude
        let marker = L.circleMarker(latlng, {
            radius: getRadius(feature.properties.mag), // Size of marker based on magnitude
            fillColor: getColor(feature.geometry.coordinates[2]), // Color of marker based on depth
            color: "#000", 
            weight: 1, 
            opacity: 1, 
            fillOpacity: 0.8 
        });

        // Bind a popup to each marker displaying earthquake details 
        marker.bindPopup(`
            <h3>Location: ${feature.properties.place}</h3>
            <hr>
            <p>Magnitude: ${feature.properties.mag}</p>
            <p>Depth: ${feature.geometry.coordinates[2]} km</p>
            <p>Date: ${new Date(feature.properties.time)}</p>
        `);

        // Add the marker to the map
        marker.addTo(myMap);
    });
});
      
// Create a legend with color index based on earthquake depth
let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    div.innerHTML = '<h4>Earthquake Depth (km)</h4>';
    depths = [0, 10, 30, 50, 70, 90];
    labels = [];

    // Generate a label with a colored square for each depth interval
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

// Add the legend to the map
legend.addTo(myMap);
