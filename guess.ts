import { db } from './db'
import { proxy, QaPair } from './proxy'
import readline from 'readline'

type Context = {
  choices: {
    [question_id: number]: QaPair['match']
  }
  exclude_answer_ids: number[]
  onAnswers: (answer_ids: number[]) => void
  onQuestion: (question_id: number) => void
}

function tick(context: Context) {
  let exclude_question_ids = Object.keys(context.choices)
  let rows = db
    .prepare(
      /* sql */ `
with list1 as (
  select
    question_id
   , match
   , count(*) as count
  from qa_pair
	where answer_id not in (${context.exclude_answer_ids})
	  and question_id not in (${exclude_question_ids})
  group by question_id, match
)
, list2 as (
  select
    question_id
  , ifnull((select count from list1 as l where l.question_id = list1.question_id and l.match = 't' ),0) as t
  , ifnull((select count from list1 as l where l.question_id = list1.question_id and l.match = 'f' ),0) as f
  , ifnull((select count from list1 as l where l.question_id = list1.question_id and l.match = 'tf'),0) as tf
  , ifnull((select count from list1 as l where l.question_id = list1.question_id and l.match = 'na'),0) as na
  from list1
  group by question_id
)
, list3 as (
	select
	  question_id, t, f, tf, na
	, ((t+f+tf+na)*1.0) as n
	from list2
)
select
  question_id, t, f, tf, na, n
, ((f+na)/n * (t+na)/n * (t+f+na)/n) as score
from list3
order by score desc
`,
    )
    .all()

  console.log({ rows })

  if (rows.length == 0) {
    let remind_answer_ids: number[] = db
      .prepare(
        /* sql */ `select id from answer where id not in (${context.exclude_answer_ids})`,
      )
      .pluck()
      .all()
    context.onAnswers(remind_answer_ids)
    return
  }

  let question_id: number = rows[0].question_id
  context.onQuestion(question_id)
}

function checkChoice(
  context: Context,
  input: { question_id: number; match: string },
) {
  switch (input.match) {
    case 't':
    case 'f':
    case 'tf':
    case 'na':
      break
    default:
      throw new Error(`Unknown input, expect t/f/tf/na, got ${input.match}`)
  }
  let user_match = input.match
  let rows = db
    .prepare(
      /* sql */ `
select
  answer_id
, match
from qa_pair
where question_id = :question_id
  and answer_id not in (${context.exclude_answer_ids})
`,
    )
    .all(input)
  for (let row of rows) {
    let result = checkMatch(user_match, row.match)
    if (result == -1) {
      context.exclude_answer_ids.push(row.answer_id)
    }
  }
  context.choices[input.question_id] = input.match
}

function checkMatch(db_match: QaPair['match'], user_match: QaPair['match']) {
  if (db_match == 'na' || user_match == 'na') {
    return db_match == user_match ? 1 : -1
  }
  return (db_match == 't' && user_match == 'f') ||
    (db_match == 'f' && user_match == 't')
    ? -1
    : 1
}

let iface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let context: Context = {
  choices: {},
  exclude_answer_ids: [],
  onAnswers: answer_ids => {
    console.log(
      'guess:',
      answer_ids.map(id => {
        let answer = proxy.answer[id]
        return {
          id,
          name: answer.name,
        }
      }),
    )
    iface.close()
  },
  onQuestion: question_id => {
    iface.question(
      proxy.question[question_id].content + ' [t/f/tf/na]: ',
      match => {
        checkChoice(context, { question_id, match })
        tick(context)
      },
    )
  },
}

tick(context)
