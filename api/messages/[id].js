import { connectDb } from '../../lib/connectDb.js';
import Message from '../../models/message.model.js';
import { verifyToken } from '../../lib/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDb();

    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const myId = user._id;
    const { id: userToChatId } = req.query;

    if (!userToChatId) {
      return res.status(400).json({ error: 'Missing user to chat ID' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.error('Error in getMessages handler:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
