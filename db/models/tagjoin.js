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
    // associations can be defined here
  };
  return TagJoin;
};
