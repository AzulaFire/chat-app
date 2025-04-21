import { getOnlineUsers } from '../../lib/onlineTracker.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const onlineUsers = getOnlineUsers();
    res.status(200).json(onlineUsers);
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
