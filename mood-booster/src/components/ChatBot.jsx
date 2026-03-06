import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/ChatBot.css';

export const ChatBot = () => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${user?.username || 'Friend'}! 👋 I'm here to listen and support you. How are you feeling today?`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const botResponses = {
    stress: [
      'I hear you. Stress can be overwhelming. Try taking deep breaths or a short walk. 🌿',
      'Remember, this too shall pass. Consider what you can control right now. 💪',
      'Would a break help? Sometimes stepping away refreshes your mind.',
      'Stress is a sign you care. Channel that energy into action or relaxation.',
    ],
    happy: [
      'That\'s wonderful! Keep spreading that joy! ✨',
      'I love your positive energy! Make this feeling last by savoring it. 🌟',
      'You deserve to feel this good. Keep it up!',
      'Happiness looks great on you! Share it with others! 💖',
    ],
    sad: [
      'It\'s okay to feel sad sometimes. Your feelings are valid. 💙',
      'Would talking about what\'s bothering you help? I\'m here to listen.',
      'Remember, pain is temporary. Brighter days are coming. 🌈',
      'You\'re stronger than you think. How can I support you?',
    ],
    sleep: [
      'Good sleep is crucial for mental health. Consider a bedtime routine. 😴',
      'Try to avoid screens before bed and keep your room cool and dark. 🛏️',
      'Would a meditation or relaxation audio help you sleep?',
    ],
    exercise: [
      'Movement is medicine! Even a 10-minute walk can boost your mood. 🏃',
      'Physical activity releases endorphins - nature\'s happy chemicals! 📈',
      'Try yoga or stretching. Your body and mind will thank you! 🧘',
    ],
    friend: [
      'Connecting with loved ones is so important. Reach out to them! 🤝',
      'Social connection is vital for happiness. Consider calling someone today. 📞',
      'Spending time with supportive people helps us feel better. 💕',
    ],
    grateful: [
      'Gratitude is a superpower! You\'re on the right track. 🙏',
      'That\'s beautiful. Focusing on what we have brings more joy. ✨',
      'Gratitude can transform your perspective. Keep cultivating it! 🌻',
    ],
    default: [
      'I appreciate you sharing that with me. How does it make you feel? 🤔',
      'That\'s interesting. Tell me more about it.',
      'I\'m listening. What else is on your mind?',
      'Thank you for opening up. Your feelings matter. 💚',
      'I see. Remember, you\'re not alone in this.',
    ],
  };

  const getKeywords = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('stress') || lower.includes('anxious') || lower.includes('worry'))
      return 'stress';
    if (
      lower.includes('happy') ||
      lower.includes('great') ||
      lower.includes('excited') ||
      lower.includes('wonderful')
    )
      return 'happy';
    if (lower.includes('sad') || lower.includes('depressed') || lower.includes('hurt'))
      return 'sad';
    if (lower.includes('sleep') || lower.includes('tired') || lower.includes('exhausted'))
      return 'sleep';
    if (lower.includes('exercise') || lower.includes('run') || lower.includes('walk'))
      return 'exercise';
    if (lower.includes('friend') || lower.includes('family') || lower.includes('love'))
      return 'friend';
    if (lower.includes('grateful') || lower.includes('grateful') || lower.includes('thankful'))
      return 'grateful';
    return 'default';
  };

  const generateBotResponse = (userMessage) => {
    const category = getKeywords(userMessage);
    const responses = botResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate bot thinking delay
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: generateBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="bot-avatar">🤖</div>
        <div className="bot-info">
          <h3>Think (Your AI Companion)</h3>
          <p>Always here to listen and support</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="suggested-prompts">
        <button
          onClick={() => {
            setInput('I am feeling stressed');
            setTimeout(() => {
              handleSendMessage({ preventDefault: () => {} });
            }, 100);
          }}
          className="prompt-btn"
        >
          😤 Stressed
        </button>
        <button
          onClick={() => {
            setInput('I am feeling happy');
            setTimeout(() => {
              handleSendMessage({ preventDefault: () => {} });
            }, 100);
          }}
          className="prompt-btn"
        >
          😊 Happy
        </button>
        <button
          onClick={() => {
            setInput('I need motivation');
            setTimeout(() => {
              handleSendMessage({ preventDefault: () => {} });
            }, 100);
          }}
          className="prompt-btn"
        >
          💪 Motivation
        </button>
        <button
          onClick={() => {
            setInput('I cannot sleep');
            setTimeout(() => {
              handleSendMessage({ preventDefault: () => {} });
            }, 100);
          }}
          className="prompt-btn"
        >
          😴 Sleep Help
        </button>
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share your thoughts... 💭"
          className="chat-input"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()} className="send-btn">
          ➤
        </button>
      </form>

      <div className="chat-tips">
        <p>💡 Tip: Share how you're feeling to get personalized advice from Think!</p>
      </div>
    </div>
  );
};
