import { connectDb } from '../../../lib/connectDb.js';
import User from '../../../models/user.model.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    await connectDb();

    const THIRTY_SECONDS_AGO = new Date(Date.now() - 30 * 1000);

    const users = await User.find({
      lastActive: { $gte: THIRTY_SECONDS_AGO },
    }).select('_id');

    const onlineUserIds = users.map((user) => user._id.toString());

    console.log('Online users:', onlineUserIds);

    res.status(200).json(onlineUserIds);
  } catch (error) {
    console.error('Error in /auth/online:', error);
    res.status(500).json({ message: 'Failed to get online users' });
  }
}
