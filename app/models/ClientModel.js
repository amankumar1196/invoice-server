module.exports = (sequelize, Sequelize) => {
  let Client = sequelize.define("client", {
    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.INTEGER
    },
    email: {
      type: Sequelize.STRING
    },
  }, {});

  Client.associate = function(models) {
    // associations can be defined 

    // Client.belongsToMany(models.company, {
    //   through: "user_companies",
    //   foreignKey: "userId",
    //   otherKey: "comapnyId"
    // });

    Client.hasMany(models.invoice, {
      as: "invoices"
    });

    Client.hasOne(models.address, {
      foreignKey: 'addressId',
      constraints: false,
      scope: {
        commentableType: 'client'
      },
      as: "address"
    });
  };

  return Client;
};