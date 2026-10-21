import { Box, Card, Group, Stack, Text } from "@mantine/core";
import {
  CollectionDisplayCard,
  getInitials,
  useCollectionService,
} from "@digitalnotes/core";
import styles from "../courses-view.module.scss";
import { DepartmentCardSkeleton } from "./department-card-skeleton";

export type DepartmentCardItem = {
  id: string;
  name: string;
  facultyName: string;
};

/**
 * Grid of department cards used as the entry point of the Courses module.
 * Clicking a card drills down into the courses of that department.
 */
export function DepartmentCardGrid({
  fetchApi,
  cacheKey,
  customQuery,
  emptyMessage,
  onItemClick,
}: Readonly<{
  fetchApi: (query: any) => Promise<any>;
  cacheKey: string;
  customQuery?: any;
  emptyMessage: string;
  onItemClick?: (item: DepartmentCardItem) => void;
}>) {
  const controller = useCollectionService(
    fetchApi,
    { pagination: { page: 1, limit: 20 } },
    cacheKey,
    customQuery,
  );

  return (
    <CollectionDisplayCard<DepartmentCardItem>
      records={controller.data}
      controller={controller}
      cardSpan={{ base: 12, sm: 6, lg: 3 }}
      gutter="sm"
      skeletonCount={6}
      skeleton={<DepartmentCardSkeleton />}
      marginBottom="0"
      emptyMessage={emptyMessage}
      renderItem={(item: DepartmentCardItem) => (
        <Card
          className={styles.departmentCard}
          component="article"
          padding="xs"
          radius="sm"
          withBorder
        >
          <Stack gap="sm" h="100%">
            <Group
              className={styles.departmentCardHeader}
              justify="start"
              align="start"
              gap="sm"
              wrap="nowrap"
              h="100%"
              onClick={() => (onItemClick ? onItemClick(item) : null)}
            >
              <Box className={styles.departmentCardInitials}>
                <span>{getInitials(item.name)}</span>
              </Box>
              <Box className={styles.departmentCardBody}>
                <Text className={styles.departmentCardName} fw={600} size="lg">
                  {item.name}
                </Text>
                {item.facultyName && (
                  <Text className={styles.departmentCardMeta} size="xs">
                    {item.facultyName}
                  </Text>
                )}
              </Box>
            </Group>
          </Stack>
        </Card>
      )}
      hidePlugins={{ filters: true, order: true, range: true, export: true }}
    />
  );
}
