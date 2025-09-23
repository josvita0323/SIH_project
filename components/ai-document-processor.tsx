"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, FileText, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react"

interface AIProcessingResult {
  documentType: string
  title: string
  summary: string
  language: string
  actionItems: Array<{
    description: string
    assignee: string
    deadline?: string
    priority: string
    sourceLocation: {
      page: number
      context: string
    }
  }>
  keyInformation: {
    departments: string[]
    equipment: string[]
    locations: string[]
    regulations: string[]
    deadlines: string[]
  }
  urgencyLevel: string
  complianceRequired: boolean
}

interface AIDocumentProcessorProps {
  file: File
  onProcessingComplete?: (result: AIProcessingResult) => void
}

export function AIDocumentProcessor({ file, onProcessingComplete }: AIDocumentProcessorProps) {
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AIProcessingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processDocument = async () => {
    setProcessing(true)
    setProgress(0)
    setError(null)

    try {
      // Convert file to base64
      const fileData = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      // Simulate processing steps
      const steps = [
        { name: "OCR Processing", duration: 2000 },
        { name: "Language Detection", duration: 1000 },
        { name: "Content Classification", duration: 1500 },
        { name: "Action Item Extraction", duration: 2000 },
        { name: "Summary Generation", duration: 1500 },
      ]

      let currentProgress = 0
      for (const step of steps) {
        setProgress(currentProgress)
        await new Promise((resolve) => setTimeout(resolve, step.duration))
        currentProgress += 100 / steps.length
      }
      setProgress(100)

      // Call AI processing API
      const response = await fetch("/api/process-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: {
            data: fileData.split(",")[1], // Remove data URL prefix
            mediaType: file.type,
            filename: file.name,
          },
          documentMetadata: {
            source: "upload",
            uploadedAt: new Date().toISOString(),
            fileSize: file.size,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Processing failed")
      }

      const data = await response.json()
      setResult(data.extractedData)
      onProcessingComplete?.(data.extractedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed")
    } finally {
      setProcessing(false)
    }
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "immediate":
        return "text-red-600 bg-red-50"
      case "urgent":
        return "text-orange-600 bg-orange-50"
      case "normal":
        return "text-blue-600 bg-blue-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "medium":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Processing Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AI Document Processing</span>
          </CardTitle>
          <CardDescription>
            Advanced AI analysis for {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!processing && !result && (
            <Button onClick={processDocument} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Start AI Processing
            </Button>
          )}

          {processing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing document...</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Using advanced OCR and NLP to extract structured information
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={processDocument} className="mt-2 bg-transparent">
                Retry Processing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Results */}
      {result && (
        <div className="space-y-6">
          {/* Document Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Document Analysis Results</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{result.documentType.replace("-", " ")}</Badge>
                <Badge variant="outline">{result.language}</Badge>
                <Badge className={getUrgencyColor(result.urgencyLevel)}>{result.urgencyLevel}</Badge>
                {result.complianceRequired && <Badge variant="secondary">Compliance Required</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">{result.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Extracted Action Items ({result.actionItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.actionItems.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(item.priority)}
                        <h4 className="font-medium">{item.description}</h4>
                      </div>
                      <Badge variant={item.priority === "high" ? "destructive" : "secondary"}>{item.priority}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <strong>Assignee:</strong> {item.assignee}
                      </p>
                      {item.deadline && (
                        <p>
                          <strong>Deadline:</strong> {item.deadline}
                        </p>
                      )}
                      <p>
                        <strong>Source:</strong> Page {item.sourceLocation.page}
                      </p>
                      <p className="italic">"{item.sourceLocation.context}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Departments & Equipment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Departments</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.keyInformation.departments.map((dept, index) => (
                      <Badge key={index} variant="outline">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Equipment</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.keyInformation.equipment.map((equip, index) => (
                      <Badge key={index} variant="outline">
                        {equip}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Locations & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Locations</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.keyInformation.locations.map((loc, index) => (
                      <Badge key={index} variant="outline">
                        {loc}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Regulations</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.keyInformation.regulations.map((reg, index) => (
                      <Badge key={index} variant="outline">
                        {reg}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
