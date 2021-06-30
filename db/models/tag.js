'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
        allowNull: false,
        type: DataTypes.STRING
      },
  }, {});
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Task, {
        through: 'TagJoins',
        foreignKey: 'tagId',
        otherKey: 'taskId'
    })
  };
  return Tag;
};
