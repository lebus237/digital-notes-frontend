import { Card, Stack, Group, Box, Text } from "@mantine/core";
import styles from "./entity-card.module.scss";
import { getInitials } from "@digitalnotes/core";

export function EntityCard(props: {
  data: { id: string; designation: string };
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
          </Box>
        </Group>
      </Stack>
    </Card>
  );
}
