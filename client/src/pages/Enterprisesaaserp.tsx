import { Building2 } from "lucide-react";
import SolutionPage from "./SolutionPage";

export default function EnterpriseSaasErp() {
  return (
    <SolutionPage
      tagline="Enterprise SaaS & ERP"
      title="Enterprise SaaS & ERP Development"
      description="End-to-end design and development of multi-tenant SaaS platforms — including STARK AI Costing, a full ERP system for restaurant and F&B operations covering procurement, inventory, finance, and governance, built on FastAPI, PostgreSQL, and React/TypeScript."
      stack={["FastAPI", "PostgreSQL", "React", "TypeScript", "JWT Auth"]}
      features={[
        "Multi-tenant architecture with strict company-level data isolation",
        "Role-based access control across owner, admin, manager, accountant, and clerk tiers",
        "Procurement workflows: purchase orders, cash purchases, supplier price governance",
        "Finance module: P&L reporting, budget vs. actual, cost trend and variance analysis",
        "Full audit logging and approval-routing across all system modules",
      ]}
      process={[
        {
          title: "Data model & isolation",
          description:
            "Every table is scoped by company_id to guarantee tenant isolation, with JWT-based auth and a global 401 interceptor handling session state.",
        },
        {
          title: "Core workflows",
          description:
            "Procurement, inventory, and finance modules built around a single source of truth — inventory movements drive stock balances.",
        },
        {
          title: "Governance & approvals",
          description:
            "Price changes and purchase approvals route through a dedicated governance workflow before affecting live records.",
        },
      ]}
      highlightCard={{
        icon: Building2,
        heading: "Built for real operations",
        text: "Every module ships to solve an actual restaurant/F&B workflow, not a demo feature.",
      }}
      highlights={[
        { value: "5", label: "Core modules" },
        { value: "5", label: "Role tiers" },
        { value: "Solo", label: "Built end to end" },
        { value: "Live", label: "In active development" },
      ]}
    />
  );
}