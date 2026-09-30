import { ActionIcon, Group } from '@mantine/core'
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import React from 'react'

interface ActionHelperProps {
  editAction?: (arg?: any) => void
  deleteAction?: (arg?: any) => void
  viewAction?: (arg?: any) => void
}

export const ActionHelper: React.FC<ActionHelperProps> = (props) => {
  const { editAction, viewAction, deleteAction } = props

  return (
    <Group gap={4} justify="center" wrap="nowrap">
      {viewAction && (
        <ActionIcon variant="subtle" color="green" onClick={() => viewAction()}>
          <IconEye size={20} />
        </ActionIcon>
      )}
      {editAction && (
        <ActionIcon variant="subtle" color="blue" onClick={() => editAction()}>
          <IconEdit size={20} />
        </ActionIcon>
      )}
      {deleteAction && (
        <ActionIcon variant="subtle" color="red" onClick={() => deleteAction()}>
          <IconTrash size={20} />
        </ActionIcon>
      )}
    </Group>
  )
}
