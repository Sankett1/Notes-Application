# Notes App Backend API

Complete Node.js/Express backend with MongoDB integration for the Notes Application.

## 📋 Features

✅ User authentication (signup/login with JWT)  
✅ Role-based access control (user/admin)  
✅ CRUD operations for notes  
✅ Admin logging system  
✅ Search functionality  
✅ Password hashing with bcrypt  
✅ JWT token-based authentication  
✅ MongoDB with Mongoose ODM  
✅ Comprehensive error handling  
✅ CORS enabled  

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- npm or yarn

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Setup Environment Variables

Create a `.env` file in the `server` directory (optional):

```env
# MongoDB Connection
# If you omit this variable, the app will default to mongodb://localhost:27017/notes-app
MONGODB_URI=mongodb://localhost:27017/notes-app

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (change this in production)
# Used to sign tokens. If not provided a default development secret will be used
# but you should set a strong secret in any real deployment.
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345

# CORS
CORS_ORIGIN=http://localhost:5173
```

**For MongoDB Cloud (Atlas):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes-app
```

### Step 3: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server runs at: `http://localhost:5000`

### 🛠️ Seeding the Database

A simple seeding script is provided to bootstrap the database with sample users, notes, and logs.

1. Ensure your `.env` file is configured with a working `MONGODB_URI`.
2. From the `server` directory run:
   ```bash
   npm run seed
   ```

   This will **clear existing users, notes, and logs** then insert:
   - Admin user (`admin` / `admin123`)
   - Regular user (`jane` / `user123`)
   - A couple of starter notes for `jane`
   - Log entries representing the seed actions

   You can modify `seed.js` if you want different initial data or to avoid clearing collections.


---

## 📁 Project Structure

```
server/
├── config/
│   └── database.js           ← MongoDB connection
├── models/
│   ├── User.js               ← User schema
│   ├── Note.js               ← Note schema
│   ├── Log.js                ← Activity log schema
│   └── index.js
├── middleware/
│   ├── auth.js               ← JWT authentication
│   └── logger.js             ← Activity logging
├── routes/
│   ├── auth.js               ← Auth endpoints
│   ├── notes.js              ← Notes endpoints
│   └── logs.js               ← Logs endpoints
├── .env.example              ← Environment template
├── .gitignore
├── package.json
├── server.js                 ← Main entry point
└── README.md
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

#### Signup (User or Admin)
```
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",           // "user" or "admin"
  "department": null        // Only for admin
}

Response:
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john",  // or "email"
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": { ... }
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Get All Users (Admin Only)
```
GET /api/auth/users
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "count": 5,
  "data": [ ... ]
}
```

---

### Notes (`/api/notes`)

#### Create Note
```
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content",
  "tags": ["important", "work"]
}

Response:
{
  "success": true,
  "message": "Note created successfully",
  "data": { ... }
}
```

#### Get All Notes (User's Notes)
```
GET /api/notes
Authorization: Bearer <token>
Query Parameters:
  - archived: "true" or "false" (optional)
  - search: "search term" (optional)

Response:
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

#### Get Single Note
```
GET /api/notes/:noteId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Update Note
```
PUT /api/notes/:noteId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "tags": ["updated"],
  "isArchived": false
}

Response:
{
  "success": true,
  "message": "Note updated successfully",
  "data": { ... }
}
```

#### Delete Note
```
DELETE /api/notes/:noteId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Note deleted successfully"
}
```

#### Get All Notes (Admin Only)
```
GET /api/notes/admin/all
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "count": 50,
  "data": [ ... ]
}
```

---

### Activity Logs (`/api/logs`)

#### Get All Logs (Admin Only)
```
GET /api/logs
Authorization: Bearer <admin_token>
Query Parameters:
  - action: "CREATE", "UPDATE", "DELETE", "LOGIN", etc. (optional)
  - user: "username" (optional)
  - days: 7 (last N days, default 7)

Response:
{
  "success": true,
  "count": 100,
  "data": [ ... ]
}
```

#### Get My Activity Logs
```
GET /api/logs/user/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 20,
  "data": [ ... ]
}
```

#### Get Action Statistics (Admin Only)
```
GET /api/logs/stats/actions
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": {
    "CREATE": 45,
    "UPDATE": 23,
    "DELETE": 12,
    "LOGIN": 100
  }
}
```

