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
import { Upload, ImageIcon, X, CheckCircle, AlertCircle } from "lucide-react"
import type { UploadProgress } from "@/types/document"

interface DocumentUploadProps {
  onUploadComplete?: (documents: any[]) => void
  maxFiles?: number
}

export function DocumentUpload({ onUploadComplete, maxFiles = 10 }: DocumentUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [documentType, setDocumentType] = useState<string>("")
  const [source, setSource] = useState<string>("upload")
  const [sender, setSender] = useState<string>("")

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newUploads: UploadProgress[] = acceptedFiles.map((file) => ({
        fileName: file.name,
        progress: 0,
        status: "uploading" as const,
      }))

      setUploadProgress((prev) => [...prev, ...newUploads])

      // Simulate file upload and processing
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        const uploadIndex = uploadProgress.length + i

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          setUploadProgress((prev) => prev.map((item, index) => (index === uploadIndex ? { ...item, progress } : item)))
        }

        // Switch to processing
        setUploadProgress((prev) =>
          prev.map((item, index) => (index === uploadIndex ? { ...item, status: "processing", progress: 0 } : item)),
        )

        // Simulate OCR processing
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise((resolve) => setTimeout(resolve, 200))
          setUploadProgress((prev) => prev.map((item, index) => (index === uploadIndex ? { ...item, progress } : item)))
        }

        // Complete processing
        setUploadProgress((prev) =>
          prev.map((item, index) => (index === uploadIndex ? { ...item, status: "completed", progress: 100 } : item)),
        )
      }

      // Notify parent component
      if (onUploadComplete) {
        const mockDocuments = acceptedFiles.map((file) => ({
          id: Math.random().toString(36).substr(2, 9),
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: documentType || "other",
          status: "processed",
          uploadedAt: new Date().toISOString(),
          source,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }))
        onUploadComplete(mockDocuments)
      }
    },
    [documentType, source, onUploadComplete, uploadProgress.length],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles,
  })

  const removeUpload = (index: number) => {
    setUploadProgress((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Upload Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Document Upload Configuration</CardTitle>
          <CardDescription>Set document metadata before uploading</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
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
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upload">Direct Upload</SelectItem>
                  <SelectItem value="email">Email Attachment</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="cloud-link">Cloud Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sender">Sender/Department</Label>
              <Input
                id="sender"
                placeholder="e.g., Operations Team"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
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
                <p className="text-sm text-muted-foreground">
                  Supports PDF, Images, Word documents (Max {maxFiles} files)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
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
                              ? "Processing OCR"
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
