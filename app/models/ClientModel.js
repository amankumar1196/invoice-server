module.exports = (sequelize, Sequelize) => {
  let Client = sequelize.define("client", {
    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.DOUBLE
    },
    email: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER
    },
    registerKey: {
      type: Sequelize.UUID
    }
  }, {});

  Client.associate = function(models) {
    // associations can be defined 

    // Client.belongsToMany(models.company, {
    //   through: "user_companies",
    //   foreignKey: "userId",
    //   otherKey: "comapnyId"
    // });

    Client.belongsTo(models.user, {
      foreignKey: "userId",
      as: "user"
    });

    Client.hasMany(models.invoice, {
      as: "invoices"
    });

    Client.hasOne(models.address, {
      foreignKey: 'addressId',
      constraints: false,
      scope: {
        addressType: 'client'
      },
      as: "address"
    });
  };

  return Client;
};