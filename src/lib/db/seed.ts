/**
 * Seed script – run with: npm run db:seed
 * Requires DATABASE_URL in .env.local
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...");

  // 1. Church
  const [church] = await db
    .insert(schema.churches)
    .values({
      name: "Sample Seventh-day Adventist Church",
      address: "123 Church Street",
      phone: "+254700000000",
      email: "info@samplechurch.org",
      timezone: "Africa/Nairobi",
    })
    .returning();

  console.log("Created church:", church.name);

  // 2. Roles
  const roleNames = [
    "Administrator",
    "Church Clerk",
    "Assistant Clerk",
    "Pastor",
    "Elder",
    "Department Leader",
    "Read Only",
  ];

  const insertedRoles = await db
    .insert(schema.roles)
    .values(roleNames.map((name) => ({ name, description: `${name} role` })))
    .returning();

  console.log("Created roles:", insertedRoles.map((r) => r.name).join(", "));

  // 3. Admin user
  const passwordHash = await hash("admin123", 12);
  const [admin] = await db
    .insert(schema.users)
    .values({
      churchId: church.id,
      email: "admin@samplechurch.org",
      name: "System Administrator",
      passwordHash,
      status: "active",
    })
    .returning();

  const adminRole = insertedRoles.find((r) => r.name === "Administrator")!;
  await db.insert(schema.userRoles).values({
    userId: admin.id,
    roleId: adminRole.id,
  });

  console.log("Created admin user: admin@samplechurch.org / admin123");

  // 4. Membership statuses
  const statuses = [
    { name: "Active", sortOrder: 1 },
    { name: "Inactive", sortOrder: 2 },
    { name: "Transferred", sortOrder: 3 },
    { name: "Deceased", sortOrder: 4 },
    { name: "Missing / Unknown", sortOrder: 5 },
  ];

  await db.insert(schema.membershipStatuses).values(
    statuses.map((s) => ({
      churchId: church.id,
      name: s.name,
      sortOrder: s.sortOrder,
      isActive: true,
    }))
  );

  console.log("Created membership statuses");

  // 5. Meeting types
  const meetingTypes = [
    "Church Board",
    "Business Meeting",
    "Elders Meeting",
    "Department Meeting",
    "Committee Meeting",
    "Finance Committee",
    "Worship Committee",
    "Youth Committee",
    "Sabbath School Committee",
    "School Committee",
  ];

  await db.insert(schema.meetingTypes).values(
    meetingTypes.map((name, i) => ({
      churchId: church.id,
      name,
      sortOrder: i + 1,
    }))
  );

  console.log("Created meeting types");

  // 6. Document categories
  const docCategories = [
    "Minutes",
    "Membership",
    "Baptism",
    "Transfers",
    "Correspondence",
    "Reports",
    "Appointments",
    "Policies",
    "Certificates",
    "Forms",
    "Department Documents",
    "Annual Reports",
    "Other",
  ];

  await db.insert(schema.documentCategories).values(
    docCategories.map((name, i) => ({
      churchId: church.id,
      name,
      sortOrder: i + 1,
    }))
  );

  console.log("Created document categories");

  // 7. Leadership positions
  const positions = [
    { name: "Pastor", isDepartmentSpecific: false },
    { name: "Elder", isDepartmentSpecific: false },
    { name: "Head Elder", isDepartmentSpecific: false },
    { name: "Deacon", isDepartmentSpecific: false },
    { name: "Deaconess", isDepartmentSpecific: false },
    { name: "Church Clerk", isDepartmentSpecific: false },
    { name: "Assistant Clerk", isDepartmentSpecific: false },
    { name: "Treasurer", isDepartmentSpecific: false },
    { name: "Assistant Treasurer", isDepartmentSpecific: false },
    { name: "Department Leader", isDepartmentSpecific: true },
    { name: "Sabbath School Superintendent", isDepartmentSpecific: true },
    { name: "Youth Leader", isDepartmentSpecific: true },
    { name: "Pathfinder Director", isDepartmentSpecific: true },
    { name: "Adventurer Director", isDepartmentSpecific: true },
    { name: "Music Coordinator", isDepartmentSpecific: true },
    { name: "Communication Director", isDepartmentSpecific: true },
  ];

  await db.insert(schema.leadershipPositions).values(
    positions.map((p, i) => ({
      churchId: church.id,
      name: p.name,
      isDepartmentSpecific: p.isDepartmentSpecific,
      sortOrder: i + 1,
    }))
  );

  console.log("Created leadership positions");

  // 8. Sample departments
  const depts = [
    "Sabbath School",
    "Personal Ministries",
    "Adventist Youth",
    "Pathfinders",
    "Adventurers",
    "Women's Ministries",
    "Men's Ministries",
    "Family Ministries",
    "Children's Ministries",
    "Health Ministries",
    "Communication",
    "Education",
    "Stewardship",
    "Music",
    "Prayer Ministries",
  ];

  await db.insert(schema.departments).values(
    depts.map((name) => ({
      churchId: church.id,
      name,
      status: "active",
    }))
  );

  console.log("Created sample departments");

  console.log("\n✅ Seed completed successfully!");
  console.log("Login with: admin@samplechurch.org / admin123");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
