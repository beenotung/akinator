import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('qa_pair', table => {
    table.enum('match', ['t', 'f', 'tf', 'na']).notNullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('qa_pair', table => {
    table.enum('match', ['t', 'f', 'na']).notNullable().alter()
  })
}
