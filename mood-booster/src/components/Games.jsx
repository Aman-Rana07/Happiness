import { useState, useEffect } from 'react';
import '../styles/Games.css';

// --- GAME 1: Memory Game ---
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

  const resetGame = () => {
     setMatched([]);
     setFlipped([]);
     setMoves(0);
     setCards(shuffleArray([...cards]));
  }

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
          <button onClick={resetGame} className="restart-game-btn">
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

// --- GAME 2: Tic-Tac-Toe (Against the Bot) ---
const TicTacToeGame = ({ onClose }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null); // '🌟', '🤖', 'Draw', or null

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) return 'Draw';
    return null;
  };

  const handleClick = (index) => {
    // Prevent clicking if the spot is taken, game is over, or it's the bot's turn
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = '🌟'; // Player is the Star
    setBoard(newBoard);

    const currentWinner = checkWinner(newBoard);
    if (currentWinner) {
      setWinner(currentWinner);
    } else {
      setIsPlayerTurn(false); // Hand turn to bot
    }
  };

  // Bot logic
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        const emptyIndices = board
          .map((val, idx) => (val === null ? idx : null))
          .filter((val) => val !== null);
          
        if (emptyIndices.length > 0) {
          const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const newBoard = [...board];
          newBoard[randomIdx] = '🤖'; // Bot is the Robot
          setBoard(newBoard);
          
          const currentWinner = checkWinner(newBoard);
          if (currentWinner) {
            setWinner(currentWinner);
          }
        }
        setIsPlayerTurn(true);
      }, 600); // 0.6 second delay to feel like the bot is "thinking"
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="game-modal">
      <div className="game-content">
        <div className="game-header">
          <h3>⭕ Tic-Tac-Toe</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        
        <div className="game-stats" style={{ textAlign: 'center', margin: '15px 0' }}>
          <p style={{ fontWeight: 'bold', color: '#667eea' }}>
            {winner === '🌟' ? 'You Won! 🎉' 
              : winner === '🤖' ? 'Think Bot Wins! 🤖' 
              : winner === 'Draw' ? "It's a Draw! 🤝" 
              : isPlayerTurn ? 'Your Turn (🌟)' 
              : 'Think Bot is thinking...'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          maxWidth: '300px',
          margin: '0 auto 20px auto'
        }}>
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              style={{
                height: '90px',
                fontSize: '3rem',
                backgroundColor: '#f7fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                cursor: (cell || winner || !isPlayerTurn) ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
            >
              {cell}
            </button>
          ))}
        </div>

        {winner && (
          <div style={{ textAlign: 'center' }}>
            <button onClick={resetGame} className="start-game-btn" style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- GAME 3: Word Guess (Upgraded with Hints & Meanings) ---
const WordGuessGame = ({ onClose }) => {
  const wordDictionary = [
    { word: 'happiness', hint: 'A feeling of joy.', meaning: 'A state of well-being, contentment, and positive energy.' },
    { word: 'mindfulness', hint: 'Being present in the moment.', meaning: 'Focusing one’s awareness on the present moment while calmly acknowledging feelings and thoughts.' },
    { word: 'gratitude', hint: 'Saying thank you.', meaning: 'The quality of being thankful and showing appreciation for what you have.' },
    { word: 'serenity', hint: 'Calm and peaceful.', meaning: 'The state of being calm, peaceful, and entirely untroubled.' },
    { word: 'wellness', hint: 'Good health.', meaning: 'The state of being in good health, especially as an actively pursued goal.' },
    { word: 'healing', hint: 'Getting better.', meaning: 'The process of making or becoming sound or healthy again, physically or mentally.' },
    { word: 'peace', hint: 'No conflict.', meaning: 'Freedom from disturbance; a state of tranquility.' },
    { word: 'harmony', hint: 'Working together nicely.', meaning: 'The quality of forming a pleasing and consistent whole.' },
    { word: 'breathe', hint: 'Inhale and exhale.', meaning: 'To take air into the lungs and expel it; a grounding exercise to reduce stress.' },
    { word: 'relax', hint: 'Take it easy.', meaning: 'To rest and allow tension to fade away from the mind and body.' },
    { word: 'smile', hint: 'A happy face.', meaning: 'A pleased, kind, or amused facial expression that can instantly boost your mood.' },
    { word: 'laugh', hint: 'A funny reaction.', meaning: 'A spontaneous sound expressing lively amusement or joy.' },
    { word: 'optimism', hint: 'Looking on the bright side.', meaning: 'Hopefulness and confidence about the future or the successful outcome of something.' },
    { word: 'resilient', hint: 'Bouncing back.', meaning: 'The ability to withstand or recover quickly from difficult conditions.' },
    { word: 'journal', hint: 'Writing your thoughts.', meaning: 'A daily record of personal news and events, highly effective for processing emotions.' }
  ];

  const [currentWordObj, setCurrentWordObj] = useState(
    wordDictionary[Math.floor(Math.random() * wordDictionary.length)]
  );
  
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState(0);

  const targetWord = currentWordObj.word;
  const targetHint = currentWordObj.hint;
  const targetMeaning = currentWordObj.meaning;

  const won = targetWord.split('').every((l) => guessed.includes(l));
  const lost = wrong >= 6;

  const handleGuess = (letter) => {
    if (guessed.includes(letter) || won || lost) return;
    
    setGuessed([...guessed, letter]);

    if (!targetWord.includes(letter)) {
      setWrong(wrong + 1);
    }
  };

  const resetGame = () => {
      setCurrentWordObj(wordDictionary[Math.floor(Math.random() * wordDictionary.length)]);
      setGuessed([]);
      setWrong(0);
  }

  return (
    <div className="game-modal">
      <div className="game-content">
        <div className="game-header">
          <h3>🔤 Word Guess</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        
        <div className="game-stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
          <p style={{ fontWeight: 'bold', color: '#e53e3e' }}>Wrong Guesses: {wrong}/6</p>
        </div>

        <div style={{ background: '#f0f4f8', padding: '15px', borderRadius: '8px', margin: '15px 0', fontStyle: 'italic', color: '#4a5568' }}>
          💡 <strong>Hint:</strong> {targetHint}
        </div>
        
        <div className="word-display" style={{fontSize: "2rem", letterSpacing: "10px", textAlign: "center", margin: "20px 0"}}>
          {targetWord.split('').map((letter, i) => (
            <span key={i} className="word-letter" style={{ borderBottom: '3px solid #cbd5e0', paddingBottom: '5px' }}>
              {guessed.includes(letter) || lost ? letter : '_'}
            </span>
          ))}
        </div>
        
        <div className="alphabet" style={{display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center"}}>
          {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => {
            const isGuessed = guessed.includes(letter);
            const isCorrect = isGuessed && targetWord.includes(letter);
            const isWrong = isGuessed && !targetWord.includes(letter);
            
            return (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={isGuessed || won || lost}
                className="letter-btn"
                style={{
                  padding: "10px", 
                  width: "40px", 
                  borderRadius: '5px',
                  border: '1px solid #e2e8f0',
                  fontWeight: 'bold',
                  cursor: isGuessed ? 'not-allowed' : 'pointer',
                  backgroundColor: isCorrect ? '#48bb78' : isWrong ? '#f56565' : '#edf2f7',
                  color: isGuessed ? 'white' : '#2d3748',
                  opacity: isGuessed ? 0.8 : 1
                }}
              >
                {letter}
              </button>
            )
          })}
        </div>
        
        <div style={{textAlign: "center", marginTop: "20px"}}>
            {won && <p className="win-text" style={{color: "green", fontWeight: "bold", fontSize: "1.2rem"}}>You Won! 🎉</p>}
            {lost && <p className="lose-text" style={{color: "red", fontWeight: "bold", fontSize: "1.2rem"}}>Game Over! 😢 The word was: {targetWord}</p>}
            
            {(won || lost) && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#e6fffa', borderRadius: '8px', border: '1px solid #319795', color: '#234e52', textAlign: 'left' }}>
                <strong>📖 Meaning:</strong> {targetMeaning}
              </div>
            )}

            {(won || lost) && (
              <button onClick={resetGame} className="start-game-btn" style={{ marginTop: '20px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Play Again
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
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

        <div className="game-card" onClick={() => setActiveGame('tictactoe')}>
          <div className="game-icon">⭕</div>
          <h3>Tic-Tac-Toe</h3>
          <p>Play a classic, relaxing game against Think</p>
        </div>

        <div className="game-card" onClick={() => setActiveGame('wordguess')}>
          <div className="game-icon">🔤</div>
          <h3>Word Guess</h3>
          <p>Guess the hidden wellness word</p>
        </div>
      </div>

      {activeGame === 'memory' && <MemoryGame onClose={() => setActiveGame(null)} />}
      {activeGame === 'tictactoe' && <TicTacToeGame onClose={() => setActiveGame(null)} />}
      {activeGame === 'wordguess' && <WordGuessGame onClose={() => setActiveGame(null)} />}
    </div>
  );
};