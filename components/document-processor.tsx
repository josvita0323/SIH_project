"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Eye, Download, AlertTriangle, CheckCircle, Clock, User } from "lucide-react"
import type { Document, ActionItem } from "@/types/document"

interface DocumentProcessorProps {
  document: Document
  onActionUpdate?: (actionId: string, status: string) => void
}

export function DocumentProcessor({ document, onActionUpdate }: DocumentProcessorProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  // Mock processed data
  const mockSummary =
    "This safety circular outlines new brake inspection protocols for all metro trains. Key requirements include daily visual inspections, weekly detailed checks, and monthly comprehensive assessments. All maintenance staff must complete certification by January 30th, 2024."

  const mockActionItems: ActionItem[] = [
    {
      id: "1",
      description: "Complete brake inspection certification training",
      assignee: "All Maintenance Staff",
      deadline: "2024-01-30",
      priority: "high",
      status: "pending",
      sourceLocation: {
        page: 1,
        line: 15,
        text: "All maintenance personnel must complete the updated brake inspection certification...",
      },
    },
    {
      id: "2",
      description: "Implement daily visual brake inspections",
      assignee: "Maintenance Team A",
      deadline: "2024-01-25",
      priority: "high",
      status: "in-progress",
      sourceLocation: {
        page: 2,
        line: 8,
        text: "Daily visual inspections must be conducted on all operational trains...",
      },
    },
    {
      id: "3",
      description: "Update maintenance logs with new inspection criteria",
      assignee: "Documentation Team",
      deadline: "2024-02-01",
      priority: "medium",
      status: "pending",
      sourceLocation: {
        page: 3,
        line: 22,
        text: "Maintenance logs should reflect the updated inspection criteria...",
      },
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-orange-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{document.title}</span>
              </CardTitle>
              <CardDescription className="mt-2">
                {document.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} • Uploaded{" "}
                {new Date(document.uploadedAt).toLocaleDateString()} •
                {document.source.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusColor(document.status)}>{document.status}</Badge>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Original
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Summary */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Summary</CardTitle>
            <CardDescription>Key points extracted from the document</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{mockSummary}</p>
            <Separator className="my-4" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Processing confidence: 94%</span>
              <span>Language: English</span>
            </div>
          </CardContent>
        </Card>

        {/* Document Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Document Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">File Name:</span>
              <span className="text-sm">{document.fileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">File Size:</span>
              <span className="text-sm">{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Type:</span>
              <span className="text-sm">{document.mimeType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Uploaded By:</span>
              <span className="text-sm">{document.uploadedBy}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Processing Time:</span>
              <span className="text-sm">2.3 seconds</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Extracted Action Items</CardTitle>
          <CardDescription>Tasks and deadlines identified in the document</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActionItems.map((action) => (
              <div
                key={action.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAction === action.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedAction(selectedAction === action.id ? null : action.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{action.description}</h4>
                      <Badge variant={getStatusColor(action.status)}>{action.status.replace("-", " ")}</Badge>
                      <Badge variant="outline" className={getPriorityColor(action.priority)}>
                        {action.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {action.assignee}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Due: {new Date(action.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {action.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {action.priority === "high" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  </div>
                </div>

                {selectedAction === action.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="bg-muted/50 p-3 rounded text-sm">
                      <p className="font-medium mb-1">Source Reference:</p>
                      <p className="text-muted-foreground">
                        Page {action.sourceLocation.page}, Line {action.sourceLocation.line}
                      </p>
                      <p className="mt-2 italic">"{action.sourceLocation.text}"</p>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        Assign to Team
                      </Button>
                      <Button size="sm" variant="outline">
                        Set Reminder
                      </Button>
                      <Button size="sm" variant="outline">
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
