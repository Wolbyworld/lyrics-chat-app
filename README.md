# Lyrics Chat App 🎵

A quick web application that allows users to search for song lyrics and chat about them with an AI music expert named Luzia.

## 🚀 Live Demo

**Deployed App:** https://lyrics-chat-app-3aec5c489a86.herokuapp.com/

## ✨ Features

- **Lyrics Search**: Search for any song and get lyrics from YouTube Music
- **AI Chat**: Chat with Luzia, an AI music expert, about the lyrics
- **Song Info**: View artist name, song title, and album artwork
- **Real-time Chat**: Ask questions about themes, mood, literary devices, etc.

## 🛠️ Tech Stack

- **Frontend**: React (Create React App)
- **Backend**: Express.js (proxy server)
- **AI**: OpenAI GPT-4
- **Lyrics API**: lyrics.lewdhutao.my.eu.org
- **Deployment**: Heroku

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18.x
- OpenAI API Key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Wolbyworld/lyrics-chat-app.git
   cd lyrics-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
4. **Add your OpenAI API key to `.env`**
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Run development servers**
   
   **Terminal 1 - Backend (API proxy):**
   ```bash
   node server.js
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🎯 How to Use

1. Enter a song name in the search box (e.g., "Imagine", "Bohemian Rhapsody")
2. Click "Search" to fetch lyrics
3. Once lyrics appear, use the chat input to ask Luzia questions
4. Example questions:
   - "What is this song about?"
   - "Analyze the themes in these lyrics"
   - "What's the mood of this song?"
   - "What literary devices are used?"

## 🏗️ Architecture

- **Frontend (React)**: Serves the user interface on port 3000
- **Backend (Express)**: Proxy server on port 3001 to handle CORS issues
- **External APIs**: 
  - Lyrics API for fetching song lyrics
  - OpenAI API for AI chat functionality

## 🚀 Deployment

The app is configured for Heroku deployment:

```bash
# Deploy to Heroku
heroku create your-app-name
heroku config:set REACT_APP_OPENAI_API_KEY=your_api_key
git push heroku master
```

## 📝 Environment Variables

- `REACT_APP_OPENAI_API_KEY`: Your OpenAI API key for chat functionality
- `NODE_ENV`: Set to 'production' for Heroku deployment
- `PORT`: Server port (automatically set by Heroku)

## 🤝 Contributing

This is a quick prototype. Feel free to fork and improve!

## ⚠️ Note

This is a "quick and dirty" implementation for testing purposes. For production use, consider:
- Moving OpenAI API calls to backend for security
- Adding rate limiting
- Implementing proper error handling
- Adding user authentication
- Caching lyrics results

## 📄 License

MIT License - feel free to use and modify as needed! 