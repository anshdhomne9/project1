
import mongoose from 'mongoose';

const MoodEntrySchema = new mongoose.Schema({
  mood: {
    type: String,
    required: [true, 'Please select a mood'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date for the mood entry'],
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure only one mood entry per user per day
MoodEntrySchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.models.MoodEntry || mongoose.model('MoodEntry', MoodEntrySchema);
