import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
  boolean,
  integer,
  bigint,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// ENUMS
// ============================================================

export const genderEnum = pgEnum("gender", ["male", "female", "other", "prefer_not_to_say"]);
export const transferDirectionEnum = pgEnum("transfer_direction", ["in", "out"]);
export const transferStatusEnum = pgEnum("transfer_status", [
  "requested",
  "pending",
  "approved",
  "completed",
  "cancelled",
  "rejected",
]);
export const membershipEventTypeEnum = pgEnum("membership_event_type", [
  "joined",
  "baptized",
  "transferred_in",
  "transferred_out",
  "status_change",
  "reinstated",
  "deceased",
  "other",
]);
export const assignmentStatusEnum = pgEnum("assignment_status", [
  "active",
  "completed",
  "resigned",
  "removed",
]);
export const meetingStatusEnum = pgEnum("meeting_status", [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
  "postponed",
]);
export const minutesStatusEnum = pgEnum("minutes_status", [
  "draft",
  "submitted",
  "reviewed",
  "approved",
  "archived",
]);
export const resolutionStatusEnum = pgEnum("resolution_status", [
  "pending",
  "in_progress",
  "completed",
  "deferred",
  "cancelled",
]);
export const actionItemStatusEnum = pgEnum("action_item_status", [
  "pending",
  "in_progress",
  "completed",
  "deferred",
  "cancelled",
]);
export const correspondenceDirectionEnum = pgEnum("correspondence_direction", ["in", "out"]);
export const correspondenceStatusEnum = pgEnum("correspondence_status", [
  "received",
  "pending_action",
  "actioned",
  "archived",
  "sent",
  "awaiting_response",
]);
export const documentStatusEnum = pgEnum("document_status", [
  "draft",
  "active",
  "archived",
  "superseded",
]);
export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "apology",
  "absent",
]);
export const userStatusEnum = pgEnum("user_status", ["active", "inactive", "suspended"]);
export const relationshipTypeEnum = pgEnum("relationship_type", [
  "husband",
  "wife",
  "father",
  "mother",
  "son",
  "daughter",
  "guardian",
  "dependant",
  "other",
]);

// ============================================================
// CORE: CHURCH & USERS
// ============================================================

export const churches = pgTable("churches", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: text("logo_url"),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  timezone: varchar("timezone", { length: 100 }).default("Africa/Nairobi").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "restrict" }),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_church_email_idx").on(table.churchId, table.email),
    index("users_church_id_idx").on(table.churchId),
  ]
);

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })]
);

// ============================================================
// MEMBERSHIP
// ============================================================

export const membershipStatuses = pgTable(
  "membership_statuses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("membership_statuses_church_name_idx").on(table.churchId, table.name),
  ]
);

export const members = pgTable(
  "members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "restrict" }),
    membershipNumber: varchar("membership_number", { length: 50 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    middleName: varchar("middle_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    preferredName: varchar("preferred_name", { length: 100 }),
    gender: genderEnum("gender"),
    dateOfBirth: date("date_of_birth"),
    nationality: varchar("nationality", { length: 100 }),
    phone: varchar("phone", { length: 50 }),
    altPhone: varchar("alt_phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    physicalAddress: text("physical_address"),
    postalAddress: text("postal_address"),
    occupation: varchar("occupation", { length: 150 }),
    emergencyContact: text("emergency_contact"),
    photoUrl: text("photo_url"),
    membershipStatusId: uuid("membership_status_id").references(() => membershipStatuses.id, {
      onDelete: "restrict",
    }),
    dateJoined: date("date_joined"),
    previousChurch: varchar("previous_church", { length: 255 }),
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("members_church_membership_number_idx").on(
      table.churchId,
      table.membershipNumber
    ),
    index("members_church_id_idx").on(table.churchId),
    index("members_name_idx").on(table.lastName, table.firstName),
    index("members_phone_idx").on(table.phone),
    index("members_email_idx").on(table.email),
    index("members_status_idx").on(table.membershipStatusId),
  ]
);

export const families = pgTable("families", {
  id: uuid("id").defaultRandom().primaryKey(),
  churchId: uuid("church_id")
    .notNull()
    .references(() => churches.id, { onDelete: "restrict" }),
  familyName: varchar("family_name", { length: 255 }).notNull(),
  headOfHouseholdId: uuid("head_of_household_id").references(() => members.id, {
    onDelete: "set null",
  }),
  householdAddress: text("household_address"),
  contactPhone: varchar("contact_phone", { length: 50 }),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const familyMembers = pgTable(
  "family_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    familyId: uuid("family_id")
      .notNull()
      .references(() => families.id, { onDelete: "cascade" }),
    memberId: uuid("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    relationshipType: relationshipTypeEnum("relationship_type").notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("family_members_family_member_idx").on(table.familyId, table.memberId),
    index("family_members_member_id_idx").on(table.memberId),
  ]
);

export const membershipHistory = pgTable(
  "membership_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    memberId: uuid("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "restrict" }),
    eventType: membershipEventTypeEnum("event_type").notNull(),
    eventDate: date("event_date").notNull(),
    previousStatusId: uuid("previous_status_id").references(() => membershipStatuses.id, {
      onDelete: "set null",
    }),
    newStatusId: uuid("new_status_id").references(() => membershipStatuses.id, {
      onDelete: "set null",
    }),
    previousChurch: varchar("previous_church", { length: 255 }),
    newChurch: varchar("new_church", { length: 255 }),
    reason: text("reason"),
    recordedBy: uuid("recorded_by").references(() => users.id, { onDelete: "set null" }),
    documentId: uuid("document_id"), // FK added after documents table
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("membership_history_member_id_idx").on(table.memberId),
    index("membership_history_event_date_idx").on(table.eventDate),
  ]
);

export const baptismRecords = pgTable(
  "baptism_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    memberId: uuid("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "restrict" }),
    baptismDate: date("baptism_date").notNull(),
    venue: varchar("venue", { length: 255 }),
    minister: varchar("minister", { length: 255 }),
    preparationNotes: text("preparation_notes"),
    certificateNumber: varchar("certificate_number", { length: 100 }),
    certificateDocumentId: uuid("certificate_document_id"), // FK later
    recordedBy: uuid("recorded_by").references(() => users.id, { onDelete: "set null" }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("baptism_records_member_id_idx").on(table.memberId)]
);

