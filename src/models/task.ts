import mongoose from '../database';

const TaskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  notificationId: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date(),
  },
});

export default mongoose.model("Task", TaskSchema);