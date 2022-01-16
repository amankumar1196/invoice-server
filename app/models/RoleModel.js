module.exports = (sequelize, Sequelize) => {
  let Role = sequelize.define("role", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  }, {});

  Role.associate = function(models) {
    // associations can be defined 
    Role.belongsToMany(models.user, {
      through: "user_roles",
      foreignKey: "roleId",
      otherKey: "userId"
    });
  };

  return Role;
};