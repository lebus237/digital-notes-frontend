import {
  CollectionDisplayCard,
  useCollectionService,
} from "@digitalnotes/core";
import { EntityCard, EntityCardSkeleton } from "@/shared/ui";

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
  onItemClick?: (id: string) => void;
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
      skeleton={<EntityCardSkeleton />}
      marginBottom="0"
      emptyMessage={emptyMessage}
      renderItem={(item: DepartmentCardItem) => (
        <EntityCard
          data={{ designation: item.name ?? item.name, id: item.id }}
          onClick={onItemClick}
        />
      )}
      hidePlugins={{ filters: true, order: true, range: true, export: true }}
    />
  );
}
