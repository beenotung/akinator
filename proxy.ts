import { proxySchema } from 'better-sqlite3-proxy'
import { db } from './db'

export type User = {
  id?: number | null
  username: string
  password_hash: string
}

export type Question = {
  id?: number | null
  content: string
  user_id: number
  user?: User
}

export type Answer = {
  id?: number | null
  name: string
  user_id: number
  user?: User
}

export type QaPair = {
  id?: number | null
  question_id: number
  question?: Question
  answer_id: number
  answer?: Answer
  user_id: number
  user?: User
  match: ('t' | 'f' | 'tf' | 'na')
}

export type DBProxy = {
  user: User[]
  question: Question[]
  answer: Answer[]
  qa_pair: QaPair[]
}

export let proxy = proxySchema<DBProxy>({
  db,
  tableFields: {
    user: [],
    question: [
      /* foreign references */
      ['user', { field: 'user_id', table: 'user' }],
    ],
    answer: [
      /* foreign references */
      ['user', { field: 'user_id', table: 'user' }],
    ],
    qa_pair: [
      /* foreign references */
      ['question', { field: 'question_id', table: 'question' }],
      ['answer', { field: 'answer_id', table: 'answer' }],
      ['user', { field: 'user_id', table: 'user' }],
    ],
  },
})
