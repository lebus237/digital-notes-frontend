import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronRight, IconPencil } from "@tabler/icons-react";
import {
  CollectionDisplayCard,
  getInitials,
  useCollectionService,
} from "@digitalnotes/core";
import styles from "../organisation-view.module.scss";

export type OrganisationEntityItem = { id: string; name: string };

export function OrganisationEntityGrid({
  fetchApi,
  cacheKey,
  customQuery,
  openLabel,
  emptyMessage,
  onItemClick,
  onEdit,
}: Readonly<{
  fetchApi: (query: any) => Promise<any>;
  cacheKey: string;
  customQuery?: any;
  openLabel?: string;
  emptyMessage: string;
  onItemClick?: (item: OrganisationEntityItem) => void;
  onEdit?: (item: OrganisationEntityItem) => void;
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
      cardSpan={{ base: 12, sm: 6, lg: 4 }}
      gutter="sm"
      skeletonCount={6}
      skeletonProps={{ withImage: false, withBadges: false, withFooter: false }}
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
            padding="sm"
            radius="sm"
            withBorder
          >
            <Stack gap="xs" h="100%">
              <Group
                justify="start"
                align="start"
                gap="sm"
                wrap="nowrap"
                h="70%"
                onClick={() => (onItemClick ? onItemClick(item) : null)}
              >
                <Box className={styles.entinyInitials}>
                  <span>{getInitials(item.name)}</span>
                </Box>
                <Text
                  className={styles.entityName}
                  fw={600}
                  // lineClamp={1}
                  size="lg"
                >
                  {item.name}
                </Text>
              </Group>
              {onEdit && (
                <>
                  <Divider />
                  <Button
                    variant="subtle"
                    size="xs"
                    justify="start"
                    leftSection={<IconPencil size={14} />}
                    onClick={() => onEdit(item)}
                  >
                    Edit
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
