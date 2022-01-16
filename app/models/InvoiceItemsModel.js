module.exports = (sequelize, Sequelize) => {
  let InvoiceItem = sequelize.define("invoice_item", {
    description: {
      type: Sequelize.STRING
    },
    quantity: {
      type: Sequelize.INTEGER
    },
    price: {
      type: Sequelize.DECIMAL
    },
    invoiceId: {
      type: Sequelize.INTEGER
    }
  }, {});

  InvoiceItem.associate = function(models) {
    // associations can be defined 
    InvoiceItem.belongsTo(models.invoice, {
      foreignKey: "invoiceId",
      as: "invoice"
    });
    
  };

  return InvoiceItem;
};