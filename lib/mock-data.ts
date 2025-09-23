export interface Document {
  id: string
  title: string
  type: "safety-circular" | "incident-report" | "vendor-invoice" | "engineering-drawing"
  status: "processing" | "completed" | "urgent" | "compliance"
  uploadedAt: string
  source: "email" | "whatsapp" | "upload" | "cloud"
  sender: string
  summary: string
  actionItems: ActionItem[]
  confidence: number
  originalText?: string
}

export interface ActionItem {
  id: string
  task: string
  assignee: string
  deadline: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed"
  documentId: string
  sourceLocation: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  type: "deadline" | "inspection" | "meeting" | "maintenance"
  relatedDocuments: string[]
  priority: "high" | "medium" | "low"
}

export const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Safety Circular - Brake Inspection Protocol",
    type: "safety-circular",
    status: "urgent",
    uploadedAt: "2024-01-15T10:30:00Z",
    source: "email",
    sender: "Safety Department",
    summary:
      "New brake inspection protocol requires immediate implementation across all trains. All technicians must complete certification by January 25th. Failure to comply may result in service suspension.",
    confidence: 0.95,
    actionItems: [
      {
        id: "a1",
        task: "Complete brake inspection certification",
        assignee: "All Technicians",
        deadline: "2024-01-25",
        priority: "high",
        status: "pending",
        documentId: "1",
        sourceLocation: "Page 2, Section 3.1",
      },
    ],
  },
  {
    id: "2",
    title: "Incident Report - Platform Safety Issue",
    type: "incident-report",
    status: "completed",
    uploadedAt: "2024-01-14T14:20:00Z",
    source: "whatsapp",
    sender: "Station Master - Aluva",
    summary:
      "Minor platform safety incident reported at Aluva station. Investigation completed, safety measures implemented. Follow-up inspection scheduled for next week.",
    confidence: 0.88,
    actionItems: [
      {
        id: "a2",
        task: "Conduct follow-up safety inspection",
        assignee: "Safety Inspector",
        deadline: "2024-01-22",
        priority: "medium",
        status: "in-progress",
        documentId: "2",
        sourceLocation: "Page 1, Conclusion",
      },
    ],
  },
  {
    id: "3",
    title: "Vendor Invoice - Track Maintenance Equipment",
    type: "vendor-invoice",
    status: "processing",
    uploadedAt: "2024-01-16T09:15:00Z",
    source: "upload",
    sender: "Metro Supplies Ltd",
    summary:
      "Invoice for track maintenance equipment delivery. Payment due within 30 days. Equipment includes rail grinding tools and inspection devices.",
    confidence: 0.92,
    actionItems: [
      {
        id: "a3",
        task: "Process payment for track maintenance equipment",
        assignee: "Finance Team",
        deadline: "2024-02-15",
        priority: "medium",
        status: "pending",
        documentId: "3",
        sourceLocation: "Payment Terms Section",
      },
    ],
  },
]

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Brake Certification Deadline",
    date: "2024-01-25",
    time: "17:00",
    type: "deadline",
    relatedDocuments: ["1"],
    priority: "high",
  },
  {
    id: "e2",
    title: "Platform Safety Inspection",
    date: "2024-01-22",
    time: "10:00",
    type: "inspection",
    relatedDocuments: ["2"],
    priority: "medium",
  },
  {
    id: "e3",
    title: "Monthly Safety Review",
    date: "2024-01-30",
    time: "14:00",
    type: "meeting",
    relatedDocuments: ["1", "2"],
    priority: "medium",
  },
]

export const mockUsers = {
  manager: {
    id: "m1",
    name: "Rajesh Kumar",
    role: "manager" as const,
    department: "Operations",
    email: "rajesh.kumar@kmrl.gov.in",
  },
  technician: {
    id: "t1",
    name: "Priya Nair",
    role: "technician" as const,
    department: "Maintenance",
    email: "priya.nair@kmrl.gov.in",
  },
}
