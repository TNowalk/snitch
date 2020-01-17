import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';

const basename  = path.basename(__filename);

const sequelize = new Sequelize('snitch.dev', 'root', 'x4mUf!K!1wGsPi3', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log
});

let db = {};

fs
  .readdirSync(path.join(__dirname, 'models'))
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, 'models', file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db };