export const transferRecords = pgTable(
  "transfer_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    memberId: uuid("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "restrict" }),
    direction: transferDirectionEnum("direction").notNull(),
    previousChurch: varchar("previous_church", { length: 255 }),
    receivingChurch: varchar("receiving_church", { length: 255 }),
    district: varchar("district", { length: 255 }),
    requestDate: date("request_date"),
    approvalDate: date("approval_date"),
    completionDate: date("completion_date"),
    status: transferStatusEnum("status").default("requested").notNull(),
    clerkId: uuid("clerk_id").references(() => users.id, { onDelete: "set null" }),
    documentId: uuid("document_id"), // FK later
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("transfer_records_member_id_idx").on(table.memberId),
    index("transfer_records_status_idx").on(table.status),
  ]
);

// ============================================================
// DEPARTMENTS & LEADERSHIP
// ============================================================

export const departments = pgTable(
  "departments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description"),
    type: varchar("type", { length: 100 }),
    status: varchar("status", { length: 50 }).default("active").notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("departments_church_name_idx").on(table.churchId, table.name),
    index("departments_church_id_idx").on(table.churchId),
  ]
);

export const departmentMembers = pgTable(
  "department_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "restrict" }),
    memberId: uuid("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "restrict" }),
    position: varchar("position", { length: 150 }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    status: assignmentStatusEnum("status").default("active").notNull(),
    appointmentSource: varchar("appointment_source", { length: 255 }),
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("department_members_department_id_idx").on(table.departmentId),
    index("department_members_member_id_idx").on(table.memberId),
    index("department_members_status_idx").on(table.status),
  ]
);

export const leadershipPositions = pgTable(
  "leadership_positions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description"),
    isDepartmentSpecific: boolean("is_department_specific").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("leadership_positions_church_name_idx").on(table.churchId, table.name),
  ]
);

export const leadershipAssignments = pgTable(
  "leadership_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    memberId: uuid("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "restrict" }),
    positionId: uuid("position_id")
      .notNull()
      .references(() => leadershipPositions.id, { onDelete: "restrict" }),
    departmentId: uuid("department_id").references(() => departments.id, {
      onDelete: "set null",
    }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    status: assignmentStatusEnum("status").default("active").notNull(),
    appointmentMeetingId: uuid("appointment_meeting_id"), // FK later
    documentId: uuid("document_id"), // FK later
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("leadership_assignments_member_id_idx").on(table.memberId),
    index("leadership_assignments_position_id_idx").on(table.positionId),
    index("leadership_assignments_status_idx").on(table.status),
  ]
);

// ============================================================
// SECRETARIAT: MEETINGS
// ============================================================

export const meetingTypes = pgTable(
  "meeting_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("meeting_types_church_name_idx").on(table.churchId, table.name)]
);

