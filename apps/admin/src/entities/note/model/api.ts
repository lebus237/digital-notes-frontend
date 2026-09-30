import { unwrapCollection } from '@digitalnotes/core'
import { archiveNote, getNote, listCourseNotes, publishNote, rejectNote, updateNoteMetadata } from '@/shared/api/endpoints/notes'
import type { NoteMetadataValues } from './schemas'
import type { Note } from './note'

function throwIfError(result: unknown, fallback: string): void {
  if (result !== null && typeof result === 'object' && 'status' in result && (result as { status?: string }).status === 'error') {
    throw new Error((result as { error?: { message?: string } }).error?.message ?? fallback)
  }
}

export type NoteFilters = {
  search?: string
  page?: number
  limit?: number
  noteType?: string
}

export const noteApi = {
  async listByCourse(courseId: string, filters?: NoteFilters): Promise<Note[]> {
    const result = await listCourseNotes(courseId, {
      search: filters?.search,
      page: filters?.page,
      limit: filters?.limit,
      noteType: filters?.noteType,
    })
    throwIfError(result, 'Could not load notes.')
    const rows = unwrapCollection<Record<string, unknown>>(result)
    return rows.map((row) => ({
      id: String(row.id ?? row.noteId ?? crypto.randomUUID()),
      title: String(row.title ?? 'Untitled note'),
      author: String(row.author ?? row.authorName ?? row.uploaderName ?? 'Unknown'),
      updatedAt: String(row.updatedAt ?? row.updated_at ?? row.createdAt ?? new Date().toISOString()),
      status: (row.status as Note['status']) ?? 'Pending',
    }))
  },
  async updateMetadata(id: string, payload: NoteMetadataValues): Promise<void> {
    const result = await updateNoteMetadata(id, {
      title: payload.title,
      description: payload.description === '' ? null : (payload.description ?? null),
      price: payload.price,
    })
    throwIfError(result, 'Could not update note.')
  },
  async publish(id: string): Promise<void> {
    throwIfError(await publishNote(id, {}), 'Could not publish note.')
  },
  async reject(id: string): Promise<void> {
    throwIfError(await rejectNote(id, {}), 'Could not reject note.')
  },
  async archive(id: string): Promise<void> {
    throwIfError(await archiveNote(id, {}), 'Could not archive note.')
  },
  async detail(id: string): Promise<unknown> {
    const result = (await getNote(id)) as unknown
    throwIfError(result, 'Could not load note.')
    if (result !== null && typeof result === 'object' && 'data' in result) {
      return (result as { data: unknown }).data
    }
    return result
  },
}
