import { PageContainer } from "@digitalnotes/core";
import { getRouteApi } from "@tanstack/react-router";
import { actionKeys } from "@/shared/api/action-keys";
import { listDepartments } from "@/shared/api/endpoints/organisation";
import { DepartmentCardGrid } from "./components/department-cards";

const coursesRoute = getRouteApi("/_app/courses/");

export function DepartmentsView() {
  const navigate = coursesRoute.useNavigate();

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Courses" },
      ]}
      title="Courses"
      description="Browse the course catalog by department."
    >
      <DepartmentCardGrid
        fetchApi={listDepartments}
        cacheKey={actionKeys.listDepartments}
        emptyMessage="No departments yet. Add a department to start the catalog."
        onItemClick={(item) =>
          void navigate({
            to: "/courses/$departmentId",
            params: { departmentId: item.id },
          })
        }
      />
    </PageContainer>
  );
}
