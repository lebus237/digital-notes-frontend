import { Box, Card, Group, Skeleton, Stack } from "@mantine/core";
import styles from "../courses-view.module.scss";

export function DepartmentCardSkeleton() {
  return (
    <Card className={styles.departmentCard} padding="xs" radius="sm" withBorder>
      <Stack gap="sm" h="100%">
        <Group
          className={styles.departmentCardHeader}
          justify="start"
          align="start"
          gap="sm"
          wrap="nowrap"
          h="100%"
        >
          <Box className={styles.departmentCardInitials}>
            <Skeleton h="100%" w="100%" radius={0} />
          </Box>
          <Box className={styles.departmentCardBody}>
            <Skeleton height={18} radius="sm" />
            <Skeleton height={14} radius="sm" mt="sm" />
          </Box>
        </Group>
      </Stack>
    </Card>
  );
}
