"use client"

// Frontline Operations Manager (Rolling Stock)
import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, ArrowLeftCircle } from "lucide-react"
import { mockDocuments, mockCalendarEvents } from "@/lib/mock-data"
import { SimpleUpload } from "@/components/simple-upload"
import { InboxList } from "@/components/inbox-list"

export function RollingStockManagerDashboard({ onBack }: { onBack: () => void }) {
  const urgentSafety = useMemo(
    () => mockDocuments.filter((d) => d.type === "safety-circular" && d.status === "urgent"),
    [],
  )
  const maintenanceRelated = useMemo(
    () => mockDocuments.filter((d) => ["incident-report", "engineering-drawing"].includes(d.type)),
    [],
  )
  const todayEvents = useMemo(
    () => mockCalendarEvents.filter((e) => new Date(e.date).toDateString() === new Date().toDateString()),
    [],
  )

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg text-white flex items-center justify-center font-bold">
              KM
            </div>
            <div>
              <h1 className="text-xl font-bold">KMRL Task Management</h1>
              <p className="text-sm text-muted-foreground">Frontline Operations Manager (Rolling Stock)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeftCircle className="w-4 h-4 mr-2" />
              Role Selector
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <section className="p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SimpleUpload />
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Quick Info</h3>
            <p className="text-sm text-muted-foreground">
              Use the Upload card to add PDFs. Your routed notices will appear below in the Inbox.
            </p>
          </Card>
        </div>
        <InboxList role="rolling-stock-manager" />
      </section>
    </main>
  )
}
