import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import config from '../../config/auth';

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = request.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return response.status(400).json({ error: 'User does not exist' });
    }

    if (!(await user.validaPassword(password))) {
      return response.status(400).json({ error: 'Invalid password' });
    }

    const { id, name } = user;

    return response.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, config.secret, {
        expiresIn: config.expiresIn,
      }),
    });
  }
}

export default new SessionController();
