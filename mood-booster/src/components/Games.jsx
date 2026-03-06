import { useState } from 'react';
import '../styles/Games.css';

const MemoryGame = ({ onClose }) => {
  const [cards, setCards] = useState(
    shuffleArray([
      { id: 1, emoji: '😊', matched: false },
      { id: 2, emoji: '😊', matched: false },
      { id: 3, emoji: '😂', matched: false },
      { id: 4, emoji: '😂', matched: false },
      { id: 5, emoji: '😍', matched: false },
      { id: 6, emoji: '😍', matched: false },
      { id: 7, emoji: '🤔', matched: false },
      { id: 8, emoji: '🤔', matched: false },
      { id: 9, emoji: '😎', matched: false },
      { id: 10, emoji: '😎', matched: false },
      { id: 11, emoji: '🥳', matched: false },
      { id: 12, emoji: '🥳', matched: false },
    ])
  );
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  const handleFlip = (index) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const isComplete = matched.length === cards.length;

  return (
    <div className="game-modal">
      <div className="game-content">
        <div className="game-header">
          <h3>🎮 Memory Game</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="game-stats">
          <p>Moves: {moves}</p>
          {isComplete && <p className="win-text">You Won! 🎉</p>}
        </div>
        <div className="memory-grid">
          {cards.map((card, index) => (
            <button
              key={index}
              className={`memory-card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''}`}
              onClick={() => handleFlip(index)}
            >
              {flipped.includes(index) || matched.includes(index) ? card.emoji : '?'}
            </button>
          ))}
        </div>
        {isComplete && (
          <button onClick={() => window.location.reload()} className="restart-game-btn">
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

const QuickClickGame = ({ onClose }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [highScore, setHighScore] = useState(localStorage.getItem('quickClickHighScore') || 0);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
  };

  const handleClick = () => {
    if (gameActive) {
      setScore(score + 1);
    }
  };

  const endGame = () => {
    setGameActive(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('quickClickHighScore', score);
    }
  };

  useState(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    if (timeLeft === 1) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive]);

  return (
    <div className="game-modal">
      <div className="game-content">
        <div className="game-header">
          <h3>⚡ Quick Click</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="game-stats">
          <p>Score: {score} | Time: {timeLeft}s</p>
          <p>High Score: {highScore}</p>
        </div>
        {!gameActive ? (
          <button onClick={startGame} className="start-game-btn">
            Start Game
          </button>
        ) : (
          <button onClick={handleClick} className="click-target">
            CLICK ME!
          </button>
        )}
      </div>
    </div>
  );
};

const WordGuessGame = ({ onClose }) => {
  const words = ['happiness', 'mindfulness', 'gratitude', 'serenity', 'wellness', 'healing', 'peace'];
  const [word] = useState(words[Math.floor(Math.random() * words.length)]);
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = (letter) => {
    if (guessed.includes(letter)) return;
    setGuessed([...guessed, letter]);

    if (!word.includes(letter)) {
      setWrong(wrong + 1);
      if (wrong >= 5) {
        setGameOver(true);
      }
    }
  };

  const won = word.split('').every((l) => guessed.includes(l));
  const lost = wrong >= 6;

  return (
    <div className="game-modal">
      <div className="game-content">
        <div className="game-header">
          <h3>🔤 Word Guess</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="game-stats">
          <p>Wrong: {wrong}/6</p>
        </div>
        <div className="word-display">
          {word.split('').map((letter, i) => (
            <span key={i} className="word-letter">
              {guessed.includes(letter) ? letter : '_'}
            </span>
          ))}
        </div>
        <div className="alphabet">
          {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessed.includes(letter)}
              className="letter-btn"
            >
              {letter}
            </button>
          ))}
        </div>
        {won && <p className="win-text">You Won! 🎉 The word was: {word}</p>}
        {lost && <p className="lose-text">Game Over! 😢 The word was: {word}</p>}
      </div>
    </div>
  );
};

export const Games = () => {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="games-container">
      <h2>🎮 Mini Games for Fun & Relaxation</h2>
      <p className="games-subtitle">Take a break and enjoy some stress-relieving games!</p>

      <div className="games-grid">
        <div className="game-card" onClick={() => setActiveGame('memory')}>
          <div className="game-icon">🧠</div>
          <h3>Memory Game</h3>
          <p>Test your memory by matching emoji pairs</p>
        </div>

        <div className="game-card" onClick={() => setActiveGame('quickclick')}>
          <div className="game-icon">⚡</div>
          <h3>Quick Click</h3>
          <p>Click as many times as you can in 30 seconds</p>
        </div>

        <div className="game-card" onClick={() => setActiveGame('wordguess')}>
          <div className="game-icon">🔤</div>
          <h3>Word Guess</h3>
          <p>Guess the hidden wellness word</p>
        </div>
      </div>

      {activeGame === 'memory' && <MemoryGame onClose={() => setActiveGame(null)} />}
      {activeGame === 'quickclick' && <QuickClickGame onClose={() => setActiveGame(null)} />}
      {activeGame === 'wordguess' && <WordGuessGame onClose={() => setActiveGame(null)} />}
    </div>
  );
};
