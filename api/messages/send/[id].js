import { connectDb } from '../../../lib/connectDb';
import Message from '../../../models/message.model';
import cloudinary from '../../../lib/cloudinary';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDb();

    const senderId = req.headers['x-user-id'];
    const { id: receiverId } = req.query;
    const { text, image } = req.body;

    if (!senderId || !receiverId)
      return res.status(400).json({ error: 'Missing user IDs' });

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

    // No socket.io on Vercel, so skip `io.to(...)`

    return res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error in sendMessage handler:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
