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
    default: 'None'
  },
  Usage_Purpose: {
    type: String,
    default: 'General'
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
studentSchema.index({ College: 1, Year_Level: 1 });

// Virtual for average dependency score
studentSchema.virtual('avgDependency').get(function() {
  return (this.Reading_Dependency_Score + this.Writing_Dependency_Score + this.Numeracy_Dependency_Score) / 3;
});

// Virtual for risk status
studentSchema.virtual('isAtRisk').get(function() {
  const avgDep = (this.Reading_Dependency_Score + this.Writing_Dependency_Score + this.Numeracy_Dependency_Score) / 3;
  return avgDep > 5.5 && this.Motivation_Score < 4.5;
});

module.exports = mongoose.model('Student', studentSchema);