#### Get User Activity Stats (Admin Only)
```
GET /api/logs/stats/users
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "john",
      "count": 50,
      "lastAction": "2024-02-28T10:30:00.000Z"
    }
  ]
}
```

#### Export Logs as CSV (Admin Only)
```
GET /api/logs/export/csv
Authorization: Bearer <admin_token>

Response: CSV file download
```

#### Clear All Logs (Admin Only)
```
DELETE /api/logs/clear
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "confirmDelete": true
}

Response:
{
  "success": true,
  "message": "500 logs deleted",
  "deletedCount": 500
}
```

---

## 🗄️ Database Schemas

### User Schema
```javascript
{
  username: String (unique, 3+ chars),
  email: String (unique, valid email),
  password: String (hashed, 6+ chars),
  role: String ("user" or "admin"),
  department: String (only for admins),
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean (default: true)
}
```

### Note Schema
```javascript
{
  title: String (required, max 200 chars),
  content: String (required, max 5000 chars),
  userId: ObjectId (reference to User),
  username: String,
  createdAt: Date,
  updatedAt: Date,
  tags: Array<String>,
  isArchived: Boolean (default: false)
}
```

### Log Schema
```javascript
{
  action: String (CREATE, READ, UPDATE, DELETE, LOGIN, etc.),
  details: String,
  user: ObjectId (reference to User),
  username: String,
  userRole: String ("user" or "admin"),
  resourceType: String ("note", "user", "system"),
  resourceId: String (optional),
  ipAddress: String (optional),
  timestamp: Date
}
```

---

## 🔐 Authentication

### JWT Token Flow

1. User signs up/logs in
2. Server returns JWT token
3. Client stores token (localStorage/sessionStorage)
4. Client sends token in `Authorization: Bearer <token>` header
5. Server verifies token on protected routes

### Token Expiration
- Tokens expire in **7 days**
- Users need to login again after expiration

### Protected Routes
All routes except `/api/auth/signup` and `/api/auth/login` require a valid JWT token.

---

## 🛡️ Security Features

✅ Password hashing with bcryptjs (salt rounds: 10)  
✅ JWT token-based authentication  
✅ Role-based access control (RBAC)  
✅ Password never stored in plain text  
✅ CORS protection  
✅ Mongoose validation  
✅ Error handling without sensitive data leaks  

---

## 🧪 Testing Endpoints with cURL

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "password123"
  }'
```

### Create Note
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My Note",
    "content": "Note content here"
  }'
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Check if MongoDB is running locally
- For MongoDB Atlas, verify connection string
- Check firewall settings

### Issue: "CORS error from frontend"
**Solution:**
- Verify `CORS_ORIGIN` in `.env` matches frontend URL
- Frontend should be at `http://localhost:5173`

### Issue: "Invalid token" errors
**Solution:**
- Token might be expired (7 days)
- User needs to login again
- Ensure token is passed correctly: `Authorization: Bearer <token>`

### Issue: Empty logs
**Solution:**
- Logs are created automatically on CRUD operations
- Admin needs to have made actions for logs to appear

---

## 📦 Production Deployment

### Before Deployment

1. ✅ Change `JWT_SECRET` to a strong, random value
2. ✅ Set `NODE_ENV=production`
3. ✅ Use MongoDB Atlas (cloud) instead of local
4. ✅ Update `CORS_ORIGIN` to your domain
5. ✅ Use HTTPS for all API calls
6. ✅ Set secure environment variables

### Deployment Platforms

**Recommended:**
- **Heroku** - Easy deployment, free tier available
- **Railway** - Modern alternative to Heroku
- **Vercel** - For serverless deployment
- **AWS/DigitalOcean** - For full control

### Example Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGODB_URI=your_mongodb_url
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Official Docs](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)

---

## 🤝 Integration with Frontend

The frontend (React) is already configured to use this API:

```javascript
// src/api.js
export const api = axios.create({ 
  baseURL: 'http://localhost:5000/api',
});
```

To integrate:
1. Ensure backend is running on `http://localhost:5000`
2. Update auth to store JWT token from login response
3. Include token in all requests
4. Handle token refresh on expiration

---

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Setup `.env` file with MongoDB connection
3. ✅ Start server: `npm run dev`
4. ✅ Test endpoints with cURL or Postman
5. ✅ Connect frontend to backend
6. ✅ Test complete flow

---

**Backend is ready for use!** 🚀

For questions or issues, check the error logs and ensure all environment variables are set correctly.
