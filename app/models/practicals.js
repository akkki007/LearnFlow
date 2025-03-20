import mongoose from 'mongoose';

// Define the Practical Schema
const practicalSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true, // Subject is required
    trim: true, // Remove extra spaces
  },
  practicalNo: {
    type: Number,
    required: true, // Practical number is required
    unique: true, // Ensure each practical number is unique
  },
  title: {
    type: String,
    required: true, // Title is required
    trim: true,
  },
  description: {
    type: String,
    required: true, // Description is required
    trim: true,
  },
  relatedTheory: {
    type: String,
    required: true, // Related theory is required
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set the update date
  },
  tid:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }
});

// Update the `updatedAt` field before saving the document
practicalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Practical Model
const Practical = mongoose.model('Practical', practicalSchema);

export default Practical