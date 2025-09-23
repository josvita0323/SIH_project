"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Wrench, AlertTriangle, CheckCircle, Clock, Upload, LogOut, Bell, FileText, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function TechnicianDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const myTasks = [
    {
      id: 1,
      title: "Inspect brakes on Train 123",
      description: "Complete brake system inspection as per safety circular SC-2024-001",
      priority: "high",
      deadline: "2024-01-25",
      status: "pending",
      completed: false,
    },
    {
      id: 2,
      title: "Update maintenance log for Platform 2",
      description: "Record cleaning and maintenance activities performed",
      priority: "medium",
      deadline: "2024-01-26",
      status: "in-progress",
      completed: false,
    },
    {
      id: 3,
      title: "Submit incident report for minor delay",
      description: "Document the 5-minute delay incident from yesterday",
      priority: "medium",
      deadline: "2024-01-27",
      status: "pending",
      completed: false,
    },
  ]

  const recentDocuments = [
    {
      id: 1,
      title: "Safety Circular - Brake Inspection Protocol",
      type: "Safety Circular",
      date: "2024-01-20",
      status: "new",
    },
    {
      id: 2,
      title: "Maintenance Manual Update - Track Systems",
      type: "Manual",
      date: "2024-01-18",
      status: "read",
    },
    {
      id: 3,
      title: "Emergency Procedures - Platform Safety",
      type: "Procedure",
      date: "2024-01-15",
      status: "read",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">KMRL Technician Dashboard</h1>
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Tasks */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Tasks assigned to you that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <div key={task.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox checked={task.completed} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">Due: {task.deadline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Documents & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" onClick={() => router.push("/upload")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Report
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Wrench className="h-4 w-4 mr-2" />
                  Log Maintenance
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/documents")}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Documents
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  View Documents
                </Button>
              </CardContent>
            </Card>

            {/* Recent Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">{doc.title}</h5>
                        <Badge variant={doc.status === "new" ? "default" : "secondary"}>{doc.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {doc.type} • {doc.date}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
