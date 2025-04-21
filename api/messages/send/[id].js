import { connectDb } from '../../../lib/connectDb.js';
import Message from '../../../models/message.model.js';
import cloudinary from '../../../lib/cloudinary.js';
import { verifyToken } from '../../../lib/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDb();

    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const senderId = user._id;
    const { id: receiverId } = req.query;
    const { text, image } = req.body;

    if (!receiverId) {
      return res.status(400).json({ error: 'Missing receiver ID' });
    }

    let imageUrl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    return res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error in sendMessage handler:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
