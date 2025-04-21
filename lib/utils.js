import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.VITE_JWT_SECRET;

export function generateToken(userId, res) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

  const isProd = process.env.VITE_NODE_ENV === 'production';

  res.setHeader(
    'Set-Cookie',
    `jwt=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${
      isProd ? '; Secure' : ''
    }`
  );
}

export async function verifyToken(req) {
  const token = req.cookies?.jwt;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    return user;
  } catch {
    return null;
  }
}
