/**
 * Permission matrix for Church Membership & Secretariat System
 *
 * Resources: members, families, baptisms, transfers, departments,
 * leadership, meetings, minutes, resolutions, action_items,
 * correspondence, documents, reports, settings, users, audit
 *
 * Actions: view, create, edit, delete, approve, upload, download, export, archive
 */

export type Resource =
  | "members"
  | "families"
  | "baptisms"
  | "transfers"
  | "departments"
  | "leadership"
  | "meetings"
  | "minutes"
  | "resolutions"
  | "action_items"
  | "correspondence"
  | "documents"
  | "reports"
  | "settings"
  | "users"
  | "audit";

export type Action =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approve"
  | "upload"
  | "download"
  | "export"
  | "archive";

export type Role =
  | "Administrator"
  | "Church Clerk"
  | "Assistant Clerk"
  | "Pastor"
  | "Elder"
  | "Department Leader"
  | "Read Only";

type PermissionMap = Record<Role, Partial<Record<Resource, Action[]>>>;

const ALL_ACTIONS: Action[] = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
  "upload",
  "download",
  "export",
  "archive",
];

const VIEW_ONLY: Action[] = ["view", "download"];
const CLERK_ACTIONS: Action[] = [
  "view",
  "create",
  "edit",
  "upload",
  "download",
  "export",
  "archive",
];

export const PERMISSIONS: PermissionMap = {
  Administrator: {
    members: ALL_ACTIONS,
    families: ALL_ACTIONS,
    baptisms: ALL_ACTIONS,
    transfers: ALL_ACTIONS,
    departments: ALL_ACTIONS,
    leadership: ALL_ACTIONS,
    meetings: ALL_ACTIONS,
    minutes: ALL_ACTIONS,
    resolutions: ALL_ACTIONS,
    action_items: ALL_ACTIONS,
    correspondence: ALL_ACTIONS,
    documents: ALL_ACTIONS,
    reports: ["view", "export"],
    settings: ALL_ACTIONS,
    users: ALL_ACTIONS,
    audit: ["view"],
  },
  "Church Clerk": {
    members: CLERK_ACTIONS,
    families: CLERK_ACTIONS,
    baptisms: CLERK_ACTIONS,
    transfers: CLERK_ACTIONS,
    departments: ["view", "create", "edit", "export"],
    leadership: ["view", "create", "edit", "export"],
    meetings: CLERK_ACTIONS,
    minutes: [...CLERK_ACTIONS, "approve"],
    resolutions: CLERK_ACTIONS,
    action_items: CLERK_ACTIONS,
    correspondence: CLERK_ACTIONS,
    documents: CLERK_ACTIONS,
    reports: ["view", "export"],
    settings: ["view"],
    users: ["view"],
    audit: [],
  },
  "Assistant Clerk": {
    members: ["view", "create", "edit", "download", "export"],
    families: ["view", "create", "edit"],
    baptisms: ["view", "create", "edit", "upload"],
    transfers: ["view", "create", "edit", "upload"],
    departments: ["view"],
    leadership: ["view"],
    meetings: ["view", "create", "edit"],
    minutes: ["view", "create", "edit", "upload", "download"],
    resolutions: ["view", "create", "edit"],
    action_items: ["view", "create", "edit"],
    correspondence: ["view", "create", "edit", "upload"],
    documents: ["view", "create", "upload", "download"],
    reports: ["view", "export"],
    settings: [],
    users: [],
    audit: [],
  },
  Pastor: {
    members: ["view", "edit", "download", "export"],
    families: ["view"],
    baptisms: ["view"],
    transfers: ["view"],
    departments: ["view"],
    leadership: ["view"],
    meetings: ["view"],
    minutes: ["view", "download"],
    resolutions: ["view"],
    action_items: ["view"],
    correspondence: ["view"],
    documents: ["view", "download"],
    reports: ["view", "export"],
    settings: [],
    users: [],
    audit: [],
  },
  Elder: {
    members: VIEW_ONLY,
    families: VIEW_ONLY,
    baptisms: VIEW_ONLY,
    transfers: VIEW_ONLY,
    departments: VIEW_ONLY,
    leadership: VIEW_ONLY,
    meetings: VIEW_ONLY,
    minutes: VIEW_ONLY,
    resolutions: VIEW_ONLY,
    action_items: VIEW_ONLY,
    correspondence: VIEW_ONLY,
    documents: VIEW_ONLY,
    reports: ["view"],
    settings: [],
    users: [],
    audit: [],
  },
  "Department Leader": {
    members: ["view"], // scoped to own department in application logic
    families: [],
    baptisms: [],
    transfers: [],
    departments: ["view", "edit"], // own department only
    leadership: ["view"],
    meetings: ["view"],
    minutes: ["view", "download"],
    resolutions: ["view"],
    action_items: ["view", "edit"], // own items
    correspondence: ["view"],
    documents: ["view", "upload", "download"], // own department
    reports: ["view"],
    settings: [],
    users: [],
    audit: [],
  },
  "Read Only": {
    members: VIEW_ONLY,
    families: VIEW_ONLY,
    baptisms: VIEW_ONLY,
    transfers: VIEW_ONLY,
    departments: VIEW_ONLY,
    leadership: VIEW_ONLY,
    meetings: VIEW_ONLY,
    minutes: VIEW_ONLY,
    resolutions: VIEW_ONLY,
    action_items: VIEW_ONLY,
    correspondence: VIEW_ONLY,
    documents: VIEW_ONLY,
    reports: ["view"],
    settings: [],
    users: [],
    audit: [],
  },
};

export function can(
  userRoles: string[],
  resource: Resource,
  action: Action
): boolean {
  for (const role of userRoles) {
    const perms = PERMISSIONS[role as Role];
    if (perms?.[resource]?.includes(action)) {
      return true;
    }
  }
  return false;
}

export function requirePermission(
  userRoles: string[],
  resource: Resource,
  action: Action
): void {
  if (!can(userRoles, resource, action)) {
    throw new Error(`Permission denied: ${action} on ${resource}`);
  }
}
