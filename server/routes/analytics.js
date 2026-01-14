const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET analytics summary
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.college) {
      filter.College = req.query.college;
    }

    const students = await Student.find(filter);
    const totalStudents = students.length;

    if (totalStudents === 0) {
      return res.json({
        totalStudents: 0,
        avgReading: 0,
        avgWriting: 0,
        avgNumeracy: 0,
        overallAvg: 0,
        avgMotivation: 0,
        atRiskCount: 0,
        atRiskPercentage: 0,
        collegeBreakdown: [],
        yearBreakdown: [],
        toolBreakdown: []
      });
    }

    // Calculate averages
    const avgReading = students.reduce((acc, s) => acc + s.Reading_Dependency_Score, 0) / totalStudents;
    const avgWriting = students.reduce((acc, s) => acc + s.Writing_Dependency_Score, 0) / totalStudents;
    const avgNumeracy = students.reduce((acc, s) => acc + s.Numeracy_Dependency_Score, 0) / totalStudents;
    const overallAvg = (avgReading + avgWriting + avgNumeracy) / 3;
    const avgMotivation = students.reduce((acc, s) => acc + s.Motivation_Score, 0) / totalStudents;

    // At-risk students
    const atRiskStudents = students.filter(s => {
      const avgDep = (s.Reading_Dependency_Score + s.Writing_Dependency_Score + s.Numeracy_Dependency_Score) / 3;
      return avgDep > 5.5 && s.Motivation_Score < 4.5;
    });

    // College breakdown
    const collegeMap = {};
    students.forEach(s => {
      if (!collegeMap[s.College]) {
        collegeMap[s.College] = { totalDep: 0, count: 0 };
      }
      const avgDep = (s.Reading_Dependency_Score + s.Writing_Dependency_Score + s.Numeracy_Dependency_Score) / 3;
      collegeMap[s.College].totalDep += avgDep;
      collegeMap[s.College].count++;
    });
    const collegeBreakdown = Object.entries(collegeMap).map(([name, data]) => ({
      name,
      avgDependency: data.totalDep / data.count,
      count: data.count
    }));

    // Year level breakdown
    const yearMap = {};
    students.forEach(s => {
      if (!yearMap[s.Year_Level]) {
        yearMap[s.Year_Level] = { totalDep: 0, count: 0 };
      }
      const avgDep = (s.Reading_Dependency_Score + s.Writing_Dependency_Score + s.Numeracy_Dependency_Score) / 3;
      yearMap[s.Year_Level].totalDep += avgDep;
      yearMap[s.Year_Level].count++;
    });
    const yearBreakdown = Object.entries(yearMap).map(([year, data]) => ({
      year: parseInt(year),
      avgDependency: data.totalDep / data.count,
      count: data.count
    })).sort((a, b) => a.year - b.year);

    // Tool breakdown
    const toolMap = {};
    students.forEach(s => {
      toolMap[s.Primary_AI_Tool] = (toolMap[s.Primary_AI_Tool] || 0) + 1;
    });
    const toolBreakdown = Object.entries(toolMap).map(([tool, count]) => ({
      tool,
      count
    })).sort((a, b) => b.count - a.count);

    res.json({
      totalStudents,
      avgReading: parseFloat(avgReading.toFixed(2)),
      avgWriting: parseFloat(avgWriting.toFixed(2)),
      avgNumeracy: parseFloat(avgNumeracy.toFixed(2)),
      overallAvg: parseFloat(overallAvg.toFixed(2)),
      avgMotivation: parseFloat(avgMotivation.toFixed(2)),
      atRiskCount: atRiskStudents.length,
      atRiskPercentage: parseFloat(((atRiskStudents.length / totalStudents) * 100).toFixed(1)),
      collegeBreakdown,
      yearBreakdown,
      toolBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
