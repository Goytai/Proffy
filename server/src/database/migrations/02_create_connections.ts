import Knex from 'knex'

export async function up (knex:Knex) {
    return knex.schema.createTable('connections', table => {
        table.increments('id').primary()

        table.integer('user_id').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE')
        table.integer('class_id').references('id').inTable('classes').onDelete('SET NULL').onUpdate('CASCADE')

        table.timestamp('create_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable()
    })
}

export async function down (knex:Knex) {
    return knex.schema.dropTable('classes')
}