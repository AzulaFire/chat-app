export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    res.setHeader(
      'Set-Cookie',
      'jwt=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
    );
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
