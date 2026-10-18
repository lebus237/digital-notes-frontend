import { Modal } from "@mantine/core";
import { IconBuilding, IconPlus } from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@digitalnotes/core";
import { listDepartments } from "@/shared/api/endpoints";
import { queryClient } from "@/shared/api/query-client";
import { DepartmentForm } from "./forms/department-form";
import { OrganisationEntityGrid } from "./components/organisation-cards";
import {
  departmentsUrl,
  facultiesUrl,
  universitiesUrl,
} from "./components/organisation-navigation";

const departmentsRoute = getRouteApi("/_app/organisation/departments");

export function DepartmentsView() {
  const { universityId, facultyId } = departmentsRoute.useSearch();
  const navigate = departmentsRoute.useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  function handleCreated() {
    setCreateOpen(false);
    void queryClient.invalidateQueries({ queryKey: ["admin"] });
  }

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Organisation", to: universitiesUrl() },
        {
          label: "Faculties",
          to: facultiesUrl({ universityId }),
        },
        {
          label: "Departments",
          to: departmentsUrl({ universityId, facultyId }),
        },
      ]}
      title="Departments"
      description="Departments within the selected faculty."
      icon={<IconBuilding size={20} />}
      actions={[
        {
          key: "new-department",
          label: "New department",
          icon: <IconPlus size={20} />,
          onClick: () => setCreateOpen(true),
        },
      ]}
    >
      <OrganisationEntityGrid
        fetchApi={listDepartments}
        cacheKey="admin-organisation-departments"
        customQuery={{ facultyId }}
        kind="Department"
        openLabel="levels"
        emptyMessage="No departments yet. Add the first department to this faculty."
        onItemClick={(item) =>
          void navigate({
            to: "/organisation/levels",
            search: {
              universityId,
              facultyId,
              departmentId: item.id,
            },
          })
        }
      />
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create department"
        centered
      >
        <DepartmentForm facultyId={facultyId} onSuccess={handleCreated} />
      </Modal>
    </PageContainer>
  );
}
