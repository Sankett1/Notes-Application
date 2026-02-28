import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/database.js';
import { User } from './models/User.js';
import { Note } from './models/Note.js';
import { Log } from './models/Log.js';

// load env vars (must be at root of server folder)
dotenv.config();

async function seed() {
  // use env var if provided, otherwise fall back to local default
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI not set, defaulting to mongodb://localhost:27017/notes-app');
  }
  await connectDB();

  // clear collections - comment out if you want to keep existing data
  await Promise.all([User.deleteMany({}), Note.deleteMany({}), Log.deleteMany({})]);
  console.log('Cleared existing users, notes and logs');

  // create sample users
  const admin = new User({
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    department: 'IT & System Admin'
  });

  const user = new User({
    username: 'jane',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user'
  });

  await admin.save();
  await user.save();
  console.log('Created sample users: admin, jane');

  // create some notes for jane
  const notesData = [
    {
      title: 'Welcome to Notes',
      content: 'This is your first note. Feel free to edit or delete it.',
      userId: user._id,
      username: user.username
    },
    {
      title: 'Second note',
      content: 'You can also use tags, export notes, and search through them.',
      userId: user._id,
      username: user.username,
      tags: ['tips', 'getting-started']
    }
  ];

  const createdNotes = await Note.insertMany(notesData);
  console.log(`Created ${createdNotes.length} notes for jane`);

  // create a log entry for each action
  const logEntries = [];
  logEntries.push(
    new Log({ action: 'CREATE', details: 'Created initial notes', user: user._id, username: user.username, userRole: user.role, resourceType: 'note' }),
    new Log({ action: 'CREATE', details: 'Admin seeded database', user: admin._id, username: admin.username, userRole: admin.role, resourceType: 'system' })
  );
  await Log.insertMany(logEntries);
  console.log('Inserted sample log entries');

  // disconnect
  await disconnectDB();
  console.log('Seed complete');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});