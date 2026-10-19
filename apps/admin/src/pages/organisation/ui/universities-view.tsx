import { Modal } from "@mantine/core";
import { IconBuilding, IconPlus } from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@digitalnotes/core";
import { listUniversities } from "@/shared/api/endpoints/organisation";
import { actionKeys } from "@/shared/api/action-keys";
import { UniversityForm } from "./forms/university-form";
import { OrganisationEntityGrid } from "./components/organisation-cards";

const universitiesRoute = getRouteApi("/_app/organisation/");

export function UniversitiesView() {
  const navigate = universitiesRoute.useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  function handleCreated() {
    setCreateOpen(false);
  }

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Organisation", to: "/organisation" },
        { label: "Universities" },
      ]}
      title="Universities"
      description="Choose a university to manage its faculties and departments."
      icon={<IconBuilding size={20} />}
      actions={[
        {
          key: "new-university",
          label: "New university",
          icon: <IconPlus size={20} />,
          onClick: () => setCreateOpen(true),
        },
      ]}
    >
      <OrganisationEntityGrid
        fetchApi={listUniversities}
        cacheKey={actionKeys.listUniversities}
        kind="University"
        openLabel="faculties"
        emptyMessage="No universities yet. Create a university to begin."
        onItemClick={(item) =>
          void navigate({
            to: "/organisation/faculties",
            search: { universityId: item.id },
          })
        }
      />
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create university"
        centered
      >
        <UniversityForm onSuccess={handleCreated} />
      </Modal>
    </PageContainer>
  );
}
