"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  AlertTriangle,
  TrendingUp,
  CalendarIcon,
  Search,
  Filter,
  Upload,
  Bell,
  Settings,
  LogOut,
  Eye,
  ExternalLink,
} from "lucide-react"
import { mockDocuments, mockCalendarEvents, mockUsers, type Document, type CalendarEvent } from "@/lib/mock-data"

interface EnhancedManagerDashboardProps {
  onLogout: () => void
}

export function EnhancedManagerDashboard({ onLogout }: EnhancedManagerDashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const user = mockUsers.manager
  const urgentDocs = mockDocuments.filter((doc) => doc.status === "urgent")
  const todayEvents = mockCalendarEvents.filter(
    (event) => new Date(event.date).toDateString() === new Date().toDateString(),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "compliance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">KMRL Document Management</h1>
              <p className="text-sm text-gray-600">Manager Dashboard</p>
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
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDocuments.length}</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{urgentDocs.length}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayEvents.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">AI accuracy score</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Documents */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Documents
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockDocuments.slice(0, 3).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium truncate">{doc.title}</h4>
                          <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{doc.summary}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span>{doc.source}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{doc.actionItems.length} action items</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Today's Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={`w-3 h-3 rounded-full mt-2 ${getPriorityColor(event.priority)}`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <p className="text-xs text-gray-600">{event.time}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.relatedDocuments.length} related documents</p>
                      </div>
                    </div>
                  ))}

                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Action Items Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Action Items Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockDocuments
                    .flatMap((doc) => doc.actionItems)
                    .slice(0, 3)
                    .map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={item.priority === "high" ? "destructive" : "secondary"}>
                            {item.priority}
                          </Badge>
                          <Badge variant="outline">{item.status}</Badge>
                        </div>
                        <h4 className="font-medium mb-2">{item.task}</h4>
                        <p className="text-sm text-gray-600 mb-2">Assigned to: {item.assignee}</p>
                        <p className="text-sm text-gray-600">Due: {new Date(item.deadline).toLocaleDateString()}</p>
                        <Button variant="outline" size="sm" className="mt-3 w-full bg-transparent">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Source
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Document Library</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{doc.title}</h4>
                          <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{doc.summary}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Confidence: {Math.round(doc.confidence * 100)}%</span>
                          <span className="mx-2">•</span>
                          <span>{doc.actionItems.length} action items</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Calendar Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCalendarEvents.map((event) => (
                      <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className={`w-4 h-4 rounded-full mt-1 ${getPriorityColor(event.priority)}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge variant="outline">{event.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {event.relatedDocuments.length} related documents
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calendar View</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Processing Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Safety Circulars</span>
                      <span>40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Incident Reports</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Vendor Invoices</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Engineering Drawings</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                    <p className="text-sm text-gray-600">Overall Accuracy</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold">98%</div>
                      <p className="text-xs text-gray-600">Classification</p>
                    </div>
                    <div>
                      <div className="text-xl font-bold">92%</div>
                      <p className="text-xs text-gray-600">Summarization</p>
                    </div>
                    <div>
                      <div className="text-xl font-bold">89%</div>
                      <p className="text-xs text-gray-600">Action Items</p>
                    </div>
                    <div>
                      <div className="text-xl font-bold">96%</div>
                      <p className="text-xs text-gray-600">OCR Accuracy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedDocument.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(selectedDocument.status)}>{selectedDocument.status}</Badge>
                <Badge variant="outline">{selectedDocument.type}</Badge>
                <span className="text-sm text-gray-600">
                  Confidence: {Math.round(selectedDocument.confidence * 100)}%
                </span>
              </div>

              <div>
                <h4 className="font-medium mb-2">Summary</h4>
                <p className="text-sm text-gray-600">{selectedDocument.summary}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Action Items</h4>
                <div className="space-y-2">
                  {selectedDocument.actionItems.map((item) => (
                    <div key={item.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant={item.priority === "high" ? "destructive" : "secondary"}>{item.priority}</Badge>
                        <Badge variant="outline">{item.status}</Badge>
                      </div>
                      <p className="text-sm font-medium">{item.task}</p>
                      <p className="text-xs text-gray-600">
                        Assigned to: {item.assignee} | Due: {new Date(item.deadline).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Source: {item.sourceLocation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
