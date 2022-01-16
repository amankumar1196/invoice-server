module.exports = (sequelize, Sequelize) => {
  let Address = sequelize.define("address", {
    address_line_1: {
      type: Sequelize.STRING
    },
    address_line_2: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    states: {
      type: Sequelize.STRING
    },
    pin_code: {
      type: Sequelize.INTEGER
    },
    addressId: {
      type: Sequelize.INTEGER
    },
    addressType: {
      type: Sequelize.STRING
    }
  }, {});

  Address.associate = function(models) {
    // associations can be defined 
    Address.belongsTo(models.user, { foreignKey: 'addressId', constraints: false });
    Address.belongsTo(models.client, { foreignKey: 'addressId', constraints: false });
    Address.belongsTo(models.company, { foreignKey: 'addressId', constraints: false });
  };

  return Address;
};