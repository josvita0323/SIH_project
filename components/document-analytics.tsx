"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, AlertTriangle, Clock, FileText, Users, Target } from "lucide-react"

export function DocumentAnalytics() {
  const stats = {
    totalDocuments: 1247,
    thisMonth: 89,
    pendingReview: 23,
    overdueTasks: 7,
    avgProcessingTime: "2.3 minutes",
    complianceRate: 94,
  }

  const documentTypes = [
    { type: "Safety Circulars", count: 456, percentage: 37, trend: "+12%" },
    { type: "Incident Reports", count: 298, percentage: 24, trend: "+8%" },
    { type: "Vendor Invoices", count: 234, percentage: 19, trend: "-3%" },
    { type: "Engineering Drawings", count: 189, percentage: 15, trend: "+15%" },
    { type: "Other", count: 70, percentage: 5, trend: "+2%" },
  ]

  const departmentActivity = [
    { department: "Safety Department", documents: 156, actionItems: 89, completion: 92 },
    { department: "Operations Team", documents: 134, actionItems: 67, completion: 88 },
    { department: "Engineering Team", documents: 98, actionItems: 145, completion: 76 },
    { department: "Maintenance", documents: 87, actionItems: 234, completion: 94 },
    { department: "Procurement", documents: 45, actionItems: 23, completion: 100 },
  ]

  const urgentItems = [
    {
      title: "Brake System Inspection Overdue",
      department: "Maintenance",
      daysOverdue: 3,
      priority: "critical",
    },
    {
      title: "Safety Training Certification Pending",
      department: "Safety Department",
      daysOverdue: 1,
      priority: "high",
    },
    {
      title: "Platform 2 Maintenance Schedule",
      department: "Operations Team",
      daysOverdue: 0,
      priority: "medium",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{stats.totalDocuments.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{stats.thisMonth} this month</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pendingReview}</p>
                <p className="text-xs text-orange-600">Requires attention</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Tasks</p>
                <p className="text-2xl font-bold">{stats.overdueTasks}</p>
                <p className="text-xs text-red-600">Immediate action needed</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">{stats.complianceRate}%</p>
                <p className="text-xs text-green-600">Above target</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Document Types</span>
            </CardTitle>
            <CardDescription>Distribution of document types processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentTypes.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.type}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.trend}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Department Activity</span>
            </CardTitle>
            <CardDescription>Document processing by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentActivity.map((dept, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{dept.department}</h4>
                    <Badge variant={dept.completion >= 90 ? "default" : "secondary"}>{dept.completion}% complete</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">{dept.documents}</span> documents
                    </div>
                    <div>
                      <span className="font-medium">{dept.actionItems}</span> action items
                    </div>
                  </div>
                  <Progress value={dept.completion} className="h-1 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Urgent Items Requiring Attention</span>
          </CardTitle>
          <CardDescription>Critical tasks and overdue items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {urgentItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.department}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {item.daysOverdue > 0 && <Badge variant="destructive">{item.daysOverdue} days overdue</Badge>}
                  <Badge
                    variant={
                      item.priority === "critical" ? "destructive" : item.priority === "high" ? "secondary" : "outline"
                    }
                  >
                    {item.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
