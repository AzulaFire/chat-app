import { verifyToken } from '../../lib/utils.js';
import { connectDb } from '../../lib/connectDb.js';
import User from '../../models/user.model.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  await connectDb();

  try {
    const user = await verifyToken(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // Update the lastActive time
    await User.findByIdAndUpdate(user._id, { lastActive: new Date() });

    res.status(200).json(user);
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
