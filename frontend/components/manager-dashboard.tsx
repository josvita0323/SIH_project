"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  LogOut,
  Bell,
  Users,
  BarChart3,
  Search,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function ManagerDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const stats = [
    {
      title: "Total Documents",
      value: "1,247",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Pending Reviews",
      value: "23",
      change: "-5%",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Safety Alerts",
      value: "3",
      change: "+2",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Completed Tasks",
      value: "156",
      change: "+8%",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  const recentDocuments = [
    {
      id: 1,
      title: "Safety Circular - Brake Inspection Protocol",
      type: "Safety Circular",
      status: "urgent",
      deadline: "2024-01-25",
      assignee: "Maintenance Team A",
    },
    {
      id: 2,
      title: "Incident Report - Platform 3 Minor Delay",
      type: "Incident Report",
      status: "review",
      deadline: "2024-01-28",
      assignee: "Operations Team",
    },
    {
      id: 3,
      title: "Vendor Invoice - Track Maintenance Equipment",
      type: "Vendor Invoice",
      status: "approved",
      deadline: "2024-01-30",
      assignee: "Procurement",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">KMRL Manager Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-muted-foreground">{user?.department}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Documents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Latest documents requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{doc.title}</h4>
                      <p className="text-sm text-muted-foreground">{doc.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">Assigned to: {doc.assignee}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          doc.status === "urgent" ? "destructive" : doc.status === "review" ? "secondary" : "default"
                        }
                      >
                        {doc.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">Due: {doc.deadline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => router.push("/upload")}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/documents")}
              >
                <Search className="h-4 w-4 mr-2" />
                Search Documents
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/documents")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="h-4 w-4 mr-2" />
                Manage Teams
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
