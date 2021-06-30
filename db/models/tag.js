'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      taskId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: 'Tasks'}
      },
  }, {});
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Task, {
        through: 'TagJoins',
        foreignKey: 'tagId',
        otherKey: 'taskId',
        onDelete: 'CASCADE',
        hooks: true
    })
  };
  return Tag;
};
