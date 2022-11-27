import { find } from 'better-sqlite3-proxy'
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
    match: 'f',
  })

  addPair({
    question: 'Is it sweet?',
    answer: 'sushi',
    match: 't',
  })

  addPair({
    question: 'Is it spicy?',
    answer: 'sushi',
    match: 'tf',
  })

  addPair({
    question: 'Is it spicy?',
    answer: 'fish ball',
    match: 'tf',
  })

  addPair({
    question: 'Can it be purchased?',
    answer: 'sushu',
    match: 't',
  })

  addPair({
    question: 'Can it be purchased?',
    answer: 'fish ball',
    match: 't',
  })

  addPair({
    question: 'Can it be purchased?',
    answer: 'akinator',
    match: 'f',
  })

  addPair({
    question: 'Can it be purchased?',
    answer: 'memory',
    match: 'f',
  })

  addPair({
    question: 'Can it be experienced?',
    answer: 'memory',
    match: 't',
  })

  addPair({
    question: 'Is it a food?',
    answer: 'memory',
    match: 'f',
  })

  console.log(
    proxy.qa_pair.map(pair => ({
      id: pair.id,
      question: pair.question?.content,
      answer: pair.answer?.name,
      match: pair.match,
    })),
  )
}
main().catch(e => console.error(e))
