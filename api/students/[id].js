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

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Student ID required' });
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      const student = await Student.findOne({ Student_ID: id }).select('-__v');
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      return res.status(200).json(student);
    }

    if (req.method === 'PUT') {
      const student = await Student.findOneAndUpdate(
        { Student_ID: id },
        req.body,
        { new: true }
      );
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      return res.status(200).json(student);
    }

    if (req.method === 'DELETE') {
      const student = await Student.findOneAndDelete({ Student_ID: id });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      return res.status(200).json({ message: 'Student deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
