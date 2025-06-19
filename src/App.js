import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import axios from 'axios';
import './App.css';

function App() {
  const [songQuery, setSongQuery] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [songInfo, setSongInfo] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages, isTyping]);

  const searchLyrics = async () => {
    try {
      setLoading(true);
      // Use relative URL in production, localhost in development
      const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';
      const url = `${baseUrl}/api/lyrics?title=${encodeURIComponent(songQuery)}`;
      console.log('Making request to:', url);
      
      const response = await axios.get(url);
      console.log('Response received:', response);
      console.log('Response data:', response.data);
      
      if (response.data && response.data.lyrics) {
        setLyrics(response.data.lyrics);
        setSongInfo({
          artist: response.data.artist_name,
          title: response.data.track_name,
          artwork: response.data.artwork_url
        });
        setMessages([]); // Clear chat when new lyrics are loaded
        console.log('Lyrics set successfully');
      } else {
        console.log('No lyrics found in response');
        setLyrics('No lyrics found for this song. Please try a different search.');
        setSongInfo(null);
      }
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      setLyrics(`Error fetching lyrics: ${error.message}. Please try again with a different song.`);
      setSongInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const chat = async () => {
    if (!chatInput.trim() || !lyrics) return;

    try {
      const newMessages = [...messages, { role: 'user', content: chatInput }];
      setMessages(newMessages);
      setChatInput('');
      setIsTyping(true);

      const completion = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content: `You are Luzia, a music expert. You are analyzing these lyrics from "${songInfo?.title}" by ${songInfo?.artist}:\n\n${lyrics}`
          },
          ...newMessages
        ]
      });

      const response = completion.choices[0].message;
      
      // Add a small delay to make the typing animation more noticeable
      setTimeout(() => {
        setIsTyping(false);
        setMessages([...newMessages, response]);
      }, 1000);

    } catch (error) {
      console.error('Error chatting:', error);
      setIsTyping(false);
      setMessages([...messages, { role: 'assistant', content: 'Sorry, there was an error. Please try again.' }]);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="typing-indicator">
      <div className="typing-bubble">
        <div className="typing-dots">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
        <span className="typing-text">Luzia is thinking...</span>
      </div>
    </div>
  );

  // Modal component
  const ArtworkModal = () => (
    showModal && songInfo?.artwork && (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content">
          <button className="modal-close" onClick={() => setShowModal(false)}>
            ×
          </button>
          <img 
            src={songInfo.artwork} 
            alt={`${songInfo.title} by ${songInfo.artist}`}
            className="modal-image"
          />
        </div>
      </div>
    )
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">🎵 Lyrics Chat</h1>
        <p className="app-subtitle">Discover song lyrics and chat with Luzia, your AI music expert</p>
      </header>
      
      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            value={songQuery}
            onChange={(e) => setSongQuery(e.target.value)}
            placeholder="Enter song name (e.g., 'Imagine', 'Hello', 'Bohemian Rhapsody')"
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && searchLyrics()}
          />
          <button 
            onClick={searchLyrics}
            disabled={loading}
            className="search-btn"
          >
            🔍 Search
          </button>
        </div>
      </section>

      {songInfo && (
        <div className="song-info-card">
          {songInfo.artwork && (
            <img 
              src={songInfo.artwork} 
              alt="Album artwork" 
              className="song-artwork"
              onClick={openModal}
              title="Click to view full size"
            />
          )}
          <div className="song-details">
            <h3>{songInfo.title}</h3>
            <p className="artist">by {songInfo.artist}</p>
          </div>
        </div>
      )}

      {lyrics && (
        <div className="lyrics-container">
          {lyrics}
        </div>
      )}

      {lyrics && (
        <section className="chat-section">
          <div className="chat-input-container">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Luzia about the lyrics, meaning, themes, or anything else..."
              className="chat-input"
              onKeyPress={(e) => e.key === 'Enter' && chat()}
              disabled={isTyping}
            />
            <button 
              onClick={chat}
              disabled={isTyping || !chatInput.trim()}
              className="chat-btn"
            >
              💬 Send
            </button>
          </div>

          <div className="messages-container">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="message-bubble">
                  {msg.role === 'assistant' && <div className="message-author">🎼 Luzia</div>}
                  {msg.role === 'user' && <div className="message-author">You</div>}
                  <div>{msg.content}</div>
                </div>
              </div>
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </section>
      )}

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            Searching for lyrics...
          </div>
        </div>
      )}

      <ArtworkModal />
    </div>
  );
}

export default App; 