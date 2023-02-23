import React, { useState } from "react";
import Map from "./Map";

function App() {
  
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
    coordinates: [],
  });
  const [finalLocation, setFinalLocation] = useState([]);
  function onSubmitHandler(e) {
    e.preventDefault();
    setLocation((prev) => {
      const newLocation = {
        lat: parseFloat(prev.lat),
        lng: parseFloat(prev.lng),
      };
      prev.coordinates.push(newLocation);
      prev.lat=0;
      prev.lng=0;
      return prev;
    });

  }
  return (
    <div>
      {finalLocation.length <= 0 && (
        <form onSubmit={onSubmitHandler}>
          <input
            type="text"
            name="lat"
            placeholder="latidude"
            value={location.lat}
            onChange={(e) => {
              setLocation((prev) => {
                const newLocation = { ...prev };
                newLocation.lat = e.target.value;
                return newLocation;
              });
            }}
          ></input>
          <input
            type="text"
            name="lng"
            placeholder="longitude"
            value={location.lng}
            onChange={(e) => {
              setLocation((prev) => {
                const newLocation = { ...prev };
                newLocation.lng = e.target.value;
                return newLocation;
              });
            }}
          ></input>
          <input type="submit" value="Add Location"></input>
        </form>
      )}
      {location.coordinates.length >= 2 && finalLocation.length <= 0 && (
        <button
          onClick={(e) => {
            setFinalLocation(location.coordinates);
          }}
        >
          submit
        </button>
      )}
      {finalLocation.length >= 1 && <Map locations={finalLocation} />}
    </div>
  );
}

export default App;
