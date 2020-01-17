import config from 'config';
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import { DataTypes, Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.INTEGER, allowNull: false, default: 0 },
  });

  User.prototype.generateAuthToken = function() {
    const token = jwt.sign({
      id: this.id,
      isAdmin: this.isAdmin
    }, config.get('PRIVATE_KEY'));
    return token;
  }

  User.validate = (user) => {
    const schema = {
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(3).max(255).required()
    };

    return Joi.validate(user, schema);
  };

  return User;
};
