import * as Yup from 'yup';
import Plano from '../models/Planos';

class PlanoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.string().required(),
      price: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Invalid credencials' });
    }

    const plano = await Plano.create(req.body);

    return res.json(plano);
  }

  async index(req, res) {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Invalid credencials' });
    }
    const planos = await Plano.findAll();

    return res.json(planos);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.string(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Invalid credencials' });
    }

    const planoExists = await Plano.findByPk(req.params.id);

    if (!planoExists) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const plano = await planoExists.update(req.body);
    return res.json(plano);
  }

  async destroy(req, res) {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Invalid credencials' });
    }

    await Plano.destroy({ where: { id: req.params.id } });

    return res.json();
  }
}

export default new PlanoController();
