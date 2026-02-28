# 🚀 Backend Integration Guide

Complete setup and integration instructions for connecting the React frontend with the Node.js/MongoDB backend.

---

## 📋 Prerequisites

- ✅ Node.js (v16+)
- ✅ MongoDB (local or cloud)
- ✅ React frontend running on `http://localhost:5173`
- ✅ npm or yarn

---

## 🔧 Step 1: Setup MongoDB

### Option A: Local MongoDB

**Windows Users:**
1. Download MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will run on `mongodb://localhost:27017`

**Mac Users:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Linux Users:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/notes-app`
5. Use this in `.env` file

---

## 🔧 Step 2: Setup Backend Server

### Navigate to Server Directory

```bash
cd server
```

### Install Dependencies

```bash
npm install
```

### Create .env File

Create `.env` file in the `server` directory:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/notes-app
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
CORS_ORIGIN=http://localhost:5173
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes-app
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
CORS_ORIGIN=http://localhost:5173
```

⚠️ **Security Note:** Change `JWT_SECRET` to a strong, random value!

### Start Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

✅ **Success:** You should see:
```
╔════════════════════════════════════════╗
║     Notes App Backend Server           ║
║     http://localhost:5000              ║
║     Environment: development           ║
╚════════════════════════════════════════╝
```

---

## 🔧 Step 3: Update Frontend (Already Done)

The frontend has been pre-configured to work with the backend:

### Updated Files:

1. **src/api.js** - Now includes:
   - Axios interceptors for JWT token
   - Auto-token injection on all requests
   - 401 error handling

2. **src/AuthContext.jsx** - Now includes:
   - Real API `login()` and `signup()` functions
   - Token storage in localStorage
   - Auth check on app load

3. **src/UserLogin.jsx** - Updated to:
   - Call API-based login
   - Show loading state
   - Display error messages from backend

4. **src/UserSignup.jsx** - Updated to:
   - Call API-based signup
   - Send all required fields
   - Handle backend validation

5. **src/AdminLogin.jsx** - Updated to:
   - Use API authentication
   - Accept any admin credentials from database

---

## ✅ Step 4: Verify Setup

### Test Backend Health

```bash
curl http://localhost:5000/health
# Should return: { "status": "Server is running" }
```

### Create Test Admin Account

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123456",
    "role": "admin",
    "department": "IT & System Admin"
  }'
```

### Login to Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

---

## 🚀 Step 5: Start Both Servers

### Terminal 1 - Backend Server

```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2 - Frontend Server

```bash
# From project root
npm run dev
# Runs on http://localhost:5173
```

✅ **Both servers should be running!**

---

## 🧪 Test Complete Flow

### 1. Open Frontend

Visit `http://localhost:5173` in your browser

### 2. Try User Signup

- Click "Create Account" (blue)
- Fill in:
  - Username: `testuser`
  - Email: `test@example.com`
  - Password: `password123`
  - Confirm Password: `password123`
- Click "Create Account"
- Should auto-login and show User Dashboard

### 3. Try User Login

- Logout first (Navbar)
- Go back to Hero
- Click "User Login"
- Try previous credentials:
  - Username: `testuser`
  - Password: `password123`
- Should login and show User Dashboard

### 4. Try Admin Signup

- Logout (Navbar button)
- Go back to Hero
- Click "Register Admin"
- Fill in:
  - Full Name: `John Admin`
  - Admin ID: `johnadmin`
  - Email: `john@example.com`
  - Department: `IT & System Admin`
  - Password: `adminpass123456` (8+ chars)
  - Confirm Password: `adminpass123456`
- Click "Register Admin"
- Should auto-login and show Admin Dashboard (red theme)

### 5. Create and Manage Notes

- In User Dashboard:
  - Create a note (title + content)
  - Should appear in notes list
  - Can edit, delete, search
  - All actions logged

- In Admin Dashboard:
  - Can see all user notes
  - Can view admin logs
  - Can see user activity

---

## 🔒 Security Features

### Passwords
- ✅ Hashed with bcryptjs (10 salt rounds)
- ✅ Never stored or transmitted in plain text
- ✅ Validated on both frontend and backend

### Authentication
- ✅ JWT tokens with 7-day expiration
- ✅ Tokens stored in localStorage
- ✅ Auto-injected in all API requests
- ✅ Automatic logout on 401 errors

### Authorization
- ✅ Role-based access control (user/admin)
- ✅ Protected routes require valid token
- ✅ Admin routes check user role
- ✅ Users can only see own notes

### Data Protection
- ✅ CORS enabled for frontend only
- ✅ Input validation on backend
- ✅ Error messages don't leak sensitive info
- ✅ Passwords not returned in API responses

---

## 📝 Database Schemas Created

