import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [target, setTarget] = useState(null); // Tıklanan koordinatlar
  const [menuVisible, setMenuVisible] = useState(false); // Menü görünürlüğü
  const [characters, setCharacters] = useState(['Waldo', 'Wizard', 'Wilma']); // Karakter listesi
  const [selectedCharacter, setSelectedCharacter] = useState(null); // Seçilen karakter
  const [feedback, setFeedback] = useState(null); // Doğru/yanlış geri bildirimi
  const [markers, setMarkers] = useState([]); // İşaretleyiciler
  const [startTime, setStartTime] = useState(Date.now()); // Zaman başlatıcı
  const [endTime, setEndTime] = useState(null); // Zaman bitirici
  const [showHighScoreModal, setShowHighScoreModal] = useState(false); // Skor kaydetme modalı
  const [playerName, setPlayerName] = useState(''); // Oyuncu ismi

  useEffect(() => {
    // Sayfa yüklendiğinde zaman başlatılır
    setStartTime(Date.now());
  }, []);

  // Resme tıklanınca hedefleme kutusunu oluştur
  const handleImageClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setTarget({ x: offsetX, y: offsetY });
    setMenuVisible(true); // Menü görünür olur
  };

  // Kullanıcı karakter seçtiğinde doğrulama isteği yap
  const handleCharacterSelect = async (character) => {
    setSelectedCharacter(character);
    setMenuVisible(false);
  
    console.log('Selected Character:', character);
    console.log('Target Coordinates:', target);
  
    try {
      const response = await axios.post('http://localhost:5000/api/characters/validate', {
        characterName: character,
        xPosition: target.x,
        yPosition: target.y,
      });
  
      console.log('Validation Response:', response.data);
  
      if (response.data.success) {
        setFeedback('Correct!');
        setMarkers((prevMarkers) => [...prevMarkers, { character, x: target.x, y: target.y }]);
  
        // Tüm karakterler bulunduysa oyunu bitir
        if (markers.length + 1 === characters.length) {
          setEndTime(Date.now());
          setShowHighScoreModal(true); // Skor kaydetme modali açılır
        }
      } else {
        setFeedback('Incorrect, try again.');
      }
    } catch (error) {
      console.error('Validation error', error);
    }
  };
  

  // Skoru kaydetme fonksiyonu
  const handleSaveScore = async () => {
    try {
      await axios.post('http://localhost:5000/api/highscores', {
        name: playerName,
        score: (endTime - startTime) / 1000,
      });
      setShowHighScoreModal(false);
    } catch (error) {
      console.error('Error saving score', error);
    }
  };

  return (
    <div>
      <h1>Find the Character!</h1>
      <div style={{ position: 'relative', width: '600px', height: '400px', margin: '0 auto' }}>
        <img
          src="https://commonreader.wustl.edu/wp-content/uploads/2023/10/whereswaldo-shutterstock.jpg" // Resmin URL'sini buraya koyun
          alt="game"
          onClick={handleImageClick}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Tıklanan yere hedefleme kutusu ve açılır menü */}
        {target && menuVisible && (
          <div
            style={{
              position: 'absolute',
              top: target.y,
              left: target.x,
              border: '2px solid red',
              width: '50px',
              height: '50px',
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
              <option value="" disabled>
                Select Character
              </option>
              {characters.map((char, index) => (
                <option key={index} value={char}>
                  {char}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Doğru tıklanan yerlerde işaretleyici */}
        {markers.map((marker, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: marker.y,
              left: marker.x,
              background: 'green',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
            }}
          ></div>
        ))}

        {/* Geri bildirim (Doğru ya da yanlış) */}
        {feedback && <p>{feedback}</p>}

        {/* Eğer doğruysa anında işaretleyici ekle */}
        {feedback === 'Correct!' && (
          <div
            style={{
              position: 'absolute',
              top: target.y,
              left: target.x,
              background: 'green',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
            }}
          ></div>
        )}
      </div>

      {/* Zamanı gösterme */}
      {endTime && (
        <p>Congratulations! You found all characters in {(endTime - startTime) / 1000} seconds.</p>
      )}

      {/* Skor kaydetme modalı */}
      {showHighScoreModal && (
        <div className="modal">
          <p>Enter your name to save your score:</p>
          <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <button onClick={handleSaveScore}>Save Score</button>
        </div>
      )}
    </div>
  );
}

export default App;
