module.exports = (sequelize, Sequelize) => {
  let User = sequelize.define("user", {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.INTEGER
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  }, {});

  User.associate = function(models) {
    // associations can be defined 
    User.belongsToMany(models.role, {
      through: "user_roles",
      foreignKey: "userId",
      otherKey: "roleId"
    });

    User.belongsToMany(models.company, {
      through: "user_companies",
      foreignKey: "userId",
      otherKey: "comapnyId"
    });

    User.hasMany(models.invoice, {
      as: "invoices"
    });

    User.hasOne(models.address, {
      foreignKey: 'addressId',
      constraints: false,
      scope: {
        commentableType: 'user'
      },
      as: "address"
    });
  };

  return User;
};