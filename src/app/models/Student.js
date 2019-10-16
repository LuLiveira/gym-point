import Sequelize, { Model } from 'sequelize';

export default class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        idade: Sequelize.INTEGER,
        peso: Sequelize.DOUBLE,
        altura: Sequelize.DOUBLE,
      },
      {
        sequelize,
      }
    );
  }
}
