const connectDB = require('../lib/mongodb');
const Student = require('../lib/models/Student');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      const filter = {};
      if (req.query.college) {
        filter.College = req.query.college;
      }
      if (req.query.year) {
        filter.Year_Level = parseInt(req.query.year);
      }
      
      const students = await Student.find(filter).select('-__v').sort({ Student_ID: 1 });
      return res.status(200).json(students);
    }

    if (req.method === 'POST') {
      const student = new Student({
        Student_ID: req.body.Student_ID,
        College: req.body.College,
        Year_Level: req.body.Year_Level,
        Reading_Dependency_Score: req.body.Reading_Dependency_Score,
        Writing_Dependency_Score: req.body.Writing_Dependency_Score,
        Numeracy_Dependency_Score: req.body.Numeracy_Dependency_Score,
        Motivation_Score: req.body.Motivation_Score,
        AI_Tools_Count: req.body.AI_Tools_Count,
        Primary_AI_Tool: req.body.Primary_AI_Tool,
        Usage_Purpose: req.body.Usage_Purpose
      });

      try {
        const newStudent = await student.save();
        return res.status(201).json(newStudent);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
