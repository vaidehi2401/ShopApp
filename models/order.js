const mongodb = require('mongodb');
const { get } = require('../routes/admin');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;


const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Order;
