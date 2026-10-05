import { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login | Church Membership System",
  description: "Sign in to the Church Membership & Secretariat Management System",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Church Membership System
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to manage membership and secretariat records
          </p>
        </div>
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
