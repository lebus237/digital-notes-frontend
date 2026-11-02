import { Button, Modal, Tabs } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  CollectionTable,
  PageContainer,
  normalizeCollectionResponse,
  type TableColumn,
} from "@digitalnotes/core";
import {
  listDepartments,
  listLevels,
  listSemesters,
} from "@/shared/api/endpoints/organisation";
import { actionKeys } from "@/shared/api/action-keys";
import type { DepartmentListItem } from "@/entities/organisation";
import { DepartmentForm } from "./forms/department-form";
import { LevelForm } from "./forms/level-form";
import { SemesterForm } from "./forms/semester-form";
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

type NamedRow = { id: string; name: string; createdAt?: string | null };

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

export function DepartmentsView() {
  const { universityId, facultyId, departmentId } =
    departmentsRoute.useSearch();

  if (!departmentId) {
    return <DepartmentList universityId={universityId} facultyId={facultyId} />;
  }

  return (
    <DepartmentDetail
      universityId={universityId}
      facultyId={facultyId}
      departmentId={departmentId}
    />
  );
}

function DepartmentList({
  universityId,
  facultyId,
}: Readonly<{ universityId?: string; facultyId?: string }>) {
  const navigate = departmentsRoute.useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OrganisationEntityItem | null>(
    null,
  );

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
      description="Select a department to manage its levels and semesters."
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
            to: "/organisation/departments",
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

function DepartmentDetail({
  universityId,
  facultyId,
  departmentId,
}: Readonly<{
  universityId?: string;
  facultyId?: string;
  departmentId: string;
}>) {
  const [tab, setTab] = useState<"levels" | "semesters">("levels");
  const [levelCreateOpen, setLevelCreateOpen] = useState(false);
  const [semesterCreateOpen, setSemesterCreateOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<NamedRow | null>(null);
  const [editingSemester, setEditingSemester] = useState<NamedRow | null>(null);

  const { data: departments = [] } = useQuery({
    queryKey: [actionKeys.listDepartments, "lookup"],
    queryFn: () => listDepartments({ page: 1, limit: 100 }),
    staleTime: 60_000,
    select: (payload) =>
      normalizeCollectionResponse<DepartmentListItem>(payload).data,
  });
  const department = departments.find((item) => item.id === departmentId);

  const levelColumns: TableColumn[] = [
    { accessor: "name", title: "Name" },
    {
      accessor: "createdAt",
      title: "Created",
      render: (row: NamedRow) => formatDate(row.createdAt),
    },
    {
      accessor: "actions",
      title: "Actions",
      textAlign: "right",
      render: (row: NamedRow) => (
        <Button
          type="button"
          variant="subtle"
          size="xs"
          onClick={(event) => {
            event.stopPropagation();
            setEditingLevel({ id: row.id, name: row.name });
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const semesterColumns: TableColumn[] = [
    { accessor: "name", title: "Name" },
    {
      accessor: "createdAt",
      title: "Created",
      render: (row: NamedRow) => formatDate(row.createdAt),
    },
    {
      accessor: "actions",
      title: "Actions",
      textAlign: "right",
      render: (row: NamedRow) => (
        <Button
          type="button"
          variant="subtle"
          size="xs"
          onClick={(event) => {
            event.stopPropagation();
            setEditingSemester({ id: row.id, name: row.name });
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

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
        { label: department?.name ?? "Department" },
      ]}
      title={department?.name ?? "Department"}
      description="Levels and semesters within the selected department."
      actions={[
        {
          key: tab === "levels" ? "new-level" : "new-semester",
          label: tab === "levels" ? "New level" : "New semester",
          icon: <IconPlus size={20} />,
          onClick: () =>
            tab === "levels"
              ? setLevelCreateOpen(true)
              : setSemesterCreateOpen(true),
        },
      ]}
    >
      <Tabs
        value={tab}
        onChange={(value) => {
          if (value === "levels" || value === "semesters") setTab(value);
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="levels">Levels</Tabs.Tab>
          <Tabs.Tab value="semesters">Semesters</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="levels" pt="sm">
          <CollectionTable
            columns={levelColumns}
            fetchApi={listLevels}
            cacheKey={actionKeys.listLevels}
            customQuery={{ departmentId }}
            limit={20}
          />
        </Tabs.Panel>

        <Tabs.Panel value="semesters" pt="sm">
          <CollectionTable
            columns={semesterColumns}
            fetchApi={listSemesters}
            cacheKey={actionKeys.listSemesters}
            customQuery={{ departmentId }}
            limit={20}
          />
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={levelCreateOpen}
        onClose={() => setLevelCreateOpen(false)}
        title="Create level"
        centered
      >
        <LevelForm
          departmentId={departmentId}
          onSuccess={() => setLevelCreateOpen(false)}
        />
      </Modal>
      <Modal
        opened={editingLevel !== null}
        onClose={() => setEditingLevel(null)}
        title={editingLevel ? `Edit ${editingLevel.name}` : "Edit level"}
        centered
      >
        {editingLevel && (
          <LevelForm
            key={editingLevel.id}
            departmentId={departmentId}
            initialValue={editingLevel}
            onSuccess={() => setEditingLevel(null)}
          />
        )}
      </Modal>

      <Modal
        opened={semesterCreateOpen}
        onClose={() => setSemesterCreateOpen(false)}
        title="Create semester"
        centered
      >
        <SemesterForm
          departmentId={departmentId}
          onSuccess={() => setSemesterCreateOpen(false)}
        />
      </Modal>
      <Modal
        opened={editingSemester !== null}
        onClose={() => setEditingSemester(null)}
        title={
          editingSemester ? `Edit ${editingSemester.name}` : "Edit semester"
        }
        centered
      >
        {editingSemester && (
          <SemesterForm
            key={editingSemester.id}
            departmentId={departmentId}
            initialValue={editingSemester}
            onSuccess={() => setEditingSemester(null)}
          />
        )}
      </Modal>
    </PageContainer>
  );
}
