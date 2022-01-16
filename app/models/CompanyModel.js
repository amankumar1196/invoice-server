module.exports = (sequelize, Sequelize) => {
  let Company = sequelize.define("company", {
    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.INTEGER
    },
    email: {
      type: Sequelize.STRING
    }
  }, {});

  Company.associate = function(models) {
    // associations can be defined 

    // Client.belongsToMany(models.company, {
    //   through: "user_companies",
    //   foreignKey: "userId",
    //   otherKey: "comapnyId"
    // });

    Company.belongsToMany(models.user, {
      through: "user_companies",
      foreignKey: "companyId",
      otherKey: "userId"
    });

    Company.hasMany(models.invoice, {
      as: "invoices"
    });

    Company.hasOne(models.address, {
      foreignKey: 'addressId',
      constraints: false,
      scope: {
        commentableType: 'company'
      },
      as: "address"
    });
  };

  return Company;
};