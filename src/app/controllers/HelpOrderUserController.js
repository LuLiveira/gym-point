import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderUserController {
  async index(req, res) {
    const { id } = req.params;

    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: id,
      },
    });

    if (!helpOrders) {
      return res.status(400).json({ error: "User don't have help order" });
    }

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'The text format is invalid ' });
    }

    const { id } = req.params;

    const help = await HelpOrder.create({
      student_id: id,
      question: req.body.question,
    });

    return res.json(help);
  }
}

export default new HelpOrderUserController();
