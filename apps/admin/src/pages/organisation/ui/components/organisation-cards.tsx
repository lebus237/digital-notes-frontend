import { IconPencil } from "@tabler/icons-react";
import {
  CollectionDisplayCard,
  useCollectionService,
} from "@digitalnotes/core";
import { EntityCard, EntityCardSkeleton } from "@/shared/ui";

export type OrganisationEntityItem = {
  id: string;
  name: string;
  year?: number;
};
export type OrganisationEntityKind =
  "university" | "faculty" | "department" | "level";

export function OrganisationEntityGrid({
  fetchApi,
  cacheKey,
  customQuery,
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
    <CollectionDisplayCard<OrganisationEntityItem>
      records={controller.data}
      controller={controller}
      cardSpan={{ base: 12, sm: 6, lg: 3 }}
      gutter="sm"
      skeletonCount={6}
      skeleton={<EntityCardSkeleton withActions={Boolean(onEdit)} />}
      marginBottom="0"
      emptyMessage={emptyMessage}
      renderItem={(item) => (
        <EntityCard
          data={{ id: item.id, designation: item.name }}
          meta={
            kind === "level" && item.year != null
              ? `Year ${item.year}`
              : undefined
          }
          onClick={onItemClick ? () => onItemClick(item) : undefined}
          optionConfig={
            onEdit
              ? [
                  {
                    label: "Edit",
                    icon: <IconPencil size={16} />,
                    onSelect: () => onEdit(item),
                  },
                ]
              : undefined
          }
        />
      )}
      hidePlugins={{ filters: true, order: true, range: true, export: true }}
    />
  );
}
