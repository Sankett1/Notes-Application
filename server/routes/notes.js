import express from 'express';
import { Note } from '../models/index.js';
import { protect } from '../middleware/auth.js';
import { logActivity, asyncHandler } from '../middleware/logger.js';

const router = express.Router();

// Create a note
router.post('/', protect, asyncHandler(async (req, res) => {
  const { title, content, tags = [] } = req.body;

  // Validation
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const note = await Note.create({
    title,
    content,
    tags,
    userId: req.user._id,
    username: req.user.username
  });

  // Log activity
  await logActivity('CREATE', `User ${req.user.username} created note: "${title}"`, req.user, 'note', note._id);

  res.status(201).json({
    success: true,
    message: 'Note created successfully',
    data: note
  });
}));

// Get all notes for current user
router.get('/', protect, asyncHandler(async (req, res) => {
  const { archived = false, search = '' } = req.query;

  let query = { userId: req.user._id };

  if (archived === 'true') {
    query.isArchived = true;
  } else if (archived === 'false') {
    query.isArchived = false;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  const notes = await Note.find(query).sort({ createdAt: -1 });

  // Log activity
  await logActivity('READ', `User ${req.user.username} fetched notes`, req.user, 'note');

  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes
  });
}));

// Get single note by ID
router.get('/:noteId', protect, asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  // Check ownership
  if (note.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to access this note' });
  }

  // Log activity
  await logActivity('READ', `User ${req.user.username} viewed note: "${note.title}"`, req.user, 'note', note._id);

  res.status(200).json({
    success: true,
    data: note
  });
}));

// Update a note
router.put('/:noteId', protect, asyncHandler(async (req, res) => {
  const { title, content, tags, isArchived } = req.body;

  let note = await Note.findById(req.params.noteId);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  // Check ownership
  if (note.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update this note' });
  }

  // Update fields
  if (title) note.title = title;
  if (content) note.content = content;
  if (tags) note.tags = tags;
  if (isArchived !== undefined) note.isArchived = isArchived;

  await note.save();

  // Log activity
  await logActivity('UPDATE', `User ${req.user.username} updated note: "${note.title}"`, req.user, 'note', note._id);

  res.status(200).json({
    success: true,
    message: 'Note updated successfully',
    data: note
  });
}));

// Delete a note
router.delete('/:noteId', protect, asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  // Check ownership
  if (note.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this note' });
  }

  const noteTitle = note.title;
  await Note.findByIdAndDelete(req.params.noteId);

  // Log activity
  await logActivity('DELETE', `User ${req.user.username} deleted note: "${noteTitle}"`, req.user, 'note', req.params.noteId);

  res.status(200).json({
    success: true,
    message: 'Note deleted successfully'
  });
}));

// Get all notes (admin only)
router.get('/admin/all', protect, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access this route' });
  }

  const notes = await Note.find().sort({ createdAt: -1 });

  await logActivity('ACCESS', `Admin ${req.user.username} accessed all notes`, req.user, 'system');

  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes
  });
}));

export default router;
