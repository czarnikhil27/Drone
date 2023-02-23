import React, { useState, useEffect } from "react";

function Map({ locations }) {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [path, setPath] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2zm9evjJgAk_aihSvSUbVEG2FxM2JdYw`;
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
          if (!isPaused) {
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
              // Animate drawing the path
              let i = 0;
              const pathDrawInterval = setInterval(() => {
                if (!isPaused) {
                  const lineSymbol = {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeOpacity: 0.8,
                    strokeColor: "#0000FF",
                    strokeWeight: 2,
                    scale: 3,
                  };
                  const partialPath = new maps.Polyline({
                    path: pathCoordinates.slice(0, i),
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    icons: [
                      {
                        icon: lineSymbol,
                        offset: "100%",
                      },
                    ],
                  });

                  partialPath.setMap(newMap);
                  i++;
                  if (i > pathCoordinates.length) {
                    clearInterval(pathDrawInterval);
                  }
                }
              }, 30);

              // Add markers to the map with delay
              let k = 0;
              const newMarkers = [];
              const bounds = new maps.LatLngBounds(); // create a new bounds object
              const markerInterval = setInterval(() => {
                if (!isPaused) {
                  const marker = new maps.Marker({
                    position: locations[k],
                    map: newMap,
                    animation: maps.Animation.DROP,
                  });
                  newMarkers.push(marker);
                  setMarkers(newMarkers);

                  bounds.extend(marker.getPosition()); // extend the bounds to include the new marker's position
                  newMap.fitBounds(bounds); // auto zoom the map to fit all markers

                  k++;
                  if (k === locations.length) {
                    clearInterval(markerInterval);
                  }
                }
              }, 1000);
            }

            j++;
          }
        }, 1000);
      }
    };
    document.body.appendChild(script);
  }, [locations, isPaused]);

  const handlePauseResumeClick = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused);
  };

  return (
    <div>
      <div id="map" style={{ height: "500px", width: "100%" }} />

      <button onClick={handlePauseResumeClick}>{isPaused ? "Resume" : "Pause"}</button>
    </div>
  );
}

export default Map;



