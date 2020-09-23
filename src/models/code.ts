import mongoose from '../database';

const CodeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date(),
  },
});

export default mongoose.model("Code", CodeSchema);