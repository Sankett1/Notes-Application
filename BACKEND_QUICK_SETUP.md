# ⚡ Backend Quick Setup (5 Minutes)

## 🚀 Express.js + MongoDB Backend

A complete Node.js backend is ready in the `server/` directory!

---

## ⏱️ 5-Minute Setup

### Step 1: Install MongoDB

**Windows:** Download from [mongodb.com](https://www.mongodb.com/try/download/community)

**Mac:** 
```bash
brew install mongodb-community && brew services start mongodb-community
```

**Linux:** 
```bash
sudo apt-get install mongodb && sudo systemctl start mongod
```

### Step 2: Setup Backend

```bash
cd server
npm install
```

### Step 3: Create .env File

Create `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/notes-app
PORT=5000
NODE_ENV=development
JWT_SECRET=change_this_in_production_secret123
CORS_ORIGIN=http://localhost:5173
```

### Step 4: Start Server

```bash
npm run dev
```

✅ **Done!** Backend running on http://localhost:5000

---

## 🧪 Test It

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123","role":"user"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"password123"}'
```

---

## 📁 Backend Structure

```
server/
├── config/          - Database config
├── models/          - MongoDB schemas (User, Note, Log)
├── routes/          - API routes (auth, notes, logs)
├── middleware/      - Auth & logging middleware
├── package.json     - Dependencies
├── server.js        - Main server file
└── README.md        - Full documentation
```

---

## 📚 Frontend Already Updated

The React app (`src/`) is already configured to use this backend:

- ✅ Updated `src/api.js` with token handling
- ✅ Updated `src/AuthContext.jsx` with real auth  
- ✅ Updated `src/UserLogin.jsx` to use API
- ✅ Updated `src/UserSignup.jsx` to use API
- ✅ Updated `src/AdminLogin.jsx` to use API

---

## 🔑 Key Features

✅ JWT Authentication (7-day tokens)  
✅ Password hashing with bcryptjs  
✅ Role-based access control (user/admin)  
✅ MongoDB persistence  
✅ Activity logging system  
✅ CRUD for notes  
✅ Admin dashboard data  
✅ Search & filtering  

---

## 🚀 Start Both Servers

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
npm run dev
```

Visit: http://localhost:5173

---

## 📖 Full Documentation

See **BACKEND_INTEGRATION_GUIDE.md** for complete setup and API reference.

---

**Backend is ready to use!** 🎉
