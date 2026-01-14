const connectDB = require('../lib/mongodb');
const Student = require('../lib/models/Student');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

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

    return res.status(200).json({ success, failed });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
