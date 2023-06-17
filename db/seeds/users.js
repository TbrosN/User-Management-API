exports.seed = async function(knex) {
  // Resets increment to 0
  await knex('sqlite_sequence')
    .update({seq: 0})
    .where('name', 'users')
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        // password is "password"
        {id: 1, username: 'admin', password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', role: 'admin'},
      ]);
    });
};
