
import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for the habit'],
    trim: true,
    maxlength: [100, 'Habit name cannot be more than 100 characters'],
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastCompleted: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Habit || mongoose.model('Habit', HabitSchema);
