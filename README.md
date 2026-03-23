
# Anonymous Random Chat System

## 🌐 Live Demo

* 🔗 Frontend (Vercel): https://anonymous-chat-system-delta.vercel.app
* 🔗 Backend (Render): https://anonymous-chat-system.onrender.com

---

## 📌 Overview

Anonymous Random Chat System is a real-time full-stack web application that allows users to connect with random strangers and chat one-on-one without any authentication.

The system focuses on real-time communication, efficient matchmaking, and handling edge cases like disconnections, skips, and message limits.

---

## 🎯 Features

### 🔹 Core Features

* Anonymous user connection (without login)
* Random 1-to-1 matchmaking
* Real-time messaging using WebSockets (Socket.IO)
* Skip / End chat and re-match
* Proper disconnect handling with partner notification

### 🔹 Chat Features

* Send messages using Enter key
* Message timestamps 
* Typing indicator (real-time)
* Clean chat UI (left/right alignment)

### 🔹 System Features

* Rate limiting (prevents spam)
* Message validation (length & format)
* Error handling via socket events
* Status updates (Searching / Connected / Disconnected)

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Socket.IO Client
* CSS (Custom UI)

### Backend

* Node.js
* Express.js
* Socket.IO

---

## ⚙️ Architecture

```
Frontend (React - Vercel)
        ↓
WebSocket (Socket.IO)
        ↓
Backend (Node.js - Render)
```

---

## 📁 Project Structure

```
anonymous-chat-system/
│
├── backend/
│   ├── src/
│   │   ├── sockets/
│   │   │   └── socket.handler.js
│   │   │
│   │   ├── services/
│   │   │   ├── matchmaking.service.js
│   │   │   └── chat.service.js
│   │   │
│   │   ├── utils/
│   │   │   └── rateLimiter.js
│   │   │
│   │   ├── constants/
│   │   │   └── events.js
│   │   │
│   │   └── index.js
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.jsx
│   │   │   ├── Controls.jsx
│   │   │   └── StatusBar.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   │
│   │   ├── socket/
│   │   │   └── socket.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

## 🔄 Matchmaking Flow

1. User connects → assigned temporary ID
2. User clicks "Start Chat"
3. Added to matchmaking queue
4. If another user is available:

   * Both users are paired
   * Room is created
5. Real-time chat begins
6. On skip/disconnect:

   * Partner is notified
   * Remaining user is re-queued

---

## 💬 Chat Flow

* Messages are sent using WebSocket events
* Sender adds message locally
* Server forwards message only to the partner
* Messages include timestamps
* Typing indicator handled using:

  * `typing`
  * `stop_typing`

---

## ⚡ Real-Time Features

* Instant message delivery
* Typing indicator
* Live status updates
* Auto re-match
* No page refresh required

---

## 🛡️ Validations & Error Handling

* Message length validation (max 500 chars)
* Rate limiting (anti-spam)
* Socket-based error handling
* Safe disconnect handling (no broken sessions)

---

## 🚀 Setup Instructions

### 1. Clone Repository

```
git clone https://github.com/8309h/anonymous-chat-system.git
cd anonymous-chat-system
```

---

### 2. Backend Setup

```
cd backend
npm install
npm start
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔌 Environment Variables

### Backend (.env)

```
PORT=5000
CLIENT_URL=https://anonymous-chat-system-delta.vercel.app
```

---

### Frontend (.env)

```
VITE_BACKEND_URL=https://anonymous-chat-system.onrender.com
```

---

## 🧪 Testing

* Open the app in **two browser tabs**
* Click **Start Chat**
* Send messages
* Test skip functionality
* Test typing indicator
* Close one tab → verify disconnect handling

---
