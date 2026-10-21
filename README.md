# 𝕏 TwitterClone

A full-stack Twitter / X social network clone built with React, Node.js, Express, and MongoDB.

---

## ✨ Features

- 🔐 **Authentication**: User sign up and login with JWT token verification and salted password hashing (bcryptjs).
- 🐦 **Tweets Feed**: Share tweets with up to 280 characters and attached photos.
- 🖼️ **Media Uploads**: Integrated image upload support using Multer with file size limits and automatic media serving.
- ❤️ **Likes & Interactions**: Real-time like / unlike toggling with responsive heart states.
- 💬 **Comments & Replies**: Interactive comment threads with collapsible discussions.
- 👤 **User Profiles**: View personal stats (tweets count, follower count, following count).
- 🤝 **Follow / Unfollow**: Discover other users on the platform and build your following network.
- 📱 **Modern UI**: Twitter/X-inspired responsive design with dark/light contrasts, pill buttons, and responsive sidebar navigation.

---

## 📁 Project Architecture

The project has been cleaned and organized into a modular full-stack architecture:

```text
twitterclone/
├── client/                 # React frontend (Vite)
│   ├── public/             # Static assets & SVG icons
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, Sidebar, Post, CreatePost, Comment, etc.)
│   │   ├── context/        # Auth Context & Provider
│   │   ├── pages/          # Home, Profile, Login, Register
│   │   ├── services/       # Centralized Axios API client
│   │   ├── App.jsx         # Routes & Layout
│   │   └── index.css       # Twitter-inspired design system
│   ├── .env.example        # Client environment template
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express REST API (Node.js & MongoDB)
│   ├── config/             # Database connection
│   ├── controllers/        # Business logic (Auth, Posts, Users)
│   ├── middleware/         # JWT Auth and Multer Upload middleware
│   ├── models/             # Mongoose schemas (User, Post, Comment, Follow)
│   ├── routes/             # API routes (/api/auth, /api/tweets, /api/users)
│   ├── uploads/            # Uploaded images directory
│   ├── .env.example        # Server environment template
│   ├── package.json
│   └── server.js           # Server entry point & health check
├── .env.example            # Root environment template
├── .gitignore              # Comprehensive secrets & build exclusion rules
└── README.md
```

---

## 🔒 Security & Secrets Protection

A strict `.gitignore` is in place to ensure that Git **never** tracks or exposes sensitive credentials, secret keys, or environment files:
- All `.env` and `.env.*` files are ignored (only `.env.example` templates are tracked).
- Private keys (`*.pem`, `*.key`, `*.cert`), certificates, and token files are ignored.
- Build artifacts (`dist/`) and dependency folders (`node_modules/`) are strictly excluded.
- User-uploaded assets in `server/uploads/*` are ignored while preserving directory structure via `.gitkeep`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance running on `mongodb://localhost:27017` or MongoDB Atlas)

---

### 1. Backend Setup

1. Open a terminal and navigate to `server/`:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *By default, the server connects to `mongodb://localhost:27017/twitterclone` on port `5000`.*

4. Start the server:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Or standard start
   npm start
   ```

---

### 2. Frontend Setup

1. Open a new terminal and navigate to `client/`:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file if pointing to a non-default backend port:
   ```bash
   cp .env.example .env
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## 📡 API Reference

### Health Check
- `GET /api/health` - Check API and server status

### Authentication
- `POST /api/auth/signup` - Register a new account (`username`, `email`, `password`)
- `POST /api/auth/login` - Authenticate user (`email`, `password`)

### Tweets & Posts
- `GET /api/tweets` - Get all tweets (newest first, populated with author and comments)
- `POST /api/tweets` - Create a tweet (Multipart form: `content`, optional `image`) [Auth Required]
- `DELETE /api/tweets/:id` - Delete tweet by ID [Auth Required & Author Only]
- `PUT /api/tweets/like/:id` - Toggle like / unlike on a tweet [Auth Required]
- `POST /api/tweets/:id/comments` - Reply to a tweet (`content`) [Auth Required]

### Users & Social
- `GET /api/users` - Get list of users with follow status [Auth Required]
- `GET /api/users/me` - Get logged-in user profile & stats [Auth Required]
- `GET /api/users/:id` - Get public profile of a user [Auth Required]
- `PUT /api/users/:id/follow` - Toggle follow / unfollow a user [Auth Required]

---

## 🛠️ Scripts Summary

| Directory | Command | Description |
|---|---|---|
| `server/` | `npm run dev` | Run server with Node watch mode |
| `server/` | `npm start` | Run server in production mode |
| `server/` | `npm test` | Syntax verification test |
| `client/` | `npm run dev` | Launch Vite development server |
| `client/` | `npm run build` | Build production bundle to `client/dist/` |
| `client/` | `npm run preview` | Preview production build locally |

---

## 📄 License

ISC
