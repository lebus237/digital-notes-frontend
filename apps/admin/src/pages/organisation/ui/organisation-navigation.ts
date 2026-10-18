export type OrganisationIds = {
  universityId?: string;
  facultyId?: string;
  departmentId?: string;
};

function withQuery(base: string, location: OrganisationIds = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(location)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function universitiesUrl() {
  return "/organisation";
}

export function facultiesUrl(
  location: Pick<OrganisationIds, "universityId"> = {},
) {
  return withQuery("/organisation/faculties", location);
}

export function departmentsUrl(
  location: Pick<OrganisationIds, "universityId" | "facultyId"> = {},
) {
  return withQuery("/organisation/departments", location);
}

export function levelsUrl(location: OrganisationIds = {}) {
  return withQuery("/organisation/levels", location);
}
