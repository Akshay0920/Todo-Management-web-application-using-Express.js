"use strict";
const { Model } = require("sequelize");
// eslint-disable-next-line no-unused-vars
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }

    static addTodo(title, dueDate) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
      });
    }
    static getTodos() {
      return this.findAll();
    }

    static async markAsComplete(id) {
      await Todo.update({ completed: true }, { where: { id: id } });
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
