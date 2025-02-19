import { useEffect, useRef, useState } from "react";
const url = import.meta.env.VITE_URL;

const VideoStream = () => {
    const canvasRef = useRef(null);
    const [status, setStatus] = useState("Connecting...");

    const [direction, setDirection] = useState("");
    const [videoUrl, setVideoUrl] = useState(""); 
    const intervalRef = useRef(null);  

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
    clearInterval(intervalRef.current); 
    intervalRef.current = null;
    };

    

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const socket = new WebSocket("wss://192.168.236.26:9999");
        socket.binaryType = "arraybuffer";

        let dataBuffer = new Uint8Array(0);

        socket.onopen = () => {
            console.log("✅ WebSocket Connected");
            setStatus("Connected");
        };

        socket.onmessage = (event) => {
            console.log("📩 Received Data:", event.data.byteLength, "bytes");

            const newData = new Uint8Array(event.data);
            dataBuffer = new Uint8Array([...dataBuffer, ...newData]);

            while (dataBuffer.length >= 8) {  
                const sizeData = new DataView(dataBuffer.buffer, 0, 8);
                const frameSize = Number(sizeData.getBigUint64(0, true));

                console.log("🎥 Processing Frame (Size: " + frameSize + " bytes)");

                if (dataBuffer.length >= 8 + frameSize) {
                    const frameData = dataBuffer.slice(8, 8 + frameSize);
                    dataBuffer = dataBuffer.slice(8 + frameSize);

                    console.log("🔍 First 10 Bytes:", frameData.slice(0, 10));

                    if (frameData[0] === 0xFF && frameData[1] === 0xD8) {
                        console.log("✅ Valid JPEG Detected");

                        const blob = new Blob([frameData], { type: "image/jpeg" });
                        const url = URL.createObjectURL(blob);
                        const img = new Image();
                        img.src = url;

                        img.onload = () => {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            URL.revokeObjectURL(url);
                        };

                        img.onerror = () => {
                            console.error("❌ Failed to load image. Possible corruption or format issue.");
                        };
                    } else {
                        console.error("🚨 Invalid JPEG frame detected, skipping...");
                    }
                } else {
                    console.log("⏳ Waiting for complete frame data...");
                    break;
                }
            }
        };

        socket.onclose = () => {
            console.log("❌ WebSocket Disconnected");
            setStatus("Disconnected");
        };

        socket.onerror = (error) => {
            console.error("⚠️ WebSocket Error:", error);
        };

        return () => socket.close();    
    }, []);

    return (
        <div className="container">
            <div className="video-container">
                <h2>Live Video Streaming</h2>
                <canvas ref={canvasRef} className="video-canvas"></canvas>
                <p>{status}</p>
                {videoUrl && <img src={videoUrl} alt="Video Feed" className="video-feed" />}
            </div>
            
            <div className="controls-container">
                <div className="buttons-container">
                <div className="row-buttons">
                    <button onMouseEnter={() => handleMouseEnter("u")} onMouseLeave={handleMouseLeave} className="btn">Up</button>
                    <button onMouseEnter={() => handleMouseEnter("d")} onMouseLeave={handleMouseLeave} className="btn">Down</button>
                </div>
                <div className="row-buttons">
                    <button onMouseEnter={() => handleMouseEnter("cw")} onMouseLeave={handleMouseLeave} className="btn">Left</button>
                    <button onMouseEnter={() => handleMouseEnter("ccw")} onMouseLeave={handleMouseLeave} className="btn">Right</button>
                </div>
                </div>
                <button onMouseEnter={() => handleMouseEnter("e")} onMouseLeave={handleMouseLeave} className="btn exit-btn">Exit</button>
                {direction && <p className="direction-text">Direction: {direction}</p>}
            </div>
        </div>
    );
};

export default VideoStream;
