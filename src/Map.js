import React, { useState, useEffect } from "react";

function Map({ locations }) {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [path, setPath] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = process.env.REACT_APP_SCRIPT;
    script.onload = () => {
      if (window.google) {
        const { google } = window;
        const maps = google.maps;

        // Create a new map
        const mapConfig = {
          center: locations[0],
          zoom: 14,
        };
        const newMap = new maps.Map(document.getElementById("map"), mapConfig);
        setMap(newMap);

        // Draw path between markers with delay
        let j = 0;
        const pathCoordinates = [];
        const pathInterval = setInterval(() => {
          pathCoordinates.push(locations[j]);
          if (j === locations.length - 1) {
            clearInterval(pathInterval);

            // Create a new path and add it to the map
            const newPath = new maps.Polyline({
              path: pathCoordinates,
              strokeColor: "#FF0000",
              strokeOpacity: 1.0,
              strokeWeight: 2,
            });
            newPath.setMap(newMap);
            setPath(newPath);

            // Add markers to the map with delay
            let i = 0;
            const newMarkers = [];
            const bounds = new maps.LatLngBounds(); // create a new bounds object
            const markerInterval = setInterval(() => {
              const marker = new maps.Marker({
                position: locations[i],
                map: newMap,
                animation: maps.Animation.DROP,
              });
              newMarkers.push(marker);
              setMarkers(newMarkers);

              bounds.extend(marker.getPosition()); // extend the bounds to include the new marker's position
              newMap.fitBounds(bounds); // auto zoom the map to fit all markers

              i++;
              if (i === locations.length) {
                clearInterval(markerInterval);
              }
            }, 1000);
          }

          j++;
        }, 1000);
      }
    };
    document.body.appendChild(script);
  }, [locations]);

  return <div id="map" style={{ height: "500px", width: "100%" }} />;
}

export default Map;
