import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    name: String,
    avatar: String,
    isVerified: Boolean,
    role: String
  },
  content: String,
  images: [String],
  likes: { type: Number, default: 0 },
  comments: [
    {
      author: { name: String, avatar: String },
      text: String,
      timestamp: String
    }
  ],
  shares: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
