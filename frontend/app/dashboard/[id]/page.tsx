"use client";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftCircle,
  Home,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
  FileText,
  Calendar as CalendarIcon,
} from "lucide-react";
import { SimpleUpload } from "@/components/simple-upload";
import { InboxList } from "@/components/inbox-list";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

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

const ROLE_SPECIFIC_DATA: Record<
  RoleKey,
  {
    checklist: Array<{
      task: string;
      completed: boolean;
      priority: "high" | "medium" | "low";
    }>;
    metrics: Array<{
      label: string;
      value: string;
      trend: "up" | "down" | "stable";
    }>;
    recentActivities: Array<{ activity: string; time: string }>;
  }
> = {
  "rolling-stock-manager": {
    checklist: [
      {
        task: "Daily fleet inspection report",
        completed: true,
        priority: "high",
      },
      {
        task: "Maintenance schedule review",
        completed: false,
        priority: "high",
      },
      { task: "Parts inventory check", completed: true, priority: "medium" },
      { task: "Staff roster verification", completed: false, priority: "low" },
    ],
    metrics: [
      { label: "Fleet Availability", value: "94%", trend: "up" },
      { label: "Maintenance Backlog", value: "12", trend: "down" },
      { label: "On-time Performance", value: "96.8%", trend: "stable" },
    ],
    recentActivities: [
      { activity: "Completed inspection of Train #15", time: "2 hours ago" },
      { activity: "Scheduled brake system maintenance", time: "4 hours ago" },
      { activity: "Updated parts inventory", time: "6 hours ago" },
    ],
  },
  "procurement-officer": {
    checklist: [
      {
        task: "Review pending purchase orders",
        completed: false,
        priority: "high",
      },
      { task: "Vendor compliance audit", completed: true, priority: "medium" },
      {
        task: "Contract renewal preparations",
        completed: false,
        priority: "medium",
      },
      { task: "Budget variance analysis", completed: true, priority: "low" },
    ],
    metrics: [
      { label: "Pending POs", value: "28", trend: "down" },
      { label: "Budget Utilization", value: "73%", trend: "up" },
      { label: "Vendor Rating Avg", value: "4.2/5", trend: "stable" },
    ],
    recentActivities: [
      { activity: "Approved purchase order #PO-2024-156", time: "1 hour ago" },
      { activity: "Vendor meeting scheduled", time: "3 hours ago" },
      { activity: "Contract amendment reviewed", time: "5 hours ago" },
    ],
  },
  "hr-safety-coordinator": {
    checklist: [
      {
        task: "Safety training completion tracking",
        completed: false,
        priority: "high",
      },
      { task: "Incident report review", completed: true, priority: "high" },
      {
        task: "Employee handbook updates",
        completed: false,
        priority: "medium",
      },
      {
        task: "Performance review schedules",
        completed: true,
        priority: "low",
      },
    ],
    metrics: [
      { label: "Training Completion", value: "87%", trend: "up" },
      { label: "Safety Incidents", value: "2", trend: "down" },
      { label: "Employee Satisfaction", value: "4.1/5", trend: "stable" },
    ],
    recentActivities: [
      {
        activity: "Conducted safety briefing for Station A",
        time: "2 hours ago",
      },
      { activity: "Updated emergency procedures", time: "4 hours ago" },
      { activity: "Reviewed training records", time: "6 hours ago" },
    ],
  },
  "executive-director": {
    checklist: [
      { task: "Board meeting preparation", completed: false, priority: "high" },
      {
        task: "Quarterly performance review",
        completed: true,
        priority: "high",
      },
      { task: "Strategic plan updates", completed: false, priority: "medium" },
      {
        task: "Stakeholder communication",
        completed: true,
        priority: "medium",
      },
    ],
    metrics: [
      { label: "Overall Performance", value: "92%", trend: "up" },
      { label: "Revenue Growth", value: "+8.5%", trend: "up" },
      { label: "Customer Satisfaction", value: "4.3/5", trend: "stable" },
    ],
    recentActivities: [
      { activity: "Approved budget allocation", time: "1 hour ago" },
      { activity: "Met with government officials", time: "5 hours ago" },
      { activity: "Reviewed expansion proposal", time: "1 day ago" },
    ],
  },
};

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as RoleKey;
  const config = DASHBOARD_CONFIG[id];
  const user_id = ROLE_USER_MAP[id];
  const roleData = ROLE_SPECIFIC_DATA[id];
  const [date, setDate] = useState<Date | undefined>(new Date());

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
            <Button
              variant="ghost"
              size="icon"
              aria-label="Home"
              onClick={() => router.push("/")}
            >
              <Home className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-8">
        <div className="gap-6 mb-8 w-full flex">
          <SimpleUpload user_id={user_id} />

          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border-0"
          />
        </div>

        <InboxList role={config.inboxRole as RoleKey} />

        {/* Checklist Section */}
        <Card className="my-8">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Today's Checklist</h3>
            </div>
            <div className="space-y-3">
              {roleData.checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    readOnly
                    className="rounded"
                  />
                  <span
                    className={`flex-1 ${
                      item.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.task}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      item.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : item.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Metrics Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roleData.metrics.map((metric, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    metric.trend === "up"
                      ? "bg-green-100 text-green-600"
                      : metric.trend === "down"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activities and Team Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Recent Activities</h3>
            </div>
            <div className="space-y-3">
              {roleData.recentActivities.map((activity, index) => (
                <div key={index} className="flex justify-between items-start">
                  <p className="text-sm flex-1">{activity.activity}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Team Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">On Duty</span>
                <span className="font-semibold text-green-600">24/28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">On Leave</span>
                <span className="font-semibold text-yellow-600">3/28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Training</span>
                <span className="font-semibold text-blue-600">1/28</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                85% operational capacity
              </p>
            </div>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold">System Alerts</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">
                  Scheduled maintenance for Platform 2 at 10:00 PM
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">
                  Weather advisory: Light rain expected during evening hours
                </span>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
