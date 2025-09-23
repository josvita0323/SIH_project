"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  Link,
  Mail,
  MessageSquare,
  Cloud,
  FileText,
  Camera,
  Mic,
} from "lucide-react"
import type { UploadProgress } from "@/types/document"

interface EnhancedDocumentUploadProps {
  onUploadComplete?: (documents: any[]) => void
  maxFiles?: number
}

export function EnhancedDocumentUpload({ onUploadComplete, maxFiles = 10 }: EnhancedDocumentUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [documentType, setDocumentType] = useState<string>("")
  const [source, setSource] = useState<string>("upload")
  const [sender, setSender] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [priority, setPriority] = useState<string>("medium")
  const [department, setDepartment] = useState<string>("")
  const [linkUrl, setLinkUrl] = useState<string>("")
  const [emailDetails, setEmailDetails] = useState({ from: "", subject: "", date: "" })
  const [whatsappDetails, setWhatsappDetails] = useState({ sender: "", timestamp: "" })

  const processFiles = async (files: File[], inputType: string) => {
    const newUploads: UploadProgress[] = files.map((file) => ({
      fileName: file.name,
      progress: 0,
      status: "uploading" as const,
    }))

    setUploadProgress((prev) => [...prev, ...newUploads])

    // Simulate enhanced processing
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const uploadIndex = uploadProgress.length + i

      // Upload simulation
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setUploadProgress((prev) => prev.map((item, index) => (index === uploadIndex ? { ...item, progress } : item)))
      }

      // Processing simulation
      setUploadProgress((prev) =>
        prev.map((item, index) => (index === uploadIndex ? { ...item, status: "processing", progress: 0 } : item)),
      )

      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setUploadProgress((prev) => prev.map((item, index) => (index === uploadIndex ? { ...item, progress } : item)))
      }

      setUploadProgress((prev) =>
        prev.map((item, index) => (index === uploadIndex ? { ...item, status: "completed", progress: 100 } : item)),
      )
    }

    // Enhanced document creation with metadata
    if (onUploadComplete) {
      const mockDocuments = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: documentType || "other",
        status: "processed",
        uploadedAt: new Date().toISOString(),
        source: inputType,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        description,
        priority,
        department,
        sender,
        metadata: {
          inputType,
          ...(inputType === "email" && emailDetails),
          ...(inputType === "whatsapp" && whatsappDetails),
          ...(inputType === "link" && { originalUrl: linkUrl }),
        },
      }))
      onUploadComplete(mockDocuments)
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      await processFiles(acceptedFiles, "file-upload")
    },
    [documentType, source, description, priority, department, sender, uploadProgress.length],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/*": [".txt"],
      "audio/*": [".mp3", ".wav", ".m4a"],
    },
    maxFiles,
  })

  const handleLinkSubmit = async () => {
    if (!linkUrl) return

    // Simulate link processing
    const mockFile = new File([""], "linked-document.pdf", { type: "application/pdf" })
    await processFiles([mockFile], "link")
    setLinkUrl("")
  }

  const handleEmailSubmit = async () => {
    if (!emailDetails.from) return

    const mockFile = new File([""], `email-${emailDetails.subject || "attachment"}.pdf`, { type: "application/pdf" })
    await processFiles([mockFile], "email")
    setEmailDetails({ from: "", subject: "", date: "" })
  }

  const handleWhatsAppSubmit = async () => {
    if (!whatsappDetails.sender) return

    const mockFile = new File([""], `whatsapp-${whatsappDetails.sender}.jpg`, { type: "image/jpeg" })
    await processFiles([mockFile], "whatsapp")
    setWhatsappDetails({ sender: "", timestamp: "" })
  }

  const removeUpload = (index: number) => {
    setUploadProgress((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Document Metadata Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
          <CardDescription>Provide details about the document you're uploading</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="document-type">Document Type *</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety-circular">Safety Circular</SelectItem>
                  <SelectItem value="incident-report">Incident Report</SelectItem>
                  <SelectItem value="vendor-invoice">Vendor Invoice</SelectItem>
                  <SelectItem value="engineering-drawing">Engineering Drawing</SelectItem>
                  <SelectItem value="maintenance-log">Maintenance Log</SelectItem>
                  <SelectItem value="compliance-report">Compliance Report</SelectItem>
                  <SelectItem value="training-material">Training Material</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">🔴 Urgent</SelectItem>
                  <SelectItem value="high">🟡 High</SelectItem>
                  <SelectItem value="medium">🟢 Medium</SelectItem>
                  <SelectItem value="low">⚪ Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="safety">Safety & Security</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="procurement">Procurement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sender">Sender/Author</Label>
              <Input
                id="sender"
                placeholder="e.g., John Doe, Operations Team"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Document Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the document content, purpose, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Multiple Input Types */}
      <Card>
        <CardHeader>
          <CardTitle>Document Input Methods</CardTitle>
          <CardDescription>Choose how you want to add documents to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="file-upload" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="file-upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                File Upload
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Link/URL
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="cloud" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Cloud Storage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file-upload" className="mt-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-lg font-medium">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-lg font-medium mb-2">Drag & drop files here, or click to select</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports PDF, Images, Word documents, Text files, Audio recordings
                    </p>
                    <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Documents
                      </span>
                      <span className="flex items-center gap-1">
                        <Camera className="h-3 w-3" /> Images
                      </span>
                      <span className="flex items-center gap-1">
                        <Mic className="h-3 w-3" /> Audio
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="link" className="mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="link-url">Document URL/Link</Label>
                  <Input
                    id="link-url"
                    placeholder="https://example.com/document.pdf or cloud storage link"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                </div>
                <Button onClick={handleLinkSubmit} disabled={!linkUrl}>
                  <Link className="h-4 w-4 mr-2" />
                  Process Link
                </Button>
                <p className="text-sm text-muted-foreground">
                  Supports: Google Drive, Dropbox, OneDrive, SharePoint, direct file URLs
                </p>
              </div>
            </TabsContent>

            <TabsContent value="email" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="email-from">From Email</Label>
                    <Input
                      id="email-from"
                      placeholder="sender@example.com"
                      value={emailDetails.from}
                      onChange={(e) => setEmailDetails((prev) => ({ ...prev, from: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-subject">Subject</Label>
                    <Input
                      id="email-subject"
                      placeholder="Email subject"
                      value={emailDetails.subject}
                      onChange={(e) => setEmailDetails((prev) => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-date">Date Received</Label>
                    <Input
                      id="email-date"
                      type="date"
                      value={emailDetails.date}
                      onChange={(e) => setEmailDetails((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={handleEmailSubmit} disabled={!emailDetails.from}>
                  <Mail className="h-4 w-4 mr-2" />
                  Process Email Attachment
                </Button>
                <p className="text-sm text-muted-foreground">
                  For email attachments forwarded to the system or manual entry
                </p>
              </div>
            </TabsContent>

            <TabsContent value="whatsapp" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="whatsapp-sender">Sender Name/Number</Label>
                    <Input
                      id="whatsapp-sender"
                      placeholder="Contact name or phone number"
                      value={whatsappDetails.sender}
                      onChange={(e) => setWhatsappDetails((prev) => ({ ...prev, sender: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp-timestamp">Timestamp</Label>
                    <Input
                      id="whatsapp-timestamp"
                      type="datetime-local"
                      value={whatsappDetails.timestamp}
                      onChange={(e) => setWhatsappDetails((prev) => ({ ...prev, timestamp: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={handleWhatsAppSubmit} disabled={!whatsappDetails.sender}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Process WhatsApp Document
                </Button>
                <p className="text-sm text-muted-foreground">
                  For documents shared via WhatsApp Business or screenshots
                </p>
              </div>
            </TabsContent>

            <TabsContent value="cloud" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Cloud className="h-6 w-6 mb-2" />
                    Google Drive
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Cloud className="h-6 w-6 mb-2" />
                    Dropbox
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Cloud className="h-6 w-6 mb-2" />
                    OneDrive
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Cloud className="h-6 w-6 mb-2" />
                    SharePoint
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect your cloud storage accounts to import documents directly
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadProgress.map((upload, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {upload.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : upload.status === "error" ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{upload.fileName}</p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            upload.status === "completed"
                              ? "default"
                              : upload.status === "error"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {upload.status === "uploading"
                            ? "Uploading"
                            : upload.status === "processing"
                              ? "Processing OCR & AI"
                              : upload.status === "completed"
                                ? "Completed"
                                : "Error"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => removeUpload(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={upload.progress} className="h-2" />
                    {upload.error && <p className="text-sm text-red-600 mt-1">{upload.error}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
