import { Card, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { CollectionDisplayCard, useCollectionService } from "@digitalnotes/core";
import styles from "./organisation-view.module.scss";

export function OrganisationEntityGrid({
  fetchApi,
  cacheKey,
  customQuery,
  kind,
  openLabel,
  emptyMessage,
  onItemClick,
}: Readonly<{
  fetchApi: (query: any) => Promise<any>;
  cacheKey: string;
  customQuery?: any;
  kind: string;
  openLabel?: string;
  emptyMessage: string;
  onItemClick?: (item: any) => void;
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
      renderItem={(item) => {
        const card = (
          <Card className={styles.entityCard} component="article" padding="sm" radius="sm" withBorder>
            <Group justify="space-between" align="center" gap="sm" wrap="nowrap">
              <Stack gap={2} style={{ minWidth: 0 }}>
                <Text className={styles.entityKind} size="xs">
                  {kind}
                </Text>
                <Text className={styles.entityName} fw={600} lineClamp={1}>
                  {item.name}
                </Text>
                {item.slug && (
                  <Text c="dimmed" size="xs" lineClamp={1}>
                    {item.slug}
                  </Text>
                )}
              </Stack>
              {onItemClick && (
                <IconChevronRight className={styles.cardArrow} size={18} aria-hidden="true" />
              )}
            </Group>
          </Card>
        );

        if (!onItemClick) return card;

        return (
          <UnstyledButton
            className={styles.entityCardButton}
            aria-label={`${item.name}: open ${openLabel}`}
            onClick={() => onItemClick(item)}
          >
            {card}
          </UnstyledButton>
        );
      }}
      hidePlugins={{ filters: true, order: true, range: true, export: true }}
    />
  );
}
