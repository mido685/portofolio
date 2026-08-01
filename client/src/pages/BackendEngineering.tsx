import { Server } from "lucide-react";
import SolutionPage from "./SolutionPage";

export default function BackendEngineering() {
  return (
    <SolutionPage
      tagline="Backend Engineering"
      title="Backend Engineering for Multi-Tenant SaaS"
      description="Production backend patterns built for STARK AI Costing — a multi-tenant ERP handling strict data isolation, role-based access, full audit trails, and financial period controls at the database and API layer."
      stack={["FastAPI", "PostgreSQL", "JWT", "Cloudflare Tunnel"]}
      features={[
        "Multi-tenant data isolation enforced via company_id across every table",
        "JWT authentication with a global 401 interceptor and centralized auth context",
        "Full audit_log instrumentation across all routers, plus a dedicated system_logs event pipeline",
        "Period management (open/close/lock) enforced at the endpoint level via is_period_frozen",
        "Role-based access control across five tiers: owner, admin, manager, accountant, clerk",
      ]}
      process={[
        {
          title: "Isolation-first data model",
          description:
            "Every table carries company_id, and every query is scoped by it — tenant isolation is enforced at the data layer.",
        },
        {
          title: "Auditability by default",
          description:
            "A log_event function is wired across every module, so every write is traceable before commit.",
        },
        {
          title: "Governance & control gates",
          description:
            "Approval routing and period-locking sit at the endpoint level to prevent bypassing governance once a period is closed.",
        },
      ]}
      highlightCard={{
        icon: Server,
        heading: "Isolation by default",
        text: "Tenant isolation and audit logging are enforced at the data layer, not bolted on later.",
      }}
      highlights={[
        { value: "company_id", label: "Isolation on every table" },
        { value: "5", label: "Role tiers enforced" },
        { value: "10+", label: "Modules with audit logging" },
        { value: "Solo-built", label: "Backend, API, and auth" },
      ]}
    />
  );
}