# Notes Application - Complete CRUD with Admin Logging

A modern React + Vite web application featuring complete CRUD (Create, Read, Update, Delete) operations with advanced admin logging and monitoring capabilities.

## 🚀 Features

### Core Functionality
- **CREATE**: Add new notes with title and content
- **READ**: Display all notes with search functionality
- **UPDATE**: Edit existing notes in real-time
- **DELETE**: Remove notes with confirmation
- **SEARCH**: Filter notes by title or content
- **EXPORT**: Download all notes as JSON file

### Admin Features
- **Admin Logging System**: Track all CRUD operations with timestamps
- **Action Statistics**: View counts of each operation type
- **Log Filtering**: Filter logs by action type
- **Log Export**: Download logs as JSON for auditing
- **Log Management**: Clear logs when needed

## 📋 Project Structure

```
src/
├── App.jsx              # Main application component
├── AdminLogs.jsx        # Admin logging panel component
├── logger.js            # Logging system utilities
├── api.js               # API configuration
├── index.css            # Global styling
└── main.jsx             # Application entry point
```

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Lint Code**
   ```bash
   npm run lint
   ```

## 💻 Usage Guide

### Creating a Note
1. Enter the note title in the "Note title..." field
2. Enter the note content in the "Note content..." field
3. Click the "✓ Create Note" button
4. A success notification will appear

### Editing a Note
1. Click the "✏️ Edit" button on any note
2. The note details will load in the form
3. Modify the title or content
4. Click "💾 Update Note" to save changes
5. Click "✕ Cancel" to discard changes

### Deleting a Note
1. Click the "🗑️ Delete" button on a note
2. Confirm the deletion when prompted
3. The note will be removed from the list

### Searching Notes
1. Use the "Search notes..." input field
2. Notes are filtered in real-time as you type
3. Clear the search to view all notes

### Exporting Notes
1. Click "📥 Export All Notes" button
2. A JSON file will be downloaded with all your notes
3. File name format: `notes-[timestamp].json`

### Admin Logging

#### View Logs
1. Click "Admin Logs" button (red button at the bottom)
2. Logs expand showing all recorded activities

#### View Statistics
- See counts of each action type (CREATE, READ, UPDATE, DELETE, etc.)
- Stats update in real-time as operations occur

#### Filter Logs
1. Use the dropdown to filter by action type
2. Shows only logs matching the selected action

#### Export Logs
1. Click "📥 Export Logs" button
2. Downloads logs as `admin-logs-[timestamp].json`

#### Clear Logs
1. Click "🗑️ Clear Logs" button
2. Confirm when prompted
3. All logs will be deleted

## 📊 Admin Log Entries

Each log entry contains:
- **Timestamp**: Date and time of the operation
- **Action**: Type of operation (CREATE, READ, UPDATE, DELETE, EXPORT, EXPORT, ERROR)
- **Details**: Specific information about what was performed
- **User**: Admin (fixed for this version)

### Example Log Actions
```
[CREATE] Note created - Title: "My First Note"
[READ] Fetched 5 notes from database
[UPDATE] Note updated - ID: 1234567890, Title: "Updated Title"
[DELETE] Note deleted - ID: 1234567890, Title: "My First Note"
[EXPORT] Exported 5 notes
```

## 🔧 Technology Stack

- **React 19**: UI framework
- **Vite 7**: Build tool and dev server
- **Axios**: HTTP client for API calls
- **JavaScript (ES6+)**: Programming language

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile devices
- **Gradient Background**: Modern purple gradient background
- **Card-based Layout**: Clean note display in grid format
- **Sticky Form**: Form stays visible while scrolling
- **Notifications**: Toast notifications for user feedback
- **Smooth Animations**: Fade-in/out effects for notifications
- **Color-coded Actions**: Different colors for different operations
- **Hover Effects**: Interactive button feedback

## 🔒 Notes on Backend Integration

Currently, the app works in mock mode (stores data in memory). To integrate with a real backend:

1. **Update API endpoint** in `src/api.js`:
   ```javascript
   baseURL: 'http://your-api-url/api'
   ```

2. **Ensure backend implements routes**:
   - `GET /notes` - Fetch all notes
   - `POST /notes` - Create new note
   - `PUT /notes/:id` - Update note
   - `DELETE /notes/:id` - Delete note
   - `GET /export` - Export notes

3. **Backend should accept/return**:
   ```json
   {
     "_id": "unique_id",
     "title": "Note Title",
     "content": "Note Content",
     "createdAt": "2025-02-28 10:30:45"
   }
   ```

## 🚀 Performance Tips

- Data is stored in state (refreshed on page reload in mock mode)
- Consider implementing persistence layer for production
- Admin logs are kept in memory; clear periodically for long sessions
- Use log export feature to backup logs before clearing

## 📝 Logging System Details

The logger provides the following methods:

```javascript
// Log an action
logger.log(action, details)

// Get all logs
logger.getLogs()

// Clear all logs
logger.clearLogs()

// Get logs as JSON string
logger.exportLogs()

// Get action statistics
logger.getActionStats()
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Notes not persisting after refresh | This is expected in mock mode. Integrate with backend to persist data. |
| API errors | Check if backend server is running on http://localhost:5000 |
| Styles not applying | Clear browser cache and restart dev server |
| Cannot install packages | Ensure Node.js and npm are installed |

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Development

To extend the application:

1. **Add new features**: Modify components in `src/` directory
2. **Enhance logging**: Add custom log actions to `src/logger.js`
3. **Customize styling**: Update `src/index.css` and component styles
4. **Connect backend**: Update `src/api.js` with real endpoints

## 📞 Support

For issues or questions, refer to the code comments or review the component documentation.
