'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('services', 'status', {
            type: Sequelize.ENUM('active', 'inactive', 'ongoing'),
            allowNull: false,
            defaultValue: 'inactive', // Default status
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('services', 'status');
    },
};
