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
    },
    registerKey: {
      type: Sequelize.UUID,
      allowNull: false,
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

    User.hasMany(models.client, {
      as: "clients"
    });

    User.hasOne(models.address, {
      foreignKey: 'addressId',
      constraints: false,
      scope: {
        addressType: 'user'
      },
      as: "address"
    });
  };

  return User;
};