module.exports = (sequelize, Sequelize) => {
  let Invoice = sequelize.define("invoice", {
    name: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM,
      values: ['pending', 'send', 'not_send'],
      defaultValue: 'pending'
    },
    archived: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: Sequelize.INTEGER
    },
    clientId: {
      type: Sequelize.INTEGER
    },
    companyId: {
      type: Sequelize.INTEGER
    },
    registerKey: {
      type: Sequelize.UUID,
      allowNull: false
    }
    // due_date: {
    //   type: Sequelize.Da
    // }
  }, {});

  Invoice.associate = function(models) {
    // associations can be defined 
    Invoice.belongsTo(models.user, {
      foreignKey: "userId",
      as: "user"
    });

    Invoice.belongsTo(models.client, {
      foreignKey: "clientId",
      as: "client"
    });

    Invoice.belongsTo(models.company, {
      foreignKey: "companyId",
      as: "company"
    });

    Invoice.hasMany(models.invoice_item, {
      as: "invoice_items"
    });

  };

  return Invoice;
};