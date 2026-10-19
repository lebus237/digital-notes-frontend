import { Modal } from "@mantine/core";
import { IconBuilding, IconPlus } from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@digitalnotes/core";
import { listFaculties } from "@/shared/api/endpoints/organisation";
import { actionKeys } from "@/shared/api/action-keys";
import { FacultyForm } from "./forms/faculty-form";
import { OrganisationEntityGrid } from "./components/organisation-cards";
import { universitiesUrl } from "./components/organisation-navigation";

const facultiesRoute = getRouteApi("/_app/organisation/faculties");

export function FacultiesView() {
  const { universityId } = facultiesRoute.useSearch();
  const navigate = facultiesRoute.useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  function handleCreated() {
    setCreateOpen(false);
  }

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Organisation", to: universitiesUrl() },
        {
          label: "Universities",
          to: universitiesUrl(),
        },
        { label: "Faculties" },
      ]}
      title="Faculties"
      description="Faculties within the selected university."
      icon={<IconBuilding size={20} />}
      actions={[
        {
          key: "new-faculty",
          label: "New faculty",
          icon: <IconPlus size={20} />,
          onClick: () => setCreateOpen(true),
        },
      ]}
    >
      <OrganisationEntityGrid
        fetchApi={listFaculties}
        cacheKey={actionKeys.listFaculties}
        customQuery={{ universityId }}
        kind="Faculty"
        openLabel="departments"
        emptyMessage="No faculties yet. Add the first faculty to this university."
        onItemClick={(item) =>
          void navigate({
            to: "/organisation/departments",
            search: {
              universityId,
              facultyId: item.id,
            },
          })
        }
      />
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create faculty"
        centered
      >
        <FacultyForm universityId={universityId} onSuccess={handleCreated} />
      </Modal>
    </PageContainer>
  );
}
