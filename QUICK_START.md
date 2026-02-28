# Quick Start Guide - Notes Application

## ⚡ Get Started in 30 Seconds

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The app will open at `http://localhost:5173`

### 3. Start Using the App

#### Create a Note
- Enter title and content in the left panel
- Click "✓ Create Note"
- See your note appear in the right panel

#### Edit a Note
- Click "✏️ Edit" on any note
- Modify the content
- Click "💾 Update Note"

#### Delete a Note
- Click "🗑️ Delete" on a note
- Confirm deletion

#### Search Notes
- Type in the "Search notes..." field to filter in real-time

#### View Admin Logs
- Click the "▶ Admin Logs" button at the bottom (red)
- Expand to see:
  - Action counts
  - Detailed logs with timestamps
  - Log filtering options

#### Export Data
- **Notes**: Click "📥 Export All Notes"
- **Logs**: In admin panel, click "📥 Export Logs"

## 📁 Application Files

```
src/
├── App.jsx          → Main note management interface
├── AdminLogs.jsx    → Admin logging dashboard
├── logger.js        → Logging system
├── api.js           → API configuration
└── index.css        → Styling
```

## 🔧 What's Happening Behind the Scenes

### CRUD Operations Logging
Every action is automatically logged:
- ✅ **CREATE**: When you add a new note
- 📖 **READ**: When the app fetches your notes
- ✏️ **UPDATE**: When you edit a note
- 🗑️ **DELETE**: When you remove a note
- 📥 **EXPORT**: When you export notes or logs

### Admin Monitoring
The admin panel shows:
- **Timestamp**: When each action occurred
- **Action Type**: What operation was performed
- **Details**: Specific info (note titles, IDs, etc.)
- **Statistics**: Count of each action type

## 🎯 Key Features

✅ **Full CRUD** - Create, Read, Update, Delete notes
✅ **Search** - Real-time note filtering
✅ **Admin Logging** - Track all operations
✅ **Export** - Download notes and logs as JSON
✅ **Responsive Design** - Works on all devices
✅ **Modern UI** - Beautiful gradient design with notifications

## 💡 Tips

1. **Log Filtering**: Use the dropdown in admin panel to see specific action types
2. **Backup Data**: Export notes and logs regularly for backup
3. **Clear Logs**: Clear old logs periodically to keep the app fast
4. **Search Filter**: The search works on both title and content

## 🔗 Backend Integration (Optional)

The app currently works standalone (mock mode). To connect a real backend:

1. Update the API URL in `src/api.js`:
   ```javascript
   baseURL: 'http://your-backend-url/api'
   ```

2. Ensure your backend has these endpoints:
   - `GET /notes` - Get all notes
   - `POST /notes` - Create note
   - `PUT /notes/:id` - Update note
   - `DELETE /notes/:id` - Delete note

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Port 5173 in use | Kill the process or use `npm run dev -- --port 3000` |
| Notes lost on refresh | Normal in mock mode. Add backend to persist data. |
| API errors | Backend not running or wrong URL in `api.js` |

## 📞 Need Help?

- Check the detailed `README.md` file
- Review code comments in `src/` files
- Check browser console for errors (F12)

Enjoy your notes app! 🚀
