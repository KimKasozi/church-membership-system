import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      churchId: string;
      roles: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    churchId: string;
    roles: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    churchId: string;
    roles: string[];
  }
}