export const meetings = pgTable(
  "meetings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "restrict" }),
    meetingTypeId: uuid("meeting_type_id")
      .notNull()
      .references(() => meetingTypes.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 255 }).notNull(),
    date: date("date").notNull(),
    startTime: varchar("start_time", { length: 10 }),
    endTime: varchar("end_time", { length: 10 }),
    venue: varchar("venue", { length: 255 }),
    chairpersonId: uuid("chairperson_id").references(() => members.id, {
      onDelete: "set null",
    }),
    secretaryId: uuid("secretary_id").references(() => members.id, { onDelete: "set null" }),
    status: meetingStatusEnum("status").default("scheduled").notNull(),
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("meetings_church_id_idx").on(table.churchId),
    index("meetings_date_idx").on(table.date),
    index("meetings_type_id_idx").on(table.meetingTypeId),
    index("meetings_status_idx").on(table.status),
  ]
);

export const meetingAttendees = pgTable(
  "meeting_attendees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    memberId: uuid("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "restrict" }),
    status: attendanceStatusEnum("status").default("present").notNull(),
    notes: text("notes"),
  },
  (table) => [
    uniqueIndex("meeting_attendees_meeting_member_idx").on(table.meetingId, table.memberId),
    index("meeting_attendees_meeting_id_idx").on(table.meetingId),
  ]
);

export const meetingAgendaItems = pgTable(
  "meeting_agenda_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    presenterId: uuid("presenter_id").references(() => members.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("meeting_agenda_items_meeting_id_idx").on(table.meetingId)]
);

// ============================================================
// DOCUMENTS (defined early so other tables can reference)
// ============================================================

export const documentCategories = pgTable(
  "document_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 150 }).notNull(),
    parentId: uuid("parent_id"),
    description: text("description"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("document_categories_church_name_idx").on(table.churchId, table.name),
  ]
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 255 }).notNull(),
    categoryId: uuid("category_id").references(() => documentCategories.id, {
      onDelete: "set null",
    }),
    description: text("description"),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileType: varchar("file_type", { length: 100 }).notNull(),
    fileSize: bigint("file_size", { mode: "number" }),
    storageKey: text("storage_key").notNull(),
    status: documentStatusEnum("status").default("active").notNull(),
    uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("documents_church_id_idx").on(table.churchId),
    index("documents_category_id_idx").on(table.categoryId),
    index("documents_created_at_idx").on(table.createdAt),
  ]
);

export const documentTags = pgTable(
  "document_tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("document_tags_church_name_idx").on(table.churchId, table.name)]
);

export const documentTagAssignments = pgTable(
  "document_tag_assignments",
  {
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => documentTags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.documentId, table.tagId] })]
);

export const documentLinks = pgTable(
  "document_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    entityType: varchar("entity_type", { length: 50 }).notNull(), // member, meeting, resolution, etc.
    entityId: uuid("entity_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("document_links_document_id_idx").on(table.documentId),
    index("document_links_entity_idx").on(table.entityType, table.entityId),
  ]
);

// ============================================================
// SECRETARIAT: MINUTES, RESOLUTIONS, ACTION ITEMS
// ============================================================

export const minutes = pgTable(
  "minutes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 255 }).notNull(),
    status: minutesStatusEnum("status").default("draft").notNull(),
    fileDocumentId: uuid("file_document_id").references(() => documents.id, {
      onDelete: "set null",
    }),
    uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("minutes_meeting_id_idx").on(table.meetingId),
    index("minutes_status_idx").on(table.status),
  ]
);

