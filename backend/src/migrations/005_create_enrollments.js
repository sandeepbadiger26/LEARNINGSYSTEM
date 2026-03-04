exports.up = function(knex) {
  return knex.schema.createTable('enrollments', table => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.bigInteger('subject_id').unsigned().notNullable()
      .references('id').inTable('subjects').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.unique(['user_id', 'subject_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('enrollments');
};
