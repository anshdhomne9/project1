
import mongoose from 'mongoose';

const CalendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the event'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide a start time for the event'],
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end time for the event'],
  },
  allDay: {
    type: Boolean,
    default: false,
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

export default mongoose.models.CalendarEvent || mongoose.model('CalendarEvent', CalendarEventSchema);
