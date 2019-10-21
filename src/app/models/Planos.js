import Sequelize, { Model } from 'sequelize';

export default class Planos extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.STRING,
        price: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
  }
}
