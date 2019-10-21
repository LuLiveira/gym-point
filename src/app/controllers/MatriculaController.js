import { parseISO, addMonths, isBefore } from 'date-fns';
import * as Yup from 'yup';
import Plano from '../models/Planos';

class MatriculaController {
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

    const { start_date, plan_id } = req.body;

    const date = parseISO(start_date);

    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const plano = await Plano.findByPk(plan_id);

    const end_date = addMonths(date, plano.duration);

    const price = plano.price * plano.duration;

    console.log(price);
  }
}

export default new MatriculaController();
