export interface Document {
  id: string
  title: string
  type: "safety-circular" | "incident-report" | "vendor-invoice" | "engineering-drawing" | "other"
  status: "processing" | "processed" | "review" | "approved" | "urgent"
  uploadedAt: string
  uploadedBy: string
  source: "upload" | "email" | "whatsapp" | "cloud-link"
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  extractedText?: string
  summary?: string
  actionItems?: ActionItem[]
  metadata: DocumentMetadata
}

export interface ActionItem {
  id: string
  description: string
  assignee: string
  deadline: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed"
  sourceLocation: {
    page: number
    line: number
    text: string
  }
}

export interface DocumentMetadata {
  sender?: string
  department?: string
  tags: string[]
  language: "english" | "malayalam" | "mixed"
  confidence: number
  processingTime: number
}

export interface UploadProgress {
  fileName: string
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  error?: string
}
