module.exports = (sequelize, Sequelize) => {
  let Company = sequelize.define("company", {
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
      type: Sequelize.UUID,
      allowNull: false
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