exports.up = function(knex) {
  return knex.schema.createTable('refresh_tokens', table => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.string('token_hash', 255).notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('revoked_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['user_id', 'token_hash']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('refresh_tokens');
};
