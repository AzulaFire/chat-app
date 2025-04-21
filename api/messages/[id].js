import { connectDb } from '../../lib/connectDb.js';
import Message from '../../models/message.model.js';

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDb();

    const myId = req.headers['x-user-id'];
    const { id: userToChatId } = req.query;

    if (!myId || !userToChatId)
      return res.status(400).json({ error: 'Missing user IDs' });

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
