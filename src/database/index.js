import Sequelize from 'sequelize';

import User from '../app/models/User';
import Student from '../app/models/Student';

import dataBaseConfig from '../config/database';
import Planos from '../app/models/Planos';

const models = [User, Student, Planos];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(dataBaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
