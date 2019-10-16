import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../config/auth';

export default async (request, response, next) => {
  const header = request.headers.authorization;

  if (!header) {
    return response.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = header.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    request.userId = decoded.id;

    return next();
  } catch (err) {
    return response.status(400).json({ error: 'Token is invalid ' });
  }
};
