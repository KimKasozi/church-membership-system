import { auth } from "./config";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export function hasRole(userRoles: string[], required: string | string[]): boolean {
  const requiredRoles = Array.isArray(required) ? required : [required];
  return requiredRoles.some((r) => userRoles.includes(r));
}

export function isAdmin(userRoles: string[]): boolean {
  return userRoles.includes("Administrator");
}

export function isClerk(userRoles: string[]): boolean {
  return (
    userRoles.includes("Administrator") ||
    userRoles.includes("Church Clerk") ||
    userRoles.includes("Assistant Clerk")
  );
}
