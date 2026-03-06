import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Questionnaire } from './Questionnaire';
import { MoodBar } from './MoodBar';
import { Journal } from './Journal';
import { ChatBot } from './ChatBot';
import { Games } from './Games';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const { user, logout, addMoodEntry } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('home');

  const handleQuickMood = (mood, score) => {
    addMoodEntry(mood, score);
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-header">
          <h1>🌟 Happiness Tracker</h1>
          <p>Welcome, {user?.username}!</p>
        </div>

        <div className="nav-buttons">
          <button
            onClick={() => setActiveTab('home')}
            className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          >
            🏠 Home
          </button>
          <button
            onClick={() => setActiveTab('questionnaire')}
            className={`nav-btn ${activeTab === 'questionnaire' ? 'active' : ''}`}
          >
            📋 Questionnaire
          </button>
          <button
            onClick={() => setActiveTab('moodbar')}
            className={`nav-btn ${activeTab === 'moodbar' ? 'active' : ''}`}
          >
            📊 Mood Tracker
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`nav-btn ${activeTab === 'journal' ? 'active' : ''}`}
          >
            📔 Journal
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`nav-btn ${activeTab === 'chatbot' ? 'active' : ''}`}
          >
            🤖 Think
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`nav-btn ${activeTab === 'games' ? 'active' : ''}`}
          >
            🎮 Games
          </button>
          <button onClick={logout} className="nav-btn logout-btn">
            🚪 Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'home' && (
          <div className="home-section">
            <div className="welcome-card">
              <h2>Welcome back, {user?.username}! 👋</h2>
              <p>How are you feeling today?</p>
            </div>

            <div className="quick-mood-buttons">
              <h3>Quick Mood Check-in</h3>
              <div className="mood-quick-grid">
                <button
                  onClick={() => {
                    handleQuickMood('Very Happy', 10);
                    alert('Mood recorded! 🎉');
                  }}
                  className="quick-mood-btn"
                >
                  🤩 Very Happy
                </button>
                <button
                  onClick={() => {
                    handleQuickMood('Happy', 8);
                    alert('Mood recorded! 😊');
                  }}
                  className="quick-mood-btn"
                >
                  😊 Happy
                </button>
                <button
                  onClick={() => {
                    handleQuickMood('Neutral', 5);
                    alert('Mood recorded! 😐');
                  }}
                  className="quick-mood-btn"
                >
                  😐 Neutral
                </button>
                <button
                  onClick={() => {
                    handleQuickMood('Sad', 3);
                    alert('Mood recorded! 😢');
                  }}
                  className="quick-mood-btn"
                >
                  😢 Sad
                </button>
                <button
                  onClick={() => {
                    handleQuickMood('Stressed', 2);
                    alert('Mood recorded! 😤');
                  }}
                  className="quick-mood-btn"
                >
                  😤 Stressed
                </button>
                <button
                  onClick={() => {
                    handleQuickMood('Relaxed', 7);
                    alert('Mood recorded! 😌');
                  }}
                  className="quick-mood-btn"
                >
                  😌 Relaxed
                </button>
              </div>
            </div>

            <div className="features-overview">
              <h3>Available Features</h3>
              <div className="features-grid">
                <div className="feature-card" onClick={() => setActiveTab('questionnaire')}>
                  <div className="feature-icon">📋</div>
                  <h4>Daily Questionnaire</h4>
                  <p>Complete a comprehensive wellness questionnaire to track your mental health.</p>
                </div>
                <div className="feature-card" onClick={() => setActiveTab('moodbar')}>
                  <div className="feature-icon">📊</div>
                  <h4>Mood Visualizer</h4>
                  <p>See your mood trends and patterns over time with beautiful charts.</p>
                </div>
                <div className="feature-card" onClick={() => setActiveTab('journal')}>
                  <div className="feature-icon">📔</div>
                  <h4>Journal</h4>
                  <p>Write journal entries and track your happiness score.</p>
                </div>
                <div className="feature-card" onClick={() => setActiveTab('chatbot')}>
                  <div className="feature-icon">🤖</div>
                  <h4>Think - AI Companion</h4>
                  <p>Chat with your AI companion for advice and support.</p>
                </div>
                <div className="feature-card" onClick={() => setActiveTab('games')}>
                  <div className="feature-icon">🎮</div>
                  <h4>Relaxing Games</h4>
                  <p>Take a break with fun, stress-relieving mini-games.</p>
                </div>
              </div>
            </div>

            <div className="stats-widget">
              <h3>Your Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Mood Entries</span>
                  <span className="stat-value">{user?.moodEntries?.length || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Journal Entries</span>
                  <span className="stat-value">{user?.journalEntries?.length || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Questionnaires</span>
                  <span className="stat-value">{user?.questionnaireResponses?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questionnaire' && <Questionnaire />}
        {activeTab === 'moodbar' && <MoodBar />}
        {activeTab === 'journal' && <Journal />}
        {activeTab === 'chatbot' && <ChatBot />}
        {activeTab === 'games' && <Games />}
      </main>
    </div>
  );
};
