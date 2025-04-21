import { connectDb } from '../../lib/connectDb.js';
import User from '../../models/user.model.js';
import { verifyToken } from '../../lib/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDb();

    const user = await verifyToken(req); // 👈 Extract user from cookie
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const users = await User.find({ _id: { $ne: user._id } }).select(
      '-password'
    );
    return res.status(200).json(users);
  } catch (err) {
    console.error('Error in users handler:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
