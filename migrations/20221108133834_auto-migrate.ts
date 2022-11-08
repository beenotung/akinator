import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.raw('alter table `answer` add column `name` text not null')
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('alter table `answer` drop column `name`')
}
