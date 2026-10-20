import { Box, Button, Card, Divider, Group, Stack, Text } from "@mantine/core";
import { clsx } from "clsx";
import { IconPencil } from "@tabler/icons-react";
import {
  CollectionDisplayCard,
  getInitials,
  useCollectionService,
} from "@digitalnotes/core";
import styles from "../organisation-view.module.scss";
import { EntityCardSkeleton } from "./entity-card-skeleton";

export type OrganisationEntityItem = { id: string; name: string };
export type OrganisationEntityKind =
  "university" | "faculty" | "department" | "level";

const kindInitialsClass: Record<OrganisationEntityKind, string> = {
  university: styles.initialsUniversity,
  faculty: styles.initialsFaculty,
  department: styles.initialsDepartment,
  level: styles.initialsLevel,
};

export function OrganisationEntityGrid({
  fetchApi,
  cacheKey,
  customQuery,
  openLabel,
  emptyMessage,
  onItemClick,
  onEdit,
  kind,
}: Readonly<{
  fetchApi: (query: any) => Promise<any>;
  cacheKey: string;
  customQuery?: any;
  openLabel?: string;
  emptyMessage: string;
  onItemClick?: (item: OrganisationEntityItem) => void;
  onEdit?: (item: OrganisationEntityItem) => void;
  kind: OrganisationEntityKind;
}>) {
  const controller = useCollectionService(
    fetchApi,
    { pagination: { page: 1, limit: 20 } },
    cacheKey,
    customQuery,
  );

  return (
    <CollectionDisplayCard
      records={controller.data}
      controller={controller}
      cardSpan={{ base: 12, sm: 6, lg: 3 }}
      gutter="sm"
      skeletonCount={6}
      skeleton={<EntityCardSkeleton withEdit={Boolean(onEdit)} />}
      marginBottom="0"
      emptyMessage={emptyMessage}
      renderItem={(item: OrganisationEntityItem) => {
        const name = (
          <Text className={styles.entityName} fw={600} lineClamp={1}>
            {item.name}
          </Text>
        );

        return (
          <Card
            className={styles.entityCard}
            component="article"
            padding="xs"
            radius="sm"
            withBorder
          >
            <Stack gap="sm" h="100%">
              <Group
                className={styles.entityCardHeader}
                justify="start"
                align="start"
                gap="sm"
                wrap="nowrap"
                h="70%"
                onClick={() => (onItemClick ? onItemClick(item) : null)}
              >
                <Box
                  className={clsx(
                    styles.entinyInitials,
                    kindInitialsClass[kind],
                  )}
                >
                  <span>{getInitials(item.name)}</span>
                </Box>
                <Text className={styles.entityName} fw={600} size="lg">
                  {item.name}
                </Text>
              </Group>
              {onEdit && (
                <>
                  <Divider />
                  <Button
                    size="xs"
                    bg="var(--mantine-color-brand-6)"
                    radius="xs"
                    onClick={() => onEdit(item)}
                  >
                    <Text size="sm">Edit</Text>
                  </Button>
                </>
              )}
            </Stack>
          </Card>
        );
      }}
      hidePlugins={{ filters: true, order: true, range: true, export: true }}
    />
  );
}
