import { useState } from "react";
import "./App.css";

function App() {
  const [direction, setDirection] = useState("");

  const handleClick = async (dir) => {
    setDirection(dir);
    try {
      const res = await fetch("http://localhost:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction: dir }), // Send the correct data structure
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
        <button onClick={() => handleClick("up")}>Up</button>
        <div className="horizontal-buttons">
          <button onClick={() => handleClick("left")}>Left</button>
          <button onClick={() => handleClick("down")}>Down</button>
          <button onClick={() => handleClick("right")}>Right</button>
        </div>
      </div>
      {direction && <p>Direction: {direction}</p>}
    </div>
  );
}

export default App;
