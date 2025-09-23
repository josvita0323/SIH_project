"use client"

import Image from "next/image"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, ShoppingCart, ShieldAlert, BarChartBig } from "lucide-react"

export type RoleKey = "rolling-stock-manager" | "procurement-officer" | "hr-safety-coordinator" | "executive-director"

export function RoleSelector({
  onSelect,
  onBackToLanding,
}: {
  onSelect: (role: RoleKey) => void
  onBackToLanding?: () => void
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              KM
            </div>
            <div>
              <h1 className="text-xl font-bold">KMRL Demo Selector</h1>
              <p className="text-sm text-muted-foreground">Choose a stakeholder demo</p>
            </div>
          </div>
          {onBackToLanding ? (
            <Button variant="outline" onClick={onBackToLanding}>
              Back to Landing
            </Button>
          ) : null}
        </div>
      </header>

      <section className="container mx-auto px-4 py-8">
        
        <div className="text-center max-w-3xl mx-auto mt-10 mb-8">
          <h2 className="text-3xl font-bold text-balance">Who's using the demo?</h2>
          <p className="text-muted-foreground mt-2">
            Choose a role to preview tailored information, actions, and workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => onSelect("rolling-stock-manager")}>
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-primary" />
                <CardTitle>Frontline Operations Manager (Rolling Stock)</CardTitle>
              </div>
              <Badge variant="secondary">Engineering & Train Operations</Badge>
              <CardDescription>
                Oversees train availability, rolling-stock readiness, and maintenance schedules.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => onSelect("procurement-officer")}>
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <CardTitle>Procurement Officer</CardTitle>
              </div>
              <Badge variant="secondary">Finance & Commercial</Badge>
              <CardDescription>
                Manages vendor contracts, spare-parts purchasing, and invoice approvals.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => onSelect("hr-safety-coordinator")}>
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <CardTitle>HR & Safety Coordinator</CardTitle>
              </div>
              <Badge variant="secondary">Human Resources & Safety</Badge>
              <CardDescription>Organizes training, circulates safety circulars, and tracks compliance.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => onSelect("executive-director")}>
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <BarChartBig className="w-5 h-5 text-primary" />
                <CardTitle>Executive Director</CardTitle>
              </div>
              <Badge variant="secondary">Corporate Leadership</Badge>
              <CardDescription>
                Oversees strategy, compliance, and board reporting with high-level insights.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </main>
  )
}
