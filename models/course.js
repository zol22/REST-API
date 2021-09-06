'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { /* Ensure that required values when creating a course are properly submitted */
        notNull: {
          msg: "Please provide a value for title"
        },
        notEmpty: {
          msg: "Please provide a value for title"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { /* Ensure that required values when creating a course are properly submitted */
        notNull: {
          msg: "Please provide a value for description"
        },
        notEmpty: {
          msg: "Please provide a value for description"
        }
      }
    },
    estimatedtime: {
        type: DataTypes.STRING, 
      },
    materialsneeded: {
        type: DataTypes.STRING,
      }
  }, {
    sequelize,
    modelName: 'Course',
  });

  Course.associate = (models) => {
    // TODO Add associations.  one-to-one
    Course.belongsTo(models.User,{
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };


  return Course;
};