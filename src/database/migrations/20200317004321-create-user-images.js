module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      // CASO ELE ATUALIZE O AVATAR
      onUpdate: 'CASCADE',
      // CASO ELE SEJA DELETADO DA TABELA AVATARES
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'logo_id');
  },
};
