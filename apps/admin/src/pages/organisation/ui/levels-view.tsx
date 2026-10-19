import { Modal } from "@mantine/core";
import { IconBuilding, IconPlus } from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@digitalnotes/core";
import { listLevels } from "@/shared/api/endpoints/organisation";
import { actionKeys } from "@/shared/api/action-keys";
import { LevelForm } from "./forms/level-form";
import { OrganisationEntityGrid } from "./components/organisation-cards";
import {
  departmentsUrl,
  facultiesUrl,
  levelsUrl,
  universitiesUrl,
} from "./components/organisation-navigation";

const levelsRoute = getRouteApi("/_app/organisation/levels");

export function LevelsView() {
  const { universityId, facultyId, departmentId } = levelsRoute.useSearch();
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
          label: "Faculties",
          to: facultiesUrl({ universityId }),
        },
        {
          label: "Departments",
          to: departmentsUrl({ universityId, facultyId }),
        },
        {
          label: "Levels",
          to: levelsUrl({ universityId, facultyId, departmentId }),
        },
      ]}
      title="Levels"
      description="Levels within the selected department."
      icon={<IconBuilding size={20} />}
      actions={[
        {
          key: "new-level",
          label: "New level",
          icon: <IconPlus size={20} />,
          onClick: () => setCreateOpen(true),
        },
      ]}
    >
      <OrganisationEntityGrid
        fetchApi={listLevels}
        cacheKey={actionKeys.listLevels}
        customQuery={{ departmentId }}
        kind="Level"
        emptyMessage="No levels yet. Add the first level to this department."
      />
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create level"
        centered
      >
        <LevelForm departmentId={departmentId} onSuccess={handleCreated} />
      </Modal>
    </PageContainer>
  );
}
