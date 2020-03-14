module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Adrielen',
          phone: '551699174-5576',
          email: 'adrielenfrosa@gmail.com',
          type: 'admin',
          password_hash:
            '$2a$08$gaqTvrIa5oJ38bLfZSDoGO1NeTytaiFoGyQ/wvMyl1tuEf84jn5DW',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Daniela',
          phone: '551699174-5577',
          email: 'danielafrosa@gmail.com',
          type: 'admin',
          password_hash:
            '$2a$08$gaqTvrIa5oJ38bLfZSDoGO1NeTytaiFoGyQ/wvMyl1tuEf84jn5DW',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Leland',
          phone: '1-536-021-1527',
          email: 'Rossie.McCullough@hotmail.com',
          type: 'Planner',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Isom',
          phone: '452-407-1301',
          email: 'Jany.Kunze70@gmail.com',
          type: 'Planner',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Maximo',
          phone: '(539) 697-3129 x26677',
          email: 'Earnest_Stokes@gmail.com',
          type: 'Administrator',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
