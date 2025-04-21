import { verifyToken } from '../../lib/utils.js';
import { updateUserLastActive } from '../../lib/onlineTracker.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const user = await verifyToken(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // Update lastActive timestamp for polling online tracking
    await updateUserLastActive(user._id);

    res.status(200).json(user);
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
