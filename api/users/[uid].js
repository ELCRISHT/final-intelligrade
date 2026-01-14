const connectDB = require('../lib/mongodb');
const User = require('../lib/models/User');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ message: 'User ID required' });
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      const user = await User.findOne({ uid }).select('-__v');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    }

    if (req.method === 'PUT') {
      const user = await User.findOneAndUpdate(
        { uid },
        req.body,
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    }

    if (req.method === 'DELETE') {
      const user = await User.findOneAndDelete({ uid });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
