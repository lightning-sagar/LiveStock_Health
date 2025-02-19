import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Move from './pages/Move.jsx';
import VideoStream from './pages/VideoStream.jsx';

const App = () => {
 
  return (
    <Router>
        <Routes>
          <Route path="/" element={<VideoStream />} />
          <Route path="/move" element={<Move />} />
        </Routes>
    </Router>
  );
};

export default App;
