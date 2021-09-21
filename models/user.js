'use strict';
const { Model} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { /* Ensure that required values when creating a user are properly submitted */
        notNull: {
          msg: "Please provide a value for firstname"
        },
        notEmpty: {
          msg: "Please provide a value for firstname"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { /* Ensure that required values when creating a user are properly submitted */
        notNull: {
          msg: "Please provide a value for lastname"
        },
        notEmpty: {
          msg: "Please provide a value for lastname"
        }
      }
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull : false ,
        unique: {
          msg: "The email you entered already existed"
        },
        validate: {/* Ensure that required values when creating a user are properly submitted */
          notNull: {
            msg: "A email is required"
          },
          notEmpty:{
            msg: 'Please provide a email'
          },
          isEmail: {
            msg: 'Please provide a valid email address'
          }
        }  
      },
    password: {
        type: DataTypes.STRING, 
        allowNull : false,
        validate: { /* Ensure that required values when creating a user are properly submitted */
          notNull: {
            msg: "A password is required"       
          },
          notEmpty:{
            msg: 'Please provide a password'
          }
        },
        /* When a new user is created using the /api/users POST route the user's password should be 
        hashed before persisting the user to the database. */
        set(val) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword);
        },
      }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) => {
    // TODO Add associations. one-to-many
    User.hasMany(models.Course, {
      foreignKey:{
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };


  return User;
};