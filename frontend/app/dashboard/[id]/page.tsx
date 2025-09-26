"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import { SimpleUpload } from "@/components/simple-upload";
import { InboxList } from "@/components/inbox-list";

const DASHBOARD_CONFIG: Record<
  string,
  { title: string; subtitle: string; inboxRole: string; quickInfo: string }
> = {
  "rolling-stock-manager": {
    title: "KMRL Task Management",
    subtitle: "Frontline Operations Manager (Rolling Stock)",
    inboxRole: "rolling-stock-manager",
    quickInfo:
      "Use the Upload card to add PDFs. Your routed notices will appear below in the Inbox.",
  },
  "procurement-officer": {
    title: "KMRL Procurement",
    subtitle: "Procurement Officer",
    inboxRole: "procurement-officer",
    quickInfo:
      "Upload vendor PDFs here. Invoices and contract notices will appear in your Inbox.",
  },
  "hr-safety-coordinator": {
    title: "KMRL Safety & HR",
    subtitle: "HR & Safety Coordinator",
    inboxRole: "hr-safety-coordinator",
    quickInfo:
      "Upload circulars or training PDFs. Routed safety notices appear below in the Inbox.",
  },
  "executive-director": {
    title: "KMRL Executive",
    subtitle: "Executive Director",
    inboxRole: "executive-director",
    quickInfo:
      "Upload board/summary PDFs. Org-wide notices for you appear below in Inbox.",
  },
};

type RoleKey =
  | "rolling-stock-manager"
  | "procurement-officer"
  | "hr-safety-coordinator"
  | "executive-director";

const ROLE_USER_MAP: Record<RoleKey, number> = {
  "rolling-stock-manager": 1,
  "procurement-officer": 2,
  "hr-safety-coordinator": 3,
  "executive-director": 4,
};

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as RoleKey;

  const config = DASHBOARD_CONFIG[id];
  const user_id = ROLE_USER_MAP[id];

  if (!config) {
    return <div className="p-6">Invalid dashboard role</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg text-white flex items-center justify-center font-bold">
              KM
            </div>
            <div>
              <h1 className="text-xl font-bold">{config.title}</h1>
              <p className="text-sm text-muted-foreground">{config.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/selector")}
            >
              <ArrowLeftCircle className="w-4 h-4 mr-2" />
              Role Selector
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SimpleUpload user_id={user_id} />
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Quick Info</h3>
            <p className="text-sm text-muted-foreground">{config.quickInfo}</p>
          </Card>
        </div>
        <InboxList role={config.inboxRole as RoleKey} />
      </section>
    </main>
  );
}
