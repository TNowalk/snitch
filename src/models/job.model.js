import Joi from '@hapi/joi';
import { DataTypes, Model } from 'sequelize';
import User from './user.model';

export default (sequelize, DataTypes) => {
  const Job = sequelize.define('job', {
    name: { type: DataTypes.STRING, allowNull: false }
  });

  Job.validate = (job) => {
    const schema = {
      name: Joi.string().min(3).max(100).required()
    };

    return Joi.validate(job, schema);
  };

  Job.belongsTo(User(sequelize, DataTypes))

  return Job;
};
