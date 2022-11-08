import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.raw("alter table `qa_pair` add column `match` text not null check(`match` in ('t','f','na'))")
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('alter table `qa_pair` drop column `match`')
}
