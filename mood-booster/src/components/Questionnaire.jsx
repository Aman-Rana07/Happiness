import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/Questionnaire.css';

export const Questionnaire = () => {
  const { saveQuestionnaireResponse, addMoodEntry } = useContext(UserContext);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 'overall',
      question: 'How would you rate your overall happiness today?',
      type: 'scale',
      min: 1,
      max: 10,
    },
    {
      id: 'mood',
      question: 'What best describes your current mood?',
      type: 'multiple',
      options: ['Very Happy', 'Happy', 'Neutral', 'Sad', 'Very Sad', 'Stressed', 'Relaxed', 'Excited'],
    },
    {
      id: 'sleep',
      question: 'How well did you sleep last night?',
      type: 'scale',
      min: 1,
      max: 10,
    },
    {
      id: 'stress',
      question: 'How stressed are you feeling?',
      type: 'scale',
      min: 1,
      max: 10,
    },
    {
      id: 'activity',
      question: 'How physically active were you today?',
      type: 'scale',
      min: 1,
      max: 10,
    },
    {
      id: 'social',
      question: 'How satisfied are you with your social interactions?',
      type: 'scale',
      min: 1,
      max: 10,
    },
    {
      id: 'work',
      question: 'How productive were you today?',
      type: 'scale',
      min: 1,
      max: 10,
    },
    {
      id: 'challenges',
      question: 'What challenges did you face today?',
      type: 'text',
    },
    {
      id: 'achievements',
      question: 'What are you proud of today?',
      type: 'text',
    },
    {
      id: 'gratitude',
      question: 'What are you grateful for?',
      type: 'text',
    },
  ];

  const currentQ = questions[currentQuestion];

  const handleResponse = (answer) => {
    setResponses({
      ...responses,
      [currentQ.id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    saveQuestionnaireResponse(responses);
    if (responses.overall) {
      addMoodEntry(responses.mood || 'Neutral', responses.overall);
    }
    setShowResults(true);
  };

  const calculateScore = () => {
    const scores = [
      responses.overall || 0,
      (responses.sleep || 0) / 2,
      (10 - (responses.stress || 0)) / 2,
      responses.activity || 0,
      responses.social || 0,
      responses.work || 0,
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="questionnaire-container">
        <div className="questionnaire-card results">
          <div className="results-emoji">
            {score >= 80 ? '🌟' : score >= 60 ? '😊' : score >= 40 ? '😐' : '😔'}
          </div>
          <h2>Your Happiness Score: {score}%</h2>
          
          <div className="score-breakdown">
            <div className="breakdown-item">
              <label>Overall Happiness</label>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${(responses.overall || 0) * 10}%` }}></div>
              </div>
              <span>{responses.overall || 0}/10</span>
            </div>

            {responses.mood && (
              <div className="breakdown-item">
                <label>Your Mood</label>
                <p className="mood-badge">{responses.mood}</p>
              </div>
            )}

            <div className="breakdown-item">
              <label>Sleep Quality</label>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${(responses.sleep || 0) * 10}%` }}></div>
              </div>
              <span>{responses.sleep || 0}/10</span>
            </div>

            <div className="breakdown-item">
              <label>Stress Level</label>
              <div className="score-bar">
                <div className="score-fill stress" style={{ width: `${(10 - (responses.stress || 0)) * 10}%` }}></div>
              </div>
              <span>{10 - (responses.stress || 0)}/10 (Lower stress is better)</span>
            </div>

            {responses.achievements && (
              <div className="breakdown-item">
                <label>Today's Achievements</label>
                <p>{responses.achievements}</p>
              </div>
            )}

            {responses.gratitude && (
              <div className="breakdown-item">
                <label>Gratitude</label>
                <p>{responses.gratitude}</p>
              </div>
            )}
          </div>

          <div className="results-recommendations">
            <h3>💡 Recommendations</h3>
            {score >= 80 && <p>Keep up the amazing work! You're thriving.</p>}
            {score >= 60 && score < 80 && <p>You're doing well! Consider adding more activities you enjoy.</p>}
            {score >= 40 && score < 60 && <p>Take time for self-care. Try meditation or connect with loved ones.</p>}
            {score < 40 && <p>Consider reaching out to someone. A little support goes a long way.</p>}
          </div>

          <button onClick={() => window.location.reload()} className="restart-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-card">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="question-counter">
          Question {currentQuestion + 1} of {questions.length}
        </div>

        <h2 className="question-text">{currentQ.question}</h2>

        <div className="answer-section">
          {currentQ.type === 'scale' && (
            <div className="scale-options">
              {Array.from({ length: currentQ.max - currentQ.min + 1 }, (_, i) => currentQ.min + i).map(
                (num) => (
                  <button
                    key={num}
                    className={`scale-btn ${responses[currentQ.id] === num ? 'active' : ''}`}
                    onClick={() => handleResponse(num)}
                  >
                    {num}
                  </button>
                )
              )}
            </div>
          )}

          {currentQ.type === 'multiple' && (
            <div className="multiple-options">
              {currentQ.options.map((option) => (
                <button
                  key={option}
                  className={`option-btn ${responses[currentQ.id] === option ? 'active' : ''}`}
                  onClick={() => handleResponse(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'text' && (
            <textarea
              className="text-input"
              value={responses[currentQ.id] || ''}
              onChange={(e) => handleResponse(e.target.value)}
              placeholder="Enter your thoughts..."
              rows="4"
            />
          )}
        </div>

        <div className="button-group">
          <button onClick={handlePrevious} disabled={currentQuestion === 0} className="prev-btn">
            ← Previous
          </button>
          <button onClick={handleNext} className="next-btn">
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};
