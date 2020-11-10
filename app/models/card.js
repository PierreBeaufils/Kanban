const { Model, DataTypes } = require('sequelize');

const sequelize = require('../database');

class Card extends Model { }

Card.init({
    title: DataTypes.TEXT,
    color: DataTypes.TEXT,
    position: DataTypes.INTEGER,
    list_id: DataTypes.INTEGER,
}, {
    sequelize,
    tableName: 'card'
});

module.exports = Card;