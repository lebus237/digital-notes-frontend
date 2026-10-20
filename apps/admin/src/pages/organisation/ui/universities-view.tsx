import { Modal } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@digitalnotes/core";
import { listUniversities } from "@/shared/api/endpoints/organisation";
import { actionKeys } from "@/shared/api/action-keys";
import { UniversityForm } from "./forms/university-form";
import {
  OrganisationEntityGrid,
  type OrganisationEntityItem,
} from "./components/organisation-cards";

const universitiesRoute = getRouteApi("/_app/organisation/");

export function UniversitiesView() {
  const navigate = universitiesRoute.useNavigate();
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
        { label: "Organisation", to: "/organisation" },
        { label: "Universities" },
      ]}
      title="Universities"
      description="Choose a university to manage its faculties and departments."
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
        kind="university"
        openLabel="faculties"
        emptyMessage="No universities yet. Create a university to begin."
        onItemClick={(item) =>
          void navigate({
            to: "/organisation/faculties",
            search: { universityId: item.id },
          })
        }
        onEdit={setEditingItem}
      />
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create university"
        centered
      >
        <UniversityForm onSuccess={handleSaved} />
      </Modal>
      <Modal
        opened={editingItem !== null}
        onClose={() => setEditingItem(null)}
        title={editingItem ? `Edit ${editingItem.name}` : "Edit university"}
        centered
      >
        {editingItem && (
          <UniversityForm
            key={editingItem.id}
            initialValue={editingItem}
            onSuccess={handleSaved}
          />
        )}
      </Modal>
    </PageContainer>
  );
}
