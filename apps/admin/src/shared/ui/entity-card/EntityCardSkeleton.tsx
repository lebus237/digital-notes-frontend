import { Box, Card, Group, Skeleton, Stack } from "@mantine/core";
import styles from "./entity-card.module.scss";

export function EntityCardSkeleton() {
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
        >
          <Box className={styles.initials}>
            <Skeleton h="100%" w="100%" radius={0} />
          </Box>
          <Box className={styles.body}>
            <Skeleton height={18} radius="sm" />
          </Box>
        </Group>
      </Stack>
    </Card>
  );
}