export const resolutions = pgTable(
  "resolutions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "restrict" }),
    resolutionNumber: varchar("resolution_number", { length: 50 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    description: text("description"),
    decision: text("decision"),
    responsibleMemberId: uuid("responsible_member_id").references(() => members.id, {
      onDelete: "set null",
    }),
    responsibleDepartmentId: uuid("responsible_department_id").references(() => departments.id, {
      onDelete: "set null",
    }),
    dueDate: date("due_date"),
    status: resolutionStatusEnum("status").default("pending").notNull(),
    documentId: uuid("document_id").references(() => documents.id, { onDelete: "set null" }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("resolutions_meeting_number_idx").on(table.meetingId, table.resolutionNumber),
    index("resolutions_status_idx").on(table.status),
    index("resolutions_meeting_id_idx").on(table.meetingId),
  ]
);

export const actionItems = pgTable(
  "action_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "restrict" }),
    resolutionId: uuid("resolution_id").references(() => resolutions.id, {
      onDelete: "set null",
    }),
    description: text("description").notNull(),
    responsibleMemberId: uuid("responsible_member_id").references(() => members.id, {
      onDelete: "set null",
    }),
    responsibleDepartmentId: uuid("responsible_department_id").references(() => departments.id, {
      onDelete: "set null",
    }),
    dueDate: date("due_date"),
    status: actionItemStatusEnum("status").default("pending").notNull(),
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("action_items_meeting_id_idx").on(table.meetingId),
    index("action_items_status_idx").on(table.status),
  ]
);

// ============================================================
// CORRESPONDENCE
// ============================================================

export const correspondence = pgTable(
  "correspondence",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "restrict" }),
    direction: correspondenceDirectionEnum("direction").notNull(),
    date: date("date").notNull(),
    sender: varchar("sender", { length: 255 }),
    recipient: varchar("recipient", { length: 255 }),
    subject: varchar("subject", { length: 255 }).notNull(),
    referenceNumber: varchar("reference_number", { length: 100 }),
    departmentId: uuid("department_id").references(() => departments.id, {
      onDelete: "set null",
    }),
    documentId: uuid("document_id").references(() => documents.id, { onDelete: "set null" }),
    actionRequired: text("action_required"),
    status: correspondenceStatusEnum("status").default("received").notNull(),
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("correspondence_church_id_idx").on(table.churchId),
    index("correspondence_date_idx").on(table.date),
    index("correspondence_direction_idx").on(table.direction),
  ]
);

// ============================================================
// SYSTEM
// ============================================================

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "restrict" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 100 }).notNull(),
    entityId: uuid("entity_id"),
    oldValues: jsonb("old_values"),
    newValues: jsonb("new_values"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("audit_logs_church_id_idx").on(table.churchId),
    index("audit_logs_created_at_idx").on(table.createdAt),
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
  ]
);

export const settings = pgTable(
  "settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => churches.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 100 }).notNull(),
    value: jsonb("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("settings_church_key_idx").on(table.churchId, table.key)]
);

// ============================================================
// RELATIONS
// ============================================================

export const churchesRelations = relations(churches, ({ many }) => ({
  users: many(users),
  members: many(members),
  departments: many(departments),
  meetings: many(meetings),
  documents: many(documents),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  church: one(churches, { fields: [users.churchId], references: [churches.id] }),
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
  church: one(churches, { fields: [members.churchId], references: [churches.id] }),
  membershipStatus: one(membershipStatuses, {
    fields: [members.membershipStatusId],
    references: [membershipStatuses.id],
  }),
  familyMembers: many(familyMembers),
  membershipHistory: many(membershipHistory),
  baptismRecords: many(baptismRecords),
  transferRecords: many(transferRecords),
  departmentMembers: many(departmentMembers),
  leadershipAssignments: many(leadershipAssignments),
}));

export const familiesRelations = relations(families, ({ one, many }) => ({
  church: one(churches, { fields: [families.churchId], references: [churches.id] }),
  headOfHousehold: one(members, {
    fields: [families.headOfHouseholdId],
    references: [members.id],
  }),
  familyMembers: many(familyMembers),
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  family: one(families, { fields: [familyMembers.familyId], references: [families.id] }),
  member: one(members, { fields: [familyMembers.memberId], references: [members.id] }),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  church: one(churches, { fields: [departments.churchId], references: [churches.id] }),
  departmentMembers: many(departmentMembers),
  leadershipAssignments: many(leadershipAssignments),
}));

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
  church: one(churches, { fields: [meetings.churchId], references: [churches.id] }),
  meetingType: one(meetingTypes, {
    fields: [meetings.meetingTypeId],
    references: [meetingTypes.id],
  }),
  chairperson: one(members, { fields: [meetings.chairpersonId], references: [members.id] }),
  secretary: one(members, { fields: [meetings.secretaryId], references: [members.id] }),
  attendees: many(meetingAttendees),
  agendaItems: many(meetingAgendaItems),
  minutes: many(minutes),
  resolutions: many(resolutions),
  actionItems: many(actionItems),
}));

export const minutesRelations = relations(minutes, ({ one }) => ({
  meeting: one(meetings, { fields: [minutes.meetingId], references: [meetings.id] }),
  fileDocument: one(documents, {
    fields: [minutes.fileDocumentId],
    references: [documents.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  church: one(churches, { fields: [documents.churchId], references: [churches.id] }),
  category: one(documentCategories, {
    fields: [documents.categoryId],
    references: [documentCategories.id],
  }),
  tagAssignments: many(documentTagAssignments),
  links: many(documentLinks),
}));
