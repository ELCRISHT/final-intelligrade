const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Student_ID: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  College: {
    type: String,
    required: true,
    index: true
  },
  Year_Level: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  Reading_Dependency_Score: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  Writing_Dependency_Score: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  Numeracy_Dependency_Score: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  Motivation_Score: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  AI_Tools_Count: {
    type: Number,
    default: 0
  },
  Primary_AI_Tool: {
    type: String,
    default: 'ChatGPT'
  },
  Usage_Purpose: {
    type: String,
    default: 'General'
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);
