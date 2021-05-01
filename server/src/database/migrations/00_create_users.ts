import Knex from 'knex'

export async function up (knex:Knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('secundaryName').notNullable()
        table.string('email').notNullable()
        table.string('pass').notNullable()

        table.string('bio')
        table.string('whatsapp')
        
        table.string('avatar').defaultTo('https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png')

        table.timestamp('create_at').defaultTo(knex.raw("CURRENT_TIMESTAMP")).notNullable()
        table.timestamp('lasted_login')
    })
}

export async function down (knex:Knex) {
    return knex.schema.dropTable('users')
}