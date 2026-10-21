# 𝕏 TwitterClone

A full-stack Twitter / X social network clone built with React, Node.js, Express, and MongoDB.

🌐 **Live Backend Deployment**: [https://xclone-di8o.onrender.com](https://xclone-di8o.onrender.com)  
🏥 **Health Check API**: [https://xclone-di8o.onrender.com/api/health](https://xclone-di8o.onrender.com/api/health)

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
│   │   ├── services/       # Centralized Axios API client (Connected to Render)
│   │   ├── App.jsx         # Routes & Layout
│   │   └── index.css       # Twitter-inspired design system
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express REST API (Node.js & MongoDB Atlas)
│   ├── config/             # Database connection (MongoDB Atlas with DNS fallback)
│   ├── controllers/        # Business logic (Auth, Posts, Users)
│   ├── middleware/         # JWT Auth and Multer Upload middleware
│   ├── models/             # Mongoose schemas (User, Post, Comment, Follow)
│   ├── routes/             # API routes (/api/auth, /api/tweets, /api/users)
│   ├── uploads/            # Uploaded images directory
│   ├── package.json
│   └── server.js           # Server entry point & health check (0.0.0.0 host binding)
├── .env.example            # Public repository environment template
├── .gitignore              # Comprehensive secrets & build exclusion rules
└── README.md
```

---

## 🔒 Security & Secrets Protection

A strict `.gitignore` is in place to ensure that Git **never** tracks or exposes sensitive credentials, secret keys, or environment files:
- All `.env` and `.env.*` files are ignored (only `.env.example` template is tracked).
- Private keys (`*.pem`, `*.key`, `*.cert`), certificates, and token files are ignored.
- Build artifacts (`dist/`) and dependency folders (`node_modules/`) are strictly excluded.
- User-uploaded assets in `server/uploads/*` are ignored while preserving directory structure via `.gitkeep`.

---

## 🚀 Getting Started

### 1. Backend Setup

1. Open a terminal and navigate to `server/`:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your local `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://mohangalla2006_db_user:<password>@cluster0.s5bunjq.mongodb.net/twitterclone?retryWrites=true&w=majority
   JWT_SECRET=supersecretjwtkey_12345
   ```

4. Start the server:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
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

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.  
   *By default, the client routes to your live Render backend `https://xclone-di8o.onrender.com` in production builds, or `http://localhost:5000` in local dev.*

---

## 📡 Live API Reference

### Health Check
- `GET https://xclone-di8o.onrender.com/api/health` - Check API and server status

### Authentication
- `POST https://xclone-di8o.onrender.com/api/auth/signup` - Register a new account (`username`, `email`, `password`)
- `POST https://xclone-di8o.onrender.com/api/auth/login` - Authenticate user (`email`, `password`)

### Tweets & Posts
- `GET https://xclone-di8o.onrender.com/api/tweets` - Get all tweets (newest first)
- `POST https://xclone-di8o.onrender.com/api/tweets` - Create a tweet (Multipart form: `content`, optional `image`) [Auth Required]
- `DELETE https://xclone-di8o.onrender.com/api/tweets/:id` - Delete tweet by ID [Auth Required & Author Only]
- `PUT https://xclone-di8o.onrender.com/api/tweets/like/:id` - Toggle like / unlike on a tweet [Auth Required]
- `POST https://xclone-di8o.onrender.com/api/tweets/:id/comments` - Reply to a tweet (`content`) [Auth Required]

### Users & Social
- `GET https://xclone-di8o.onrender.com/api/users` - Get list of users with follow status [Auth Required]
- `GET https://xclone-di8o.onrender.com/api/users/me` - Get logged-in user profile & stats [Auth Required]
- `GET https://xclone-di8o.onrender.com/api/users/:id` - Get public profile of a user [Auth Required]
- `PUT https://xclone-di8o.onrender.com/api/users/:id/follow` - Toggle follow / unfollow a user [Auth Required]

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
