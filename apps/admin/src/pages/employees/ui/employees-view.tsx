import { Alert, Button, Modal, Select } from "@mantine/core";
import { IconPlus, IconUsers } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listEmployees } from "@/shared/api/endpoints/employees";
import { EmployeeForm } from "./employee-form";
import {
  CollectionTable,
  PageContainer,
  type TableColumn,
} from "@digitalnotes/core";
import { adminResetPassword } from "@/shared/api/endpoints";

const breadcrumbs = [
  { label: "Home", to: "/" as const },
  { label: "Employees" },
];

const ROLE_OPTIONS = [
  { value: "administrator", label: "Administrator" },
  { value: "staff", label: "Staff" },
  { value: "reviewer", label: "Reviewer" },
];

export function EmployeesView() {
  const queryClient = useQueryClient();
  const [universityId, setUniversityId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const resetMutation = useMutation({
    mutationFn: (id: string) =>
      adminResetPassword(id, {
        newPassword: `Reset-${Date.now().toString(36)}-Aa1`,
      }),
    onSuccess: () => setFeedback("Password reset link sent."),
    onError: (error) =>
      setFeedback(
        error instanceof Error ? error.message : "Could not reset password.",
      ),
  });

  const columns: TableColumn[] = [
    { accessor: "fullName", title: "Name", render: (row: any) => row.fullName },
    { accessor: "email", title: "Email", render: (row: any) => row.email },
    { accessor: "role", title: "Role", render: (row: any) => row.role },
    {
      accessor: "actions",
      title: "Actions",
      textAlign: "right",
      render: (row: any) => (
        <Button
          type="button"
          variant="subtle"
          size="xs"
          loading={resetMutation.isPending}
          onClick={() => resetMutation.mutate(row.id)}
        >
          Reset password
        </Button>
      ),
    },
  ];

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      title="Employees"
      description="Manage employee accounts and access"
      icon={<IconUsers size={20} />}
      actions={[
        {
          key: "new-employee",
          label: "New employee",
          icon: <IconPlus size={16} />,
          size: "xs",
          onClick: () => setCreateOpen(true),
        },
      ]}
    >
      {feedback && <Alert color="blue">{feedback}</Alert>}
      <CollectionTable
        columns={columns}
        fetchApi={listEmployees}
        cacheKey="admin-employees"
        customQuery={universityId ? { universityId } : undefined}
        limit={20}
      ></CollectionTable>
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create employee"
        centered
      >
        <EmployeeForm
          universities={[{ value: "", label: "" }]}
          roles={ROLE_OPTIONS}
          onSuccess={() => {
            setCreateOpen(false);
            setFeedback("Employee created.");
            void queryClient.invalidateQueries({
              queryKey: ["admin", "employees"],
            });
          }}
        />
      </Modal>
    </PageContainer>
  );
}
