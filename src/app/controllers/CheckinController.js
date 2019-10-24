import { startOfDay, endOfDay, subDays } from 'date-fns';

import { Op } from 'sequelize';
import User from '../models/User';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [
            subDays(startOfDay(new Date()), 7),
            endOfDay(new Date()),
          ],
        },
      },
    });

    if (checkins.length >= 5) {
      return res
        .status(400)
        .json({ error: 'You can only do 5 checkins within 7 calendar days' });
    }

    const checkin = await Checkin.create({
      student_id: id,
    });

    return res.json(checkin);
  }

  async index(req, res) {
    const { id } = req.params;

    const { page = 1 } = req.query;

    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
      },
      order: [['created_at', 'DESC']],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (!checkins) {
      return res.status(400).json({ error: 'Invalid id ' });
    }

    return res.json(checkins);
  }
}

export default new CheckinController();
