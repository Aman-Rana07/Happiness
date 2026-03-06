import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/MoodBar.css';

export const MoodBar = () => {
  const { user } = useContext(UserContext);

  const getMoodTrend = () => {
    if (!user || !user.moodEntries || user.moodEntries.length === 0) {
      return null;
    }

    const last7Days = user.moodEntries.slice(0, 7).reverse();
    const averageScore = last7Days.reduce((sum, entry) => sum + entry.score, 0) / last7Days.length;
    
    return { averageScore, entries: last7Days };
  };

  const trend = getMoodTrend();

  const getMoodStats = () => {
    if (!user || !user.moodEntries || user.moodEntries.length === 0) {
      return null;
    }

    const moods = {};
    user.moodEntries.forEach((entry) => {
      moods[entry.mood] = (moods[entry.mood] || 0) + 1;
    });

    return moods;
  };

  const getMoodColor = (score) => {
    if (score >= 8) return '#10B981'; // green
    if (score >= 6) return '#3B82F6'; // blue
    if (score >= 4) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  const getMoodEmoji = (mood) => {
    const emojiMap = {
      Happy: '😊',
      Sad: '😢',
      Stressed: '😤',
      Bored: '🥱',
      Excited: '🤩',
      Relaxed: '😌',
      Angry: '😠',
      Neutral: '😐',
      'Very Happy': '😄',
      'Very Sad': '😭',
    };
    return emojiMap[mood] || '😊';
  };

  const moodStats = getMoodStats();

  return (
    <div className="mood-bar-container">
      <h2>📊 Your Mood Tracker</h2>

      {trend ? (
        <>
          <div className="mood-overview">
            <div className="mood-summary">
              <h3>Overall Mood Score (Last 7 Days)</h3>
              <div className="large-score">
                <div
                  className="score-circle"
                  style={{ backgroundColor: getMoodColor(trend.averageScore) }}
                >
                  {trend.averageScore.toFixed(1)}/10
                </div>
              </div>
              <p className="score-interpretation">
                {trend.averageScore >= 8 && '✨ Excellent mood!'}
                {trend.averageScore >= 6 && trend.averageScore < 8 && '😊 Good mood'}
                {trend.averageScore >= 4 && trend.averageScore < 6 && '😐 Neutral'}
                {trend.averageScore < 4 && '💙 Challenging time - take care of yourself'}
              </p>
            </div>

            <div className="mood-chart">
              <h3>Mood Trend</h3>
              <div className="mini-chart">
                {trend.entries.map((entry, index) => (
                  <div key={index} className="chart-bar-wrapper">
                    <div className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{
                          height: `${(entry.score / 10) * 100}%`,
                          backgroundColor: getMoodColor(entry.score),
                        }}
                        title={`${entry.mood}: ${entry.score}/10`}
                      ></div>
                    </div>
                    <div className="chart-label">
                      {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {moodStats && Object.keys(moodStats).length > 0 && (
            <div className="mood-distribution">
              <h3>Mood Distribution</h3>
              <div className="mood-tags">
                {Object.entries(moodStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([mood, count]) => (
                    <div key={mood} className="mood-tag">
                      <span className="mood-emoji">{getMoodEmoji(mood)}</span>
                      <span className="mood-name">{mood}</span>
                      <span className="mood-count">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="recent-moods">
            <h3>Recent Mood Entries</h3>
            <div className="mood-entries-list">
              {user.moodEntries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="mood-entry-item">
                  <span className="entry-emoji">{getMoodEmoji(entry.mood)}</span>
                  <span className="entry-mood">{entry.mood}</span>
                  <div className="entry-score-bar">
                    <div
                      className="entry-score-fill"
                      style={{ width: `${(entry.score / 10) * 100}%`, backgroundColor: getMoodColor(entry.score) }}
                    ></div>
                  </div>
                  <span className="entry-score">{entry.score}/10</span>
                  <span className="entry-time">
                    {new Date(entry.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="no-data">
          <p>Start tracking your mood to see visualizations! 📈</p>
        </div>
      )}
    </div>
  );
};
