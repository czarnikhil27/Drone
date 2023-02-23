import React, { useRef, useState } from "react";
import Map from "./Map";
import './App.css';

function App() {
  const latRef = useRef(null);
  const lngRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [isSend, setIsSend] = useState(false);
  const [file, setFile] = useState(false);


  const onSubmitHandler = e =>{
    e.preventDefault();
    console.log(locations);
    const lat = latRef.current.value;
    const lng = lngRef.current.value;
    setLocations(prev=>{
      const newLocation = [...prev];
      newLocation.push({"lat": parseFloat(lat), "lng":parseFloat(lng)});
      return newLocation;
    })
    latRef.current.value ="";
    lngRef.current.value="";
    
  }
  const onSendLocationHandler = e =>{
    e.preventDefault();
    if(locations.length>=2)
    {
      setIsSend(prev=>!prev);
    } 
  }
  const onFileHandler = e =>{
    
      setFile(prev=>!prev);
  }
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      reader.onload = (event) => {
        const jsonData = JSON.parse(event.target.result);
        setLocations(prev=>{
          return [...prev, ...jsonData];
        });
      };
    }
  };

  return (
    <div>
      { isSend === false &&
      <div className="toggle-btn" >
      <span className="toggle-btn-left"></span>
      <label className="toggle-btn-switch">
        <input type="checkbox" onClick={onFileHandler} />
        <span className="toggle-btn-slider"></span>
      </label>
      <span className="toggle-btn-right">Upload File</span>
    </div> }
    <br></br>
   { file === true && isSend===false &&
   <>
    <form>
    <input type="file" accept=".json" onChange={handleFileUpload} />
    </form>
    <br></br>
     <button onClick={onSendLocationHandler}>Submit</button>
     </>
    }

   {
   file===false && <>
    {isSend===false && <form onSubmit={onSubmitHandler}>
        <input type="text" placeholder="Latitude" ref={latRef} required></input>
        <input type="text" placeholder="Longitute" ref={lngRef} required></input>
        <input type="submit" value="Add the location"></input>
      </form>}
      <br></br>
      {isSend===false && locations.length>=2 && <button onClick={onSendLocationHandler}>Send to Google Map</button>}
      <br></br>

      
    </>
    }
    {isSend===true && locations.length>=2 && <Map locations={locations} />}
      
    </div>
  );

}
export default App;
