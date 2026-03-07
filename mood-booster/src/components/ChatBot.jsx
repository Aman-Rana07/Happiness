import { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/ChatBot.css';

const SYSTEM_PROMPT = `You are "Think", the Mood Fixer AI. 
Your core persona is friendly, empathetic, and uplifting. 
Your rules:
1. Identify the user's mood and match their energy (gentle if sad, energetic if bored).
2. Limit website suggestions. Instead of just giving links, provide interactive "fixes": offer to play a quick word puzzle game, share a light logic riddle, guide them through a breathing exercise, or tell a joke.
3. Keep responses concise and punchy (1-3 short paragraphs max). Focus on conversation over lecturing.
4. SAFETY CRITICAL: If a user expresses severe distress, depression, or self-harm, drop the playful tone, express genuine concern, and advise them to seek professional help or talk to a trusted person.
5. Never break character.`;

export const ChatBot = () => {
  const { user } = useContext(UserContext);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${user?.username || 'Friend'}! 👋 I'm "Think", your AI Mood Fixer. How are you feeling today?`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- UI POLISH: Auto-Scroll Logic ---
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Triggers the scroll every time 'messages' or 'isLoading' changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // --- AI API LOGIC ---
  const handleSendMessage = async (e, customInput = null) => {
    if (e) e.preventDefault();
    
    const textToSend = customInput || input;
    if (!textToSend.trim()) return;

    // 1. Add User's new message to the screen
    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
      
      if (!apiKey) {
        throw new Error("API Key is missing! Check your .env file.");
      }

      // 2. Format the chat history so the AI remembers the conversation
      const chatHistory = messages.map((msg) => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      
      // Add the current message to the history
      chatHistory.push({ role: 'user', parts: [{ text: textToSend }] });

      // 3. Make the API Call
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           systemInstruction: {
             parts: [{ text: SYSTEM_PROMPT }]
           },
           contents: chatHistory // We now send the entire chat history!
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const aiResponseText = data.candidates[0].content.parts[0].text;

      // 4. Add the AI's response to the screen
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("AI API Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Oops! My brain got a little scrambled. Could you try saying that again? 😅",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        
        {/* --- UI POLISH: The Invisible Auto-Scroll Anchor --- */}
        <div ref={messagesEndRef} />
      </div>

      <div className="suggested-prompts">
        <button onClick={() => handleSendMessage(null, 'I am feeling stressed')} className="prompt-btn">
          😤 Stressed
        </button>
        <button onClick={() => handleSendMessage(null, 'I am feeling happy')} className="prompt-btn">
          😊 Happy
        </button>
        <button onClick={() => handleSendMessage(null, 'I need motivation')} className="prompt-btn">
          💪 Motivation
        </button>
        <button onClick={() => handleSendMessage(null, 'I cannot sleep')} className="prompt-btn">
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