import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Mail from '../../lib/mail';

class HelpOrderController {
  async index(req, res) {
    const helpOrderNoReply = await HelpOrder.findAll({
      where: {
        answer: null,
      },
    });

    if (!helpOrderNoReply) {
      return res
        .status(400)
        .json({ error: 'All help orders have reply. Congrats!' });
    }

    return res.json(helpOrderNoReply);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'The text format is invalid' });
    }

    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    const { answer } = req.body;

    const answer_at = new Date();

    const reply = await helpOrder.update({
      answer,
      answer_at,
    });

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Matricula Efetuada',
      text: `A sua pergunta: "${reply.question}" feita para a Gym foi respondida!
      Confira...
      Resposta: ${reply.answer}`,
    });

    return res.json(reply);
  }
}

export default new HelpOrderController();
