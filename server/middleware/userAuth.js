import jwt from 'jsonwebtoken';

export function requireUserAuth(request, response, next) {
  const authHeader = request.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return response.status(401).json({ message: 'User token missing' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development_secret');
    request.user = payload;
    return next();
  } catch {
    return response.status(401).json({ message: 'Invalid or expired user token' });
  }
}
