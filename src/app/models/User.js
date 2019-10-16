import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }

  validaPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
