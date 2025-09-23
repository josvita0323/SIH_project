"use client"

import { useState } from "react"
import { EnhancedDocumentUpload } from "@/components/enhanced-document-upload"
import { AIDocumentProcessor } from "@/components/ai-document-processor"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Brain } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Document } from "@/types/document"

export default function UploadPage() {
  const router = useRouter()
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [processingMode, setProcessingMode] = useState<"upload" | "ai-process">("upload")

  const handleUploadComplete = (documents: any[]) => {
    const processedDocs: Document[] = documents.map((doc) => ({
      ...doc,
      id: doc.id || Math.random().toString(36).substr(2, 9),
      uploadedBy: "Current User",
      metadata: {
        tags: [],
        language: "english" as const,
        confidence: 0.94,
        processingTime: 2300,
      },
    }))
    setUploadedDocuments((prev) => [...prev, ...processedDocs])
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setProcessingMode("ai-process")
  }

  if (processingMode === "ai-process" && selectedFile) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="flex h-16 items-center px-6">
            <Button
              variant="ghost"
              onClick={() => {
                setProcessingMode("upload")
                setSelectedFile(null)
              }}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Upload
            </Button>
            <h1 className="text-xl font-semibold flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              AI Document Processing
            </h1>
          </div>
        </header>
        <div className="p-6">
          <AIDocumentProcessor
            file={selectedFile}
            onProcessingComplete={(result) => {
              console.log("Processing complete:", result)
              // Handle the processed result
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-semibold">Document Upload & Processing</h1>
        </div>
      </header>

      <div className="p-6">
        <EnhancedDocumentUpload onUploadComplete={handleUploadComplete} />

        {uploadedDocuments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Recently Uploaded Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedDocuments.map((doc) => (
                <div key={doc.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{doc.title}</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Create a mock file for AI processing demo
                        const mockFile = new File([""], doc.fileName, { type: doc.mimeType })
                        handleFileSelect(mockFile)
                      }}
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      AI Process
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {doc.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {doc.fileName} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
