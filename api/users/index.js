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

  try {
    await connectDB();

    if (req.method === 'GET') {
      // GET all users
      const users = await User.find().select('-__v');
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      // CREATE new user
      try {
        const user = new User({
          uid: req.body.uid,
          email: req.body.email,
          name: req.body.name,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          middleInitial: req.body.middleInitial,
          college: req.body.college,
          contactNumber: req.body.contactNumber,
          role: req.body.role,
          emailVerified: req.body.emailVerified
        });

        const newUser = await user.save();
        return res.status(201).json(newUser);
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key - update existing user
          const existingUser = await User.findOneAndUpdate(
            { uid: req.body.uid },
            req.body,
            { new: true }
          );
          return res.status(200).json(existingUser);
        }
        return res.status(400).json({ message: error.message });
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
