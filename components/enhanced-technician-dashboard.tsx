"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle,
  CalendarIcon,
  FileText,
  Bell,
  Settings,
  LogOut,
  ExternalLink,
  Play,
  Pause,
  Square,
} from "lucide-react"
import { mockDocuments, mockCalendarEvents, mockUsers } from "@/lib/mock-data"

interface EnhancedTechnicianDashboardProps {
  onLogout: () => void
}

export function EnhancedTechnicianDashboard({ onLogout }: EnhancedTechnicianDashboardProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [activeTask, setActiveTask] = useState<string | null>(null)

  const user = mockUsers.technician
  const allActionItems = mockDocuments.flatMap((doc) => doc.actionItems)
  const myTasks = allActionItems.filter(
    (item) => item.assignee.toLowerCase().includes("technician") || item.assignee.toLowerCase().includes("all"),
  )
  const urgentTasks = myTasks.filter((item) => item.priority === "high")
  const todayEvents = mockCalendarEvents.filter(
    (event) => new Date(event.date).toDateString() === new Date().toDateString(),
  )

  const toggleTaskCompletion = (taskId: string) => {
    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId)
    } else {
      newCompleted.add(taskId)
    }
    setCompletedTasks(newCompleted)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTaskProgress = () => {
    return Math.round((completedTasks.size / myTasks.length) * 100)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">KMRL Task Management</h1>
              <p className="text-sm text-gray-600">Technician Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-gray-600">{user.department}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myTasks.length}</div>
              <p className="text-xs text-muted-foreground">{completedTasks.size} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Tasks</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{urgentTasks.length}</div>
              <p className="text-xs text-muted-foreground">High priority</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayEvents.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTaskProgress()}%</div>
              <Progress value={getTaskProgress()} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Active Task */}
            {activeTask && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-blue-900">Active Task</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveTask(null)}>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setActiveTask(null)}>
                        <Square className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const task = myTasks.find((t) => t.id === activeTask)
                    return task ? (
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">{task.task}</h4>
                        <p className="text-sm text-blue-700 mb-2">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-blue-600">Source: {task.sourceLocation}</p>
                      </div>
                    ) : null
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Task List */}
            <Card>
              <CardHeader>
                <CardTitle>Task Checklist</CardTitle>
                <CardDescription>Complete your assigned tasks and track progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 border rounded-lg ${
                        completedTasks.has(task.id) ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          checked={completedTasks.has(task.id)}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                              <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                                {task.priority}
                              </Badge>
                              <Badge variant="outline">{task.status}</Badge>
                            </div>
                            {!completedTasks.has(task.id) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveTask(task.id)}
                                disabled={activeTask === task.id}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                {activeTask === task.id ? "Active" : "Start"}
                              </Button>
                            )}
                          </div>

                          <h4
                            className={`font-medium mb-2 ${
                              completedTasks.has(task.id) ? "line-through text-gray-500" : ""
                            }`}
                          >
                            {task.task}
                          </h4>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Due: {new Date(task.deadline).toLocaleDateString()}</p>
                            <p>Source: {task.sourceLocation}</p>
                          </div>

                          <div className="flex items-center space-x-2 mt-3">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Document
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Instructions
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`w-4 h-4 rounded-full mt-1 ${getPriorityColor(event.priority)}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{event.time}</p>
                        <p className="text-sm text-gray-500 mt-1">{event.relatedDocuments.length} related documents</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myTasks
                    .filter((task) => !completedTasks.has(task.id))
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .slice(0, 5)
                    .map((task) => (
                      <div key={task.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{task.task}</h4>
                          <p className="text-xs text-gray-600">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>{task.priority}</Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Related Documents</CardTitle>
                <CardDescription>Documents containing your assigned tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDocuments
                    .filter((doc) =>
                      doc.actionItems.some(
                        (item) =>
                          item.assignee.toLowerCase().includes("technician") ||
                          item.assignee.toLowerCase().includes("all"),
                      ),
                    )
                    .map((doc) => (
                      <div key={doc.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{doc.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{doc.summary}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{doc.source}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {
                                doc.actionItems.filter(
                                  (item) =>
                                    item.assignee.toLowerCase().includes("technician") ||
                                    item.assignee.toLowerCase().includes("all"),
                                ).length
                              }{" "}
                              tasks for you
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Document
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
