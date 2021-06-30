'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    listName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: 'Users'}
      },
  }, {});
  List.associate = function(models) {
    List.hasMany(models.Task, {
      foreignKey: 'listId',
      onDelete: 'CASCADE',
      hooks: true
    })
    List.belongsTo(models.User, { foreignKey: 'userId' })
  };
  return List;
};
