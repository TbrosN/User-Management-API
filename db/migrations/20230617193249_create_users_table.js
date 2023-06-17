const { roles } = require("../../config");

exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('username', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('role', 255).notNullable().defaultTo(roles.USER);
      table.timestamps();
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('users');
};