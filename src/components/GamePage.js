import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GamePage() {
  const [selectedImage] = useState('https://commonreader.wustl.edu/wp-content/uploads/2023/10/whereswaldo-shutterstock.jpg'); // Tek bir fotoğraf
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

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 10)); // milisaniyeleri saniyeye çevir
      }, 10); // milisaniyede bir güncelle
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, startTime]);

  const formatTime = (time) => {
    const seconds = Math.floor((time % 6000) / 100);
    const milliseconds = time % 100;
    return `${seconds}s ${milliseconds}ms`;
  };

  const handleStartGame = () => {
    setStartTime(Date.now());
    setIsTimerRunning(true);
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
      const response = await axios.post('http://localhost:5000/api/characters/validate', {
        characterName: character,
        xPosition: target.x,
        yPosition: target.y,
      });

      if (response.data.success) {
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
    try {
      await axios.post('http://localhost:5000/api/scores', {
        name: playerName,
        time: (endTime - startTime), // Süreyi milisaniye cinsinden gönderiyoruz
      });
      setShowHighScoreModal(false);
      navigate('/scoreboard');
    } catch (error) {
      console.error('Error saving score', error);
    }
  }, [endTime, startTime, playerName, navigate]);

  return (
    <div>
      {!startTime ? (
        <div>
          <h1>Start the Game</h1>
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      ) : (
        <div>
          <h1>Find the Character!</h1>
          <p>Elapsed Time: {formatTime(elapsedTime)}</p>
          <div style={{ position: 'relative', width: '600px', height: '400px', margin: '0 auto' }}>
            <img
              src={selectedImage}
              alt="game"
              onClick={handleImageClick}
              style={{ width: '100%', height: '100%' }}
            />

            {target && menuVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: target.y - 10,
                  left: target.x - 10,
                  border: '2px solid red',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                }}
              >
                <select
                  onChange={(e) => handleCharacterSelect(e.target.value)}
                  defaultValue=""
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
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
                  background: 'green',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                }}
              ></div>
            ))}

            {feedback && <p>{feedback}</p>}
          </div>

          {showHighScoreModal && (
            <div className="modal">
              <p>Congratulations! You found all characters in {formatTime(elapsedTime)}.</p>
              <p>Enter your name to save your score:</p>
              <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
              <button onClick={handleSaveScore}>Save Score</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GamePage;