### Users Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String ("user" or "admin"),
  department: String (for admins),
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean
}
```

### Notes Collection
```javascript
{
  title: String,
  content: String,
  userId: ObjectId,
  username: String,
  createdAt: Date,
  updatedAt: Date,
  tags: Array<String>,
  isArchived: Boolean
}
```

### Logs Collection
```javascript
{
  action: String (CREATE, READ, UPDATE, DELETE, LOGIN, etc.),
  details: String,
  user: ObjectId,
  username: String,
  userRole: String,
  resourceType: String,
  timestamp: Date
}
```

All data is automatically created when you signup!

---

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
**Solution:**
- Check if MongoDB is running: `mongosh` (or `mongo` for older versions)
- Verify connection string in `.env`
- For Atlas, ensure IP address is whitelisted

### Error: "CORS error in browser console"
**Solution:**
- Ensure backend is running on `http://localhost:5000`
- Check `CORS_ORIGIN` in `.env` is `http://localhost:5173`
- Restart backend server

### Error: "Invalid token" or "401 Unauthorized"
**Solution:**
- Token expired (7 days) - user needs to login again
- Clear localStorage and refresh page
- Ensure token is in `Authorization` header

### Error: "Cannot find module 'express'"
**Solution:**
- Run `npm install` in the server directory
- Check `package.json` exists in server folder

### Frontend API calls fail with 404
**Solution:**
- Verify backend server is running on port 5000
- Check API routes in `server/routes/`
- Verify request URL matches backend routes

### "No authentication token"
**Solution:**
- Check if login was successful
- Verify token is stored in localStorage
- Open DevTools → Application → localStorage → check authToken

---

## 📊 Project Structure

```
notes/
├── server/                    ← Backend (Node.js/Express)
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Note.js
│   │   └── Log.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── logger.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   └── logs.js
│   ├── package.json
│   ├── .env (create this)
│   ├── .gitignore
│   └── server.js
│
└── src/                       ← Frontend (React)
    ├── api.js                 (Updated - uses real API)
    ├── AuthContext.jsx        (Updated - real auth)
    ├── UserLogin.jsx          (Updated - API login)
    ├── UserSignup.jsx         (Updated - API signup)
    ├── AdminLogin.jsx         (Updated - API login)
    ├── UserDashboard.jsx      (Already uses API)
    ├── AdminDashboard.jsx     (Already uses API)
    └── ...
```

---

## 🔗 API Endpoints

### Auth Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/users` - Get all users (admin only)

### Notes Endpoints
- `GET /api/notes` - Get user's notes
- `GET /api/notes/:noteId` - Get single note
- `POST /api/notes` - Create note
- `PUT /api/notes/:noteId` - Update note
- `DELETE /api/notes/:noteId` - Delete note
- `GET /api/notes/admin/all` - Get all notes (admin only)

### Logs Endpoints
- `GET /api/logs` - Get all logs (admin only)
- `GET /api/logs/user/me` - Get my logs
- `GET /api/logs/stats/actions` - Action statistics (admin only)
- `GET /api/logs/stats/users` - User statistics (admin only)
- `GET /api/logs/export/csv` - Export logs as CSV (admin only)

---

## 📱 Common Workflows

### User Registration & Login
```
1. User clicks "Create Account"
2. Form sends POST /api/auth/signup
3. Backend creates user, returns token
4. Frontend stores token in localStorage
5. AuthContext updates user state
6. App redirects to User Dashboard
```

### Creating a Note
```
1. User enters title + content
2. Clicks "Create"
3. Frontend sends POST /api/notes (with token)
4. Backend creates note, logs action
5. Frontend refreshes notes list
6. Note appears in list
```

### Admin Views All Logs
```
1. Admin goes to AdminDashboard
2. Clicks "View Logs"
3. Frontend sends GET /api/logs (with admin token)
4. Backend checks user role, returns logs
5. AdminLogs component displays them
```

---

## 🎯 Next Steps

✅ **Backend Setup Complete!**

1. ✅ MongoDB running
2. ✅ Backend server on port 5000
3. ✅ Frontend updated to use API
4. ✅ Authentication working
5. ✅ Database schemas created

### Optional Enhancements:

- [ ] Deploy backend to Heroku/Railway/Vercel
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add user profiles
- [ ] Setup backup system
- [ ] Add search indexing
- [ ] Implement rate limiting
- [ ] Setup monitoring/logging

---

## 📚 Documentation

- **Backend Full Docs:** `server/README.md`
- **API Reference:** `server/README.md` (API Endpoints section)
- **Environment Setup:** This file
- **Frontend Integration:** Updated component files

---

## ✅ Success Checklist

When everything is working:

- [ ] Backend server running on `http://localhost:5000`
- [ ] MongoDB connected and logging output
- [ ] Frontend running on `http://localhost:5173`
- [ ] User signup creates account in database
- [ ] User login returns valid JWT token
- [ ] Notes are created in database
- [ ] Admin can view all logs
- [ ] Searches work with live data
- [ ] Logout clears authentication
- [ ] Token expires after 7 days

---

## 🎉 Integration Complete!

Your Notes App now has a fully functional backend with MongoDB persistence!

**To start developing:**

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
npm run dev

# Visit http://localhost:5173
```

Happy coding! 🚀
