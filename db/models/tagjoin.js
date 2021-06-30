'use strict';
module.exports = (sequelize, DataTypes) => {
  const TagJoin = sequelize.define('TagJoin', {
    tagId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: 'Tags'}
      },
      taskId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: 'Tasks'}
      },
  }, {});
  TagJoin.associate = function(models) {
    // not needed because at the end of the line only use if deleting tag as well
    // TagJoin.belongsTo(models.Tag, { foreignKey: 'tagId' })
    TagJoin.belongsTo(models.Task, { foreignKey: 'taskId' })

  };
  return TagJoin;
};
