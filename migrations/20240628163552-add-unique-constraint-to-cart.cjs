"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("Carts", {
      fields: ["user_id", "product_id"],
      type: "unique",
      name: "unique_user_product_constraint",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "Carts",
      "unique_user_product_constraint"
    );
  },
};
