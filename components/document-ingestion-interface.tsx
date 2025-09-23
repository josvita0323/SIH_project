"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  ImageIcon,
  Mail,
  MessageSquare,
  Cloud,
  Scan,
  CheckCircle,
  Eye,
  Download,
  X,
} from "lucide-react"

interface DocumentIngestionInterfaceProps {
  onBack: () => void
}

export function DocumentIngestionInterface({ onBack }: DocumentIngestionInterfaceProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [processingStage, setProcessingStage] = useState<"idle" | "uploading" | "ocr" | "processing" | "complete">(
    "idle",
  )
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setUploadedFiles((prev) => [...prev, ...files])
      simulateProcessing()
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...files])
      simulateProcessing()
    }
  }

  const simulateProcessing = () => {
    setProcessingStage("uploading")

    // Simulate upload progress
    let progress = 0
    const uploadInterval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(uploadInterval)
        setProcessingStage("ocr")

        // Simulate OCR progress
        let ocrProg = 0
        const ocrInterval = setInterval(() => {
          ocrProg += 15
          setOcrProgress(ocrProg)
          if (ocrProg >= 100) {
            clearInterval(ocrInterval)
            setProcessingStage("processing")

            // Simulate AI processing
            setTimeout(() => {
              setProcessingStage("complete")
            }, 2000)
          }
        }, 300)
      }
    }, 200)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon className="w-8 h-8 text-blue-500" />
      default:
        return <FileText className="w-8 h-8 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Ingestion</h1>
            <p className="text-gray-600 mt-2">Upload and process documents with AI-powered analysis</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">File Upload</TabsTrigger>
            <TabsTrigger value="channels">Input Channels</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* File Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                  Drag and drop files or click to browse. Supports PDF, images, and scanned documents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drop files here or click to upload</h3>
                  <p className="text-gray-600 mb-4">Supports PDF, JPG, PNG, and other document formats</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose Files
                    </label>
                  </Button>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Uploaded Files ({uploadedFiles.length})</h4>
                    <div className="space-y-3">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                          {getFileIcon(file.name)}
                          <div className="flex-1">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <Badge variant="outline">Ready</Badge>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadata Form */}
            <Card>
              <CardHeader>
                <CardTitle>Document Metadata</CardTitle>
                <CardDescription>Provide additional context for better AI processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doc-type">Document Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="safety-circular">Safety Circular</SelectItem>
                        <SelectItem value="incident-report">Incident Report</SelectItem>
                        <SelectItem value="vendor-invoice">Vendor Invoice</SelectItem>
                        <SelectItem value="engineering-drawing">Engineering Drawing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="source">Source</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="upload">Direct Upload</SelectItem>
                        <SelectItem value="cloud">Cloud Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="sender">Sender/Department</Label>
                  <Input placeholder="e.g., Safety Department, Station Master" />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea placeholder="Any additional context or special instructions..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Email Integration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Email Integration</CardTitle>
                      <CardDescription>Connect email accounts</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Automatically process attachments from configured email accounts.
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">safety@kmrl.gov.in</span>
                      <Badge variant="outline" className="text-green-600">
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">operations@kmrl.gov.in</span>
                      <Badge variant="outline" className="text-green-600">
                        Connected
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Add Email Account
                  </Button>
                </CardContent>
              </Card>

              {/* WhatsApp Integration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>WhatsApp Business</CardTitle>
                      <CardDescription>Process shared documents</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Automatically process documents shared in WhatsApp groups.
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">KMRL Safety Team</span>
                      <Badge variant="outline" className="text-green-600">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Maintenance Group</span>
                      <Badge variant="outline" className="text-gray-600">
                        Pending
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Configure WhatsApp
                  </Button>
                </CardContent>
              </Card>

              {/* Cloud Storage */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Cloud className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>Cloud Storage</CardTitle>
                      <CardDescription>Connect cloud drives</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">Monitor folders in cloud storage for new documents.</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">SharePoint</span>
                      <Badge variant="outline" className="text-gray-600">
                        Not Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Google Drive</span>
                      <Badge variant="outline" className="text-gray-600">
                        Not Connected
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Connect Cloud Storage
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            {/* Processing Status */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Pipeline</CardTitle>
                <CardDescription>Real-time status of document processing stages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Stage */}
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      processingStage === "uploading"
                        ? "bg-blue-100"
                        : ["ocr", "processing", "complete"].includes(processingStage)
                          ? "bg-green-100"
                          : "bg-gray-100"
                    }`}
                  >
                    {["ocr", "processing", "complete"].includes(processingStage) ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Upload
                        className={`w-5 h-5 ${processingStage === "uploading" ? "text-blue-600" : "text-gray-400"}`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">File Upload</h4>
                    <p className="text-sm text-gray-600">Uploading documents to secure storage</p>
                    {processingStage === "uploading" && <Progress value={uploadProgress} className="mt-2" />}
                  </div>
                </div>

                {/* OCR Stage */}
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      processingStage === "ocr"
                        ? "bg-blue-100"
                        : ["processing", "complete"].includes(processingStage)
                          ? "bg-green-100"
                          : "bg-gray-100"
                    }`}
                  >
                    {["processing", "complete"].includes(processingStage) ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Scan className={`w-5 h-5 ${processingStage === "ocr" ? "text-blue-600" : "text-gray-400"}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">OCR Processing</h4>
                    <p className="text-sm text-gray-600">Extracting text from images and PDFs (English + Malayalam)</p>
                    {processingStage === "ocr" && <Progress value={ocrProgress} className="mt-2" />}
                  </div>
                </div>

                {/* AI Processing Stage */}
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      processingStage === "processing"
                        ? "bg-blue-100"
                        : processingStage === "complete"
                          ? "bg-green-100"
                          : "bg-gray-100"
                    }`}
                  >
                    {processingStage === "complete" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <FileText
                        className={`w-5 h-5 ${processingStage === "processing" ? "text-blue-600" : "text-gray-400"}`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">AI Analysis</h4>
                    <p className="text-sm text-gray-600">Classification, summarization, and action item extraction</p>
                    {processingStage === "processing" && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Analyzing content...</span>
                          <span>Processing</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Results Preview */}
            {processingStage === "complete" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Processing Complete</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <p className="text-sm text-gray-600">OCR Accuracy</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">3</div>
                      <p className="text-sm text-gray-600">Action Items Found</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">95%</div>
                      <p className="text-sm text-gray-600">Classification Confidence</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4">View Processed Documents</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Processing Results</CardTitle>
                <CardDescription>AI-generated insights and extracted information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mock processed document */}
                <div className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Safety Circular - Brake Inspection Protocol</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className="bg-green-100 text-green-800">Safety Circular</Badge>
                        <Badge variant="outline">High Confidence (95%)</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">AI Summary</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        New brake inspection protocol requires immediate implementation across all trains. All
                        technicians must complete certification by January 25th. Failure to comply may result in service
                        suspension. Updated safety procedures include enhanced visual inspections and digital logging
                        requirements.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Extracted Action Items</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="text-sm font-medium">Complete brake inspection certification</p>
                            <p className="text-xs text-gray-600">Assigned to: All Technicians | Due: Jan 25, 2024</p>
                          </div>
                          <Badge variant="destructive">High Priority</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="text-sm font-medium">Update inspection checklists</p>
                            <p className="text-xs text-gray-600">Assigned to: Safety Team | Due: Jan 20, 2024</p>
                          </div>
                          <Badge variant="secondary">Medium Priority</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Metadata</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Source:</span>
                          <span className="ml-2">Email (safety@kmrl.gov.in)</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Processed:</span>
                          <span className="ml-2">{new Date().toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Language:</span>
                          <span className="ml-2">English</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pages:</span>
                          <span className="ml-2">3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
