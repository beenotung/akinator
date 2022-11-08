import readline from 'readline'
import { db } from './db'

let iface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let answer_ids = db.queryColumn('id', 'select id from answer')

console.log({ answer_ids })

function loop() {
  let rows = db
    .prepare(
      `select question_id from qa_pair where answer_id in (${answer_ids})`,
    )
    .all()

  // TODO
  db.prepare(/* sql */ `
with list as (
select
  question_id,
  match,
  count(*) as count
from qa_pair
group by match, question_id
)

select
  question_id
, ifnull((select count from list as l2 where l2.question_id = list.question_id and match = 'f'),0) as f
, ifnull((select count from list as l2 where l2.question_id = list.question_id and match = 't'),0) as t
, ifnull((select count from list as l2 where l2.question_id = list.question_id and match = 'na'),0) as na
from list
group by question_id
-- order by: (f+t) / (abs(f-t)+1)
`)

  console.log({ rows })

  // iface.question('', answer => {})
}

loop()
