// src/App.jsx
import { useState } from 'react'
import './App.css'

function App() {
  // State for current mood
  const [mood, setMood] = useState("Neutral");
  // State for mood history
  const [history, setHistory] = useState([]);

  // Resources for each mood (2 links per mood)
  const resources = {
    Happy: [
      { url: "https://www.actionforhappiness.org/10-keys", name: "10 Keys to Happiness" },
      { url: "https://quickdraw.withgoogle.com/", name: "Quick Draw" }
    ],
    Sad: [
      { url: "https://www.helpguide.org/articles/depression/coping-with-depression.htm", name: "Coping with Depression" },
      { url: "https://www.window-swap.com/", name: "Window Swap" }
    ],
    Stressed: [
      { url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/stress/", name: "Understanding Stress" },
      { url: "https://asoftmurmur.com/", name: "A Soft Murmur" }
    ],
    Bored: [
      { url: "https://www.verywellmind.com/how-to-cope-with-boredom-4178312", name: "Coping with Boredom" },
      { url: "https://skribbl.io/", name: "Skribbl.io" }
    ],
    Excited: [
      { url: "https://www.psychologytoday.com/us", name: "Psychology Today" },
      { url: "https://www.geoguessr.com/", name: "GeoGuessr" }
    ],
    Relaxed: [
      { url: "https://www.calm.com/blog", name: "Calm Blog" },
      { url: "https://thisissand.com/", name: "This is Sand" }
    ],
    Angry: [
      { url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434", name: "Anger Management" },
      { url: "https://littlealchemy2.com/", name: "Little Alchemy 2" }
    ],
    Neutral: [
      { url: "https://tinybuddha.com/", name: "Tiny Buddha" },
      { url: "https://adarkroom.doublespeakgames.com/", name: "A Dark Room" }
    ]
  };

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

  // Get a random resource link for the current mood
  const getRandomResource = () => {
    const moodResources = resources[mood];
    if (!moodResources) return null;
    return moodResources[Math.floor(Math.random() * moodResources.length)];
  };

  return (
    <div className="app-container">
      <a href="/" className="back-button">← Back</a>

      <header>
        <h1>Mood Booster</h1>
        <p className="subtitle">Track and improve your daily mood</p>
      </header>

      <div className="current-mood">
        <h2>Current Mood: <span className="mood-display">{mood}</span></h2>
        <p className="message">{getMessage(mood)}</p>
        {getRandomResource() && (
          <a href={getRandomResource().url} target="_blank" rel="noopener noreferrer" className="resource-link">
            💡 {getRandomResource().name}
          </a>
        )}
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