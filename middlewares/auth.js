import jwt from 'jsonwebtoken';
import AuthError from '../errors/authError.js';

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Auth is needed'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
    );
  } catch (e) {
    next(new AuthError('Invalid token'));
    return;
  }
  req.user = payload;
  next();
};

export default auth;
