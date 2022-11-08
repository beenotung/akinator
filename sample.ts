import { find } from 'better-sqlite3-proxy'
import { db } from './db'
import { hashPassword } from './hash'
import { proxy, QaPair } from './proxy'

async function main() {
  proxy.user[1] = {
    username: 'alice',
    password_hash: await hashPassword('alice'),
  }

  function addPair(options: {
    question: string
    answer: string
    match: QaPair['match']
  }) {
    let question_id =
      find(proxy.question, { content: options.question })?.id ||
      proxy.question.push({ content: options.question, user_id: 1 })
    let answer_id =
      find(proxy.answer, { name: options.answer })?.id ||
      proxy.answer.push({ name: options.answer, user_id: 1 })

    let pair = find(proxy.qa_pair, { question_id, answer_id })
    if (pair) {
      pair.match = options.match
    } else {
      proxy.qa_pair.push({
        answer_id,
        question_id,
        match: options.match,
        user_id: 1,
      })
    }
  }

  addPair({
    question: 'Is it a food?',
    answer: 'fish ball',
    match: 't',
  })

  addPair({
    question: 'Is it a food?',
    answer: 'sushi',
    match: 't',
  })

  addPair({
    question: 'Is it a food?',
    answer: 'akinator',
    match: 'f',
  })

  addPair({
    question: 'Is it a food?',
    answer: 'gameboy',
    match: 'f',
  })

  addPair({
    question: 'Is it playable?',
    answer: 'gameboy',
    match: 't',
  })

  addPair({
    question: 'Is it playable?',
    answer: 'sushi',
    match: 'na',
  })

  // console.log(proxy)
  // console.log(proxy.qa_pair)
  // console.log(proxy.qa_pair[1])
  // console.log(proxy.qa_pair[1].answer_id)
  // console.log(proxy.qa_pair[1].answer?.name)

  console.log(
    proxy.qa_pair.map(pair => ({
      id: pair.id,
      question: pair.question?.content,
      answer: pair.answer?.name,
    })),
  )
}
main().catch(e => console.error(e))
