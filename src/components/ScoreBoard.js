import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

const ScoreBoard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('https://photo-tagging-backend.onrender.com/api/scores');
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error('Error fetching scores', error);
      }
    };

    fetchScores();
  }, []);

  const getTrophyIcon = (index) => {
    const colors = ['text-yellow-500', 'text-gray-400', 'text-orange-500'];
    if (index < 3) {
      return <Trophy className={`w-6 h-6 ${colors[index]} mr-2`} />;
    }
    return null;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Scoreboard</h1>
        <ol className="space-y-3">
          {scores.map((score, index) => (
            <li
              key={score.id}
              className={`flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 ${
                index < 3 ? 'text-lg font-semibold' : 'text-base'
              }`}
            >
              <span className={`text-gray-600 dark:text-gray-300 font-semibold w-8 text-right ${
                index < 3 ? 'text-xl' : 'text-base'
              }`}>
                {index + 1}.
              </span>
              {getTrophyIcon(index)}
              <div className="flex-grow">
                <span className={`font-medium ${index < 3 ? 'text-lg' : 'text-base'} text-gray-800 dark:text-gray-200`}>
                  {score.name}
                </span>
              </div>
              <span className={`text-gray-700 dark:text-gray-400 ${
                index < 3 ? 'text-lg' : 'text-base'
              }`}>
                {(score.time / 1000).toFixed(2)}s
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default ScoreBoard;
