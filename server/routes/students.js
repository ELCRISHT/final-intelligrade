const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students (with optional college filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.college) {
      filter.College = req.query.college;
    }
    if (req.query.year) {
      filter.Year_Level = parseInt(req.query.year);
    }
    
    const students = await Student.find(filter).select('-__v').sort({ Student_ID: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ Student_ID: req.params.id }).select('-__v');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new student
router.post('/', async (req, res) => {
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
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// BULK import students
router.post('/bulk', async (req, res) => {
  try {
    const { students } = req.body;
    let success = 0;
    let failed = 0;

    for (const studentData of students) {
      try {
        await Student.findOneAndUpdate(
          { Student_ID: studentData.Student_ID },
          studentData,
          { upsert: true, new: true }
        );
        success++;
      } catch (error) {
        failed++;
      }
    }

    res.json({ success, failed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { Student_ID: req.params.id },
      req.body,
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ Student_ID: req.params.id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
