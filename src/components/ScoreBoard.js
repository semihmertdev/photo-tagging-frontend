import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function ScoreBoard() {
    
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get('https://photo-tagging-backend.onrender.com/api/scores');
        setScores(response.data);
      } catch (error) {
        console.error('Error fetching scores', error);
      }
    };

    fetchScores();
  }, []);
  

  return (
    <div>
      <h1>Scoreboard</h1>
      <ol>
        {scores.map((score) => (
          <li key={score.id}>
            {score.name}: {score.time / 1000}s
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ScoreBoard;
