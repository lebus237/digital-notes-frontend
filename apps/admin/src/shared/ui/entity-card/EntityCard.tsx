import { ActionIcon, Box, Card, Group, Menu, Stack, Text } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { getInitials } from "@digitalnotes/core";
import styles from "./entity-card.module.scss";

export function EntityCard(props: {
  data: { id: string; designation: string };
  meta?: React.ReactNode;
  onClick?: (id: string) => void;
  optionConfig?: Array<{
    label: string;
    onSelect: () => void;
    icon?: React.ReactNode;
  }>;
}) {
  return (
    <Card
      className={styles.container}
      component="article"
      padding="xs"
      radius="sm"
      withBorder
    >
      {props.optionConfig && props.optionConfig.length > 0 && (
        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon
              className={styles.actions}
              variant="subtle"
              color="gray"
              aria-label="More actions"
            >
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {props.optionConfig.map((option, index) => (
              <Menu.Item
                key={`${option.label}-${index}`}
                leftSection={option.icon}
                onClick={option.onSelect}
              >
                {option.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      )}
      <Stack gap="sm" h="100%">
        <Group
          className={styles.header}
          justify="start"
          align="start"
          gap="sm"
          wrap="nowrap"
          h="100%"
          onClick={() => (props.onClick ? props.onClick(props.data.id) : null)}
        >
          <Box className={styles.initials}>
            <span>{getInitials(props.data.designation)}</span>
          </Box>
          <Box className={styles.body}>
            <Text className={styles.designation} fw={600} size="lg">
              {props.data.designation}
            </Text>
            {props.meta != null && (
              <Text className={styles.meta} size="sm" c="dimmed">
                {props.meta}
              </Text>
            )}
          </Box>
        </Group>
      </Stack>
    </Card>
  );
}
