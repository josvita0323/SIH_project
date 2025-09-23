"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeftCircle } from "lucide-react"
import { SimpleUpload } from "@/components/simple-upload"
import { InboxList } from "@/components/inbox-list"

export function ExecutiveDirectorDashboard({ onBack }: { onBack: () => void }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg text-white flex items-center justify-center font-bold">
              KM
            </div>
            <div>
              <h1 className="text-xl font-bold">KMRL Executive</h1>
              <p className="text-sm text-muted-foreground">Executive Director</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeftCircle className="w-4 h-4 mr-2" />
            Role Selector
          </Button>
        </div>
      </header>

      <section className="p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SimpleUpload />
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Quick Info</h3>
            <p className="text-sm text-muted-foreground">
              Upload board/summary PDFs. Org-wide notices for you appear below in Inbox.
            </p>
          </Card>
        </div>
        <InboxList role="executive-director" />
      </section>
    </main>
  )
}
