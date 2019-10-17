import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async index(request, response) {
    const students = await Student.findAll();

    return response.json(students);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number()
        .required()
        .positive(),
      peso: Yup.number()
        .required()
        .positive(),
      altura: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const studentExist = await Student.findOne({
      where: { email: request.body.email },
    });

    if (studentExist) {
      return response.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, idade, peso, altura } = await Student.create(
      request.body
    );

    return response.status(201).json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number()
        .required()
        .positive(),
      peso: Yup.number()
        .required()
        .positive(),
      altura: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }
    const { id } = request.params;
    const student = await Student.findByPk(id);
    if (!student) {
      return response.status(400).json({ message: 'Invalid student' });
    }

    const { email } = request.body;

    if (email !== student.email) {
      const studentExist = await Student.findOne({
        where: {
          email,
        },
      });
      if (studentExist) {
        return response.status(400).json({ error: 'User already exists' });
      }
    }

    const updateStudant = await student.update(request.body);

    return response.json(updateStudant);
  }

  async destroy(request, response) {
    const { id } = request.params;

    const studentExist = await Student.findOne({ where: { id } });

    if (!studentExist) {
      return response.status(400).json({ error: 'User does not exists' });
    }

    studentExist.destroy();

    return response.status(200).send();
  }
}

export default new StudentController();
