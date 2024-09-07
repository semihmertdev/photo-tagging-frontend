import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import GamePage from './components/GamePage';
import Scoreboard from './components/ScoreBoard';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Footer bileşenini import ettik

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
          </Routes>
        </main>
        <Footer /> {/* Footer bileşenini burada ekliyoruz */}
      </div>
    </Router>
  );
}

export default App;
