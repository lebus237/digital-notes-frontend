import { callAction, callActionWithId } from '@digitalnotes/core'

export const listMyNotes = callAction('/api/v1/contributor/notes', 'GET')
export const createNote = callAction('/api/v1/notes', 'POST')
export const submitNote = callActionWithId('/api/v1/notes/{id}/submit', 'POST')
