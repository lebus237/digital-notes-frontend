export type Note = {
  id: string
  title: string
  content: string
  createdAt: string
}

export function createNote(title: string, content: string): Note {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  }
}
