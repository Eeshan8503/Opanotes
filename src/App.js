import React, { useState } from "react";
import './app.css';
import isElectron from "is-electron";
const { ipcRenderer } = window.require("electron");

function App() {
  const [opacity, setopacity] = useState(10);
  const [temp, settemp] = useState(false);
  const [state, setstate] = useState(null);
  function abcdd(event){
    event.preventDefault();
    if (isElectron()) {
      console.log(document.getElementById('file').files[0].path);
      ipcRenderer.send("file:sent", document.getElementById('file').files[0].path);
    }
  }
  ipcRenderer.on("hello",(event,cont)=>{
      console.log("cont is "+cont);
      setstate(cont);
      settemp(true);
  })
  function handler(event){
    console.log(event.target.value);
    setopacity((event.target.value)/100);

  }
  function closer(){
    ipcRenderer.send(closer,true);
  }
  return (
    <>
    {!temp?
    <div style={{backgroundColor:"#E0c9A6", height:"500px",width:"500px"}} className="draggable">
    <h1 className="headding">OPANOTES</h1>
    <form onSubmit={abcdd}>
          <label className="label">Choose file</label><br/>
          <input className="chooser" type="file" id="file" accept=".txt" required /><br/>
          <input className="btn" type="submit" id='btn' value="submit" />
        </form>
    </div>
    :
    <div>
    <input style={{backgroundColor:"#E0C9A6"}} type="range" min="1" max="100"  class="slider" id="myRange" onChange={handler}/>
    <div style={{opacity:opacity, backgroundColor:"#E0C9A6"}}>
    <h1>{state}</h1>
    <h1 onClick={closer} className="close">close</h1>
    </div>
    </div>}
    </>
  );
}

export default App;
