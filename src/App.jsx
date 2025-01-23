import { useState } from "react";
import "./App.css";

function App() {
  const [direction, setDirection] = useState("");

  const handleClick = async (dir) => {
    setDirection(dir);
    try {
      const res = await fetch("https://6871-2409-40c4-15-c450-d1b1-d5fb-8c3-32df.ngrok-free.app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction: dir }),  
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Response data:", data);
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  return (
    <div className="app-container">
  <div className="buttons-container">
    <button onClick={() => handleClick("u")} className="btn">Up</button>
    <div className="horizontal-buttons">
      <button onClick={() => handleClick("l")} className="btn">Left</button>
      <button onClick={() => handleClick("d")} className="btn">Down</button>
      <button onClick={() => handleClick("r")} className="btn">Right</button>
    </div>
  </div>
  <button onClick={() => handleClick("e")} className="btn exit-btn">Exit</button>
  {direction && <p className="direction-text">Direction: {direction}</p>}
</div>

  );
}

export default App;
