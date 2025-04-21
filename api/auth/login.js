import { connectDb } from '../../lib/connectDb.js';
import User from '../../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../lib/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await connectDb();
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
