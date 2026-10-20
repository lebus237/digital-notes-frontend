import { Modal } from "@mantine/core";
import { IconBuilding, IconPlus } from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@digitalnotes/core";
import { listDepartments } from "@/shared/api/endpoints/organisation";
import { actionKeys } from "@/shared/api/action-keys";
import { DepartmentForm } from "./forms/department-form";
import {
  OrganisationEntityGrid,
  type OrganisationEntityItem,
} from "./components/organisation-cards";
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
  const [editingItem, setEditingItem] = useState<OrganisationEntityItem | null>(null);

  function handleSaved() {
    setCreateOpen(false);
    setEditingItem(null);
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
        cacheKey={actionKeys.listDepartments}
        kind="department"
        customQuery={{ facultyId }}
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
        onEdit={setEditingItem}
      />
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create department"
        centered
      >
        <DepartmentForm facultyId={facultyId} onSuccess={handleSaved} />
      </Modal>
      <Modal
        opened={editingItem !== null}
        onClose={() => setEditingItem(null)}
        title={editingItem ? `Edit ${editingItem.name}` : "Edit department"}
        centered
      >
        {editingItem && (
          <DepartmentForm
            key={editingItem.id}
            facultyId={facultyId}
            initialValue={editingItem}
            onSuccess={handleSaved}
          />
        )}
      </Modal>
    </PageContainer>
  );
}
