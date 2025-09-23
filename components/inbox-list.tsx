"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockDocuments } from "@/lib/mock-data"

type RoleKey = "rolling-stock-manager" | "procurement-officer" | "hr-safety-coordinator" | "executive-director"

function filterDocs(role: RoleKey) {
  switch (role) {
    case "rolling-stock-manager":
      return mockDocuments.filter((d) => ["safety-circular", "incident-report", "engineering-drawing"].includes(d.type))
    case "procurement-officer":
      return mockDocuments.filter((d) => d.type === "vendor-invoice")
    case "hr-safety-coordinator":
      return mockDocuments.filter((d) => d.type === "safety-circular")
    case "executive-director":
      return mockDocuments
    default:
      return mockDocuments
  }
}

export function InboxList({ role }: { role: RoleKey }) {
  const docs = filterDocs(role).slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Inbox</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {docs.length === 0 && <p className="text-sm text-muted-foreground">No notices yet.</p>}
        {docs.map((doc) => (
          <div key={doc.id} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{doc.title}</h4>
              <Badge variant={doc.status === "urgent" ? "destructive" : "secondary"}>{doc.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{doc.summary}</p>
            <div className="text-xs text-muted-foreground mt-2">
              {new Date(doc.uploadedAt).toLocaleDateString()} • Source: {doc.source}
            </div>
            <div className="mt-2">
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
