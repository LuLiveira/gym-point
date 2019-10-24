import { parseISO, addMonths, isBefore, subDays, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import currencyFormat from 'currency-formatter';
import * as Yup from 'yup';
import Mail from '../../lib/mail';
import Plano from '../models/Planos';
import Student from '../models/Student';
import Matricula from '../models/Matricula';

class MatriculaController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const matriculas = await Matricula.findAll({
      order: [['end_date', 'DESC']],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(matriculas);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .required()
        .positive(),
      plan_id: Yup.number()
        .required()
        .positive(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, start_date, plan_id } = req.body;

    const student = await Student.findByPk(student_id, {
      attributes: ['name', 'email'],
    });

    if (!student) {
      return res.status(400).json({ error: 'Invalid student id' });
    }

    const date = parseISO(start_date);

    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const matriculaVigente = await Matricula.findOne({
      where: {
        student_id,
      },
    });

    if (matriculaVigente) {
      if (!isBefore(matriculaVigente.end_date, date)) {
        return res.status(400).json({ error: 'Invalid date' });
      }
    }

    const plano = await Plano.findByPk(plan_id);

    const end_date = addMonths(date, plano.duration);

    const price = plano.price * plano.duration;

    const matricula = await Matricula.create({
      student_id,
      start_date: date,
      end_date,
      plan_id,
      price,
    });

    const formattedDate = format(end_date, 'dd-MMMM-yyyy', { locale: pt });
    const formattedCurrency = currencyFormat.format(price, { code: 'BRL' });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula Efetuada',
      text: `O plano escolhido foi ${plano.title} com término em ${formattedDate} e valor total de ${formattedCurrency}.
      Bem-Vindo a Gym.`,
    });

    return res.json(matricula);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      plan_id: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails ' });
    }

    const { id } = req.params;

    const { start_date, plan_id } = req.body;

    const matricula = await Matricula.findByPk(id);

    if (!matricula) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const date = parseISO(start_date);

    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const plano = req.body.plan_id
      ? await Plano.findByPk(plan_id)
      : await Plano.findByPk(matricula.plan_id);

    const price = plano.price * plano.duration;

    const end_date = addMonths(date, plano.duration);

    const matriculaAtualizada = await matricula.update({
      start_date,
      end_date,
      price,
      plan_id,
    });

    return res.json(matriculaAtualizada);
  }
}

export default new MatriculaController();
