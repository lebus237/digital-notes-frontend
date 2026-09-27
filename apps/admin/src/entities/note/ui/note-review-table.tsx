import { Table, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import type { Note } from '../model/note'
import styles from './note-review-table.module.scss'

type NoteReviewTableProps = {
  notes: Note[]
  renderActions: (note: Note) => ReactNode
}

export function NoteReviewTable({ notes, renderActions }: Readonly<NoteReviewTableProps>) {
  if (notes.length === 0) {
    return <Text c="dimmed" className={styles.empty}>No notes match this view.</Text>
  }

  return (
    <div className={styles.tableWrap}>
      <Table.ScrollContainer minWidth={700}>
        <Table verticalSpacing="md" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th scope="col">Note</Table.Th>
              <Table.Th scope="col">Author</Table.Th>
              <Table.Th scope="col">Updated</Table.Th>
              <Table.Th scope="col">Status</Table.Th>
              <Table.Th scope="col"><span className={styles.visuallyHidden}>Actions</span></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {notes.map((note) => (
              <Table.Tr key={note.id}>
                <Table.Td className={styles.title}>{note.title}</Table.Td>
                <Table.Td>{note.author}</Table.Td>
                <Table.Td>{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(note.updatedAt))}</Table.Td>
                <Table.Td>
                  <span className={`${styles.status} ${styles[note.status.toLowerCase()]}`}>
                    <span aria-hidden="true" className={styles.statusDot} />
                    {note.status}
                  </span>
                </Table.Td>
                <Table.Td>{renderActions(note)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  )
}
