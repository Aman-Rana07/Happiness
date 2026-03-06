import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/Journal.css';

export const Journal = () => {
  const { user, addJournalEntry } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [happinessScore, setHappinessScore] = useState(5);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      addJournalEntry(title, content, happinessScore);
      setTitle('');
      setContent('');
      setHappinessScore(5);
      setShowForm(false);
    }
  };

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h2>📔 My Journal</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`toggle-form-btn ${showForm ? 'active' : ''}`}
        >
          {showForm ? 'Cancel' : '+ New Entry'}
        </button>
      </div>

      {showForm && (
        <div className="journal-form-card">
          <form onSubmit={handleSubmit} className="journal-form">
            <div className="form-group">
              <label htmlFor="title">Entry Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind today?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Your Thoughts</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your journal entry here..."
                rows="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="score">Happiness Score: {happinessScore}/10</label>
              <div className="score-slider-container">
                <input
                  type="range"
                  id="score"
                  min="1"
                  max="10"
                  value={happinessScore}
                  onChange={(e) => setHappinessScore(parseInt(e.target.value))}
                  className="score-slider"
                />
                <div className="emoji-display">
                  {happinessScore <= 2 && '😔'}
                  {happinessScore === 3 && '😟'}
                  {happinessScore === 4 && '😕'}
                  {happinessScore === 5 && '😐'}
                  {happinessScore === 6 && '🙂'}
                  {happinessScore === 7 && '😊'}
                  {happinessScore === 8 && '😄'}
                  {happinessScore === 9 && '😄'}
                  {happinessScore === 10 && '🎉'}
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Save Entry
            </button>
          </form>
        </div>
      )}

      <div className="entries-section">
        {user && user.journalEntries && user.journalEntries.length > 0 ? (
          <div className="entries-list">
            {user.journalEntries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <h3>{entry.title}</h3>
                  <div className="entry-meta">
                    <span className="happiness-badge">
                      {entry.happinessScore}/10
                    </span>
                    <span className="entry-date">
                      {new Date(entry.timestamp).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <p className="entry-content">{entry.content}</p>
                <div className="entry-emoji">
                  {entry.happinessScore <= 2 && '😔'}
                  {entry.happinessScore === 3 && '😟'}
                  {entry.happinessScore === 4 && '😕'}
                  {entry.happinessScore === 5 && '😐'}
                  {entry.happinessScore === 6 && '🙂'}
                  {entry.happinessScore === 7 && '😊'}
                  {entry.happinessScore === 8 && '😄'}
                  {entry.happinessScore === 9 && '😄'}
                  {entry.happinessScore === 10 && '🎉'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-entries">
            <p>No journal entries yet. Start writing to track your journey! 📝</p>
          </div>
        )}
      </div>
    </div>
  );
};
