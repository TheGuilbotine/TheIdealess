'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true  
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      hashedPassword: {
        allowNull: false,
        type: DataTypes.STRING.BINARY
      },
  }, {});
  User.associate = function(models) {
    User.hasMany(models.List, {foreignKey: 'userId'})
  };
  return User;
};
