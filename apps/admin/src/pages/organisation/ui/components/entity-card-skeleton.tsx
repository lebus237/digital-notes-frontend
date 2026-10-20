import { Box, Card, Divider, Group, Skeleton, Stack } from "@mantine/core";
import styles from "../organisation-view.module.scss";

export function EntityCardSkeleton({
  withEdit = true,
}: Readonly<{
  withEdit?: boolean;
}>) {
  return (
    <Card className={styles.entityCard} padding="xs" radius="sm" withBorder>
      <Stack gap="sm" h="100%">
        <Group
          className={styles.entityCardHeader}
          justify="start"
          align="start"
          gap="sm"
          wrap="nowrap"
          h="70%"
        >
          <Box className={styles.entinyInitials}>
            <Skeleton h="100%" w="100%" radius={0} />
          </Box>
          <Box className={styles.entityName}>
            <Skeleton height={18} radius="sm" />
          </Box>
        </Group>
        {withEdit && (
          <>
            <Divider />
            <Skeleton height={26} radius="xs" />
          </>
        )}
      </Stack>
    </Card>
  );
}
