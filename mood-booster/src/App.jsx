// src/App.jsx
import { useState } from 'react'
import './App.css'

function App() {
  // State for current mood
  const [mood, setMood] = useState("Neutral");
  // State for mood history
  const [history, setHistory] = useState([]);

  // Function to change mood and add to history
  const changeMood = (newMood) => {
    setMood(newMood);
    const timestamp = new Date().toLocaleString();
    setHistory(prev => [{ mood: newMood, time: timestamp }, ...prev.slice(0, 9)]); // Keep last 10
  };

  // Get a positive message based on mood
  const getMessage = (mood) => {
    const messages = {
      Happy: "Keep smiling! 😊",
      Sad: "It's okay to feel sad. Better days are coming. 🌈",
      Stressed: "Take a deep breath. You've got this! 🧘",
      Bored: "Try something new today! 🚀",
      Excited: "Channel that energy! ⚡",
      Relaxed: "Enjoy the calm. ☕",
      Angry: "Breathe and let it go. 🌬️",
      Neutral: "A balanced mood is great! ⚖️"
    };
    return messages[mood] || "How are you feeling?";
  };

  return (
    <div className="app-container">
      <header>
        <h1>Mood Booster</h1>
        <p className="subtitle">Track and improve your daily mood</p>
      </header>

      <div className="current-mood">
        <h2>Current Mood: <span className="mood-display">{mood}</span></h2>
        <p className="message">{getMessage(mood)}</p>
      </div>
      
      <div className="button-container">
        <h3>How are you feeling?</h3>
        <div className="buttons-grid">
          <button onClick={() => changeMood("Happy")} className="mood-btn happy">😃 Happy</button>
          <button onClick={() => changeMood("Sad")} className="mood-btn sad">😢 Sad</button>
          <button onClick={() => changeMood("Stressed")} className="mood-btn stressed">😤 Stressed</button>
          <button onClick={() => changeMood("Bored")} className="mood-btn bored">🥱 Bored</button>
          <button onClick={() => changeMood("Excited")} className="mood-btn excited">🤩 Excited</button>
          <button onClick={() => changeMood("Relaxed")} className="mood-btn relaxed">😌 Relaxed</button>
          <button onClick={() => changeMood("Angry")} className="mood-btn angry">😠 Angry</button>
          <button onClick={() => changeMood("Neutral")} className="mood-btn neutral">😐 Neutral</button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="history-section">
          <h3>Mood History</h3>
          <ul className="history-list">
            {history.map((entry, index) => (
              <li key={index} className="history-item">
                <span className="history-mood">{entry.mood}</span>
                <span className="history-time">{entry.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App