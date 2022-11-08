import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('user'))) {
    await knex.schema.createTable('user', table => {
      table.increments('id')
      table.text('username').notNullable()
      table.text('password_hash').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('question'))) {
    await knex.schema.createTable('question', table => {
      table.increments('id')
      table.text('content').notNullable()
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('answer'))) {
    await knex.schema.createTable('answer', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('qa_pair'))) {
    await knex.schema.createTable('qa_pair', table => {
      table.increments('id')
      table.integer('question_id').unsigned().notNullable().references('question.id')
      table.integer('answer_id').unsigned().notNullable().references('answer.id')
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('qa_pair')
  await knex.schema.dropTableIfExists('answer')
  await knex.schema.dropTableIfExists('question')
  await knex.schema.dropTableIfExists('user')
}
