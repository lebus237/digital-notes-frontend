import { useQuery } from "@tanstack/react-query";
import { normalizeCollectionResponse } from "@digitalnotes/core";
import type { DepartmentListItem } from "@/entities/organisation";
import { actionKeys } from "@/shared/api/action-keys";
import { listDepartments } from "@/shared/api/endpoints/organisation";

/**
 * Resolves a department by id from the departments collection.
 * The API has no department detail route, so the name is resolved client side.
 */
export function useDepartmentLookup(departmentId: string | undefined) {
  const { data: departments = [], isLoading } = useQuery({
    queryKey: [actionKeys.listDepartments, "lookup"],
    queryFn: () => listDepartments({ page: 1, limit: 100 }),
    staleTime: 60_000,
    select: (payload) =>
      normalizeCollectionResponse<DepartmentListItem>(payload).data,
  });

  const department = departments.find((item) => item.id === departmentId);

  return { department, isLoading };
}
