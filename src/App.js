import React, { useState } from 'react';
import OpenAI from 'openai';
import axios from 'axios';

function App() {
  const [songQuery, setSongQuery] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [songInfo, setSongInfo] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

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
      setLoading(true);
      const newMessages = [...messages, { role: 'user', content: chatInput }];
      
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
      setMessages([...newMessages, response]);
      setChatInput('');
    } catch (error) {
      console.error('Error chatting:', error);
      setMessages([...messages, { role: 'assistant', content: 'Sorry, there was an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Lyrics Chat</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={songQuery}
          onChange={(e) => setSongQuery(e.target.value)}
          placeholder="Enter song name (e.g., 'Imagine', 'Hello')"
          style={{ width: '70%', padding: '8px' }}
          onKeyPress={(e) => e.key === 'Enter' && searchLyrics()}
        />
        <button 
          onClick={searchLyrics}
          disabled={loading}
          style={{ marginLeft: '10px', padding: '8px' }}
        >
          Search
        </button>
      </div>

      {songInfo && (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>{songInfo.title} - {songInfo.artist}</h3>
          {songInfo.artwork && (
            <img src={songInfo.artwork} alt="Album artwork" style={{ width: '100px', height: '100px', marginBottom: '10px' }} />
          )}
        </div>
      )}

      {lyrics && (
        <div style={{ whiteSpace: 'pre-wrap', marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', maxHeight: '300px', overflowY: 'auto' }}>
          {lyrics}
        </div>
      )}

      {lyrics && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Luzia about the lyrics..."
              style={{ width: '70%', padding: '8px' }}
              onKeyPress={(e) => e.key === 'Enter' && chat()}
            />
            <button 
              onClick={chat}
              disabled={loading}
              style={{ marginLeft: '10px', padding: '8px' }}
            >
              Send
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            {messages.map((msg, index) => (
              <div 
                key={index}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                  borderRadius: '5px'
                }}
              >
                <strong>{msg.role === 'user' ? 'You' : 'Luzia'}:</strong> {msg.content}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>}
    </div>
  );
}

export default App; 