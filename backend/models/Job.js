// models/Job.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote']
  },
  salaryRange: String,
  description: {
    type: String,
    required: true
  },
  requirements: String,
  category: {
    type: String,
    default: 'Other'
  },
  skills: String,
  duration: String,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  applicationCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Job', jobSchema);