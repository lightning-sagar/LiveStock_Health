import { useState, useRef, useEffect } from "react";
import "../App.css"
const url = import.meta.env.VITE_URL;

function Move() {
  const [direction, setDirection] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // Store the video feed URL
  const intervalRef = useRef(null); // To store the interval ID

  const handleMouseEnter = (dir) => {
    setDirection(dir);
    intervalRef.current = setInterval(async () => {
      console.log(dir)
      const BaseUrl = `https://${url}.ngrok-free.app/`;
      console.log(BaseUrl)
      try {
        const res = await fetch(
          BaseUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ direction: dir }),
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Response data:", data);
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }, 500); // Send request every 500ms
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current); // Clear the interval
    intervalRef.current = null;
  };

  return (
    <div className="app-container">
      <div className="buttons-container">
        <button
          onMouseEnter={() => handleMouseEnter("u")}
          onMouseLeave={handleMouseLeave}
          className="btn"
        >
          Up
        </button>
        <div className="horizontal-buttons">
          <button
            onMouseEnter={() => handleMouseEnter("cw")}
            onMouseLeave={handleMouseLeave}
            className="btn"
          >
            Left
          </button>
          <button
            onMouseEnter={() => handleMouseEnter("d")}
            onMouseLeave={handleMouseLeave}
            className="btn"
          >
            Down
          </button>
          <button
            onMouseEnter={() => handleMouseEnter("ccw")}
            onMouseLeave={handleMouseLeave}
            className="btn"
          >
            Right
          </button>
        </div>
      </div>
       
      <button
        onMouseEnter={() => handleMouseEnter("e")}
        onMouseLeave={handleMouseLeave}
        className="btn exit-btn"
      >
        Exit
      </button>
      {direction && <p className="direction-text">Direction: {direction}</p>}
      
      {/* Render the video feed */}
      {videoUrl && (
        <div>
          <h2>Live Video Feed:</h2>
          <img
            src={videoUrl}
            alt="Video Feed"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
}

export default Move;