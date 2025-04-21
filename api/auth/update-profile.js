import { connectDb } from '../../lib/connectDb.js';
import User from '../../models/user.model.js';
import cloudinary from '../../lib/cloudinary.js';
import { verifyToken } from '../../lib/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end();

  await connectDb();

  try {
    const user = await verifyToken(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: 'Profile pic is required' });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
