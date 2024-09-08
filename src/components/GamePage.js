import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

const GamePage = () => {
  const [selectedImage] = useState('https://commonreader.wustl.edu/wp-content/uploads/2023/10/whereswaldo-shutterstock.jpg');
  const [target, setTarget] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [characters] = useState(['Waldo', 'Wizard', 'Wilma']);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showHighScoreModal, setShowHighScoreModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 10));
      }, 10);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, startTime]);

  const formatTime = (time) => {
    const seconds = Math.floor((time % 6000) / 100);
    const milliseconds = time % 100;
    return `${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleImageClick = useCallback((event) => {
    if (!isTimerRunning) return;
    const { offsetX, offsetY } = event.nativeEvent;
    setTarget({ x: offsetX, y: offsetY });
    setMenuVisible(true);
  }, [isTimerRunning]);

  const handleCharacterSelect = useCallback(async (character) => {
    setSelectedCharacter(character);
    setMenuVisible(false);

    if (!target) return;

    try {
      const response = await fetch('https://photo-tagging-backend.onrender.com/api/characters/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: character,
          xPosition: target.x,
          yPosition: target.y,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setFeedback('Correct!');
        setMarkers(prevMarkers => [...prevMarkers, { character, x: target.x, y: target.y }]);

        if (markers.length + 1 === characters.length) {
          setIsTimerRunning(false);
          setEndTime(Date.now());
          setShowHighScoreModal(true);
        }
      } else {
        setFeedback('Incorrect, try again.');
      }
    } catch (error) {
      console.error('Validation error', error);
    }
  }, [target, characters, markers]);

  const handleSaveScore = useCallback(async () => {
    if (scoreSaved) return;

    try {
      await fetch('https://photo-tagging-backend.onrender.com/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName,
          time: (endTime - startTime),
        }),
      });
      setScoreSaved(true);
      setShowHighScoreModal(false);
      navigate('/scoreboard');
    } catch (error) {
      console.error('Error saving score', error);
    }
  }, [endTime, startTime, playerName, navigate, scoreSaved]);

  const handleStartGame = () => {
    setStartTime(Date.now());
    setIsTimerRunning(true);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex justify-center items-center">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-800 dark:text-yellow-400">Find the Characters!</h1>
        
        {gameStarted ? (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex space-x-2">
              {characters.map((char, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    markers.some(m => m.character === char)
                      ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200'
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={handleStartGame}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 my-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Start Game
          </button>
        )}

        <div className="relative" style={{ width: '600px', height: '400px', margin: '0 auto' }}>
          <img
            src={selectedImage}
            alt="game"
            onClick={handleImageClick}
            className="w-full h-full object-cover cursor-crosshair"
          />

          {target && menuVisible && (
            <div
              style={{
                position: 'absolute',
                top: target.y - 10,
                left: target.x - 10,
              }}
              className="border-2 border-yellow-500 w-5 h-5 rounded-full"
            >
              <select
                onChange={(e) => handleCharacterSelect(e.target.value)}
                defaultValue=""
                className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-gray-200"
              >
                <option value="" disabled>Select Character</option>
                {characters.map((char, index) => (
                  <option key={index} value={char}>{char}</option>
                ))}
              </select>
            </div>
          )}

          {markers.map((marker, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: marker.y - 10,
                left: marker.x - 10,
              }}
              className="bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800"
            ></div>
          ))}
        </div>

        {feedback && (
          <div className={`mt-4 p-2 rounded ${feedback === 'Correct!' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'}`}>
            {feedback}
          </div>
        )}
      </div>

      {showHighScoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Congratulations!</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">You found all characters in {formatTime(elapsedTime)}.</p>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowHighScoreModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveScore}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded transition duration-300"
              >
                Save Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;