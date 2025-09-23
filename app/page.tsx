"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { EnhancedManagerDashboard } from "@/components/enhanced-manager-dashboard"
import { EnhancedTechnicianDashboard } from "@/components/enhanced-technician-dashboard"
import { DocumentIngestionInterface } from "@/components/document-ingestion-interface"
import { RoleSelector, type RoleKey } from "@/components/role-selector"
import { RollingStockManagerDashboard } from "@/components/roles/rolling-stock-manager-dashboard"
import { ProcurementOfficerDashboard } from "@/components/roles/procurement-officer-dashboard"
import { HRSafetyCoordinatorDashboard } from "@/components/roles/hr-safety-coordinator-dashboard"
import { ExecutiveDirectorDashboard } from "@/components/roles/executive-director-dashboard"

type User = {
  id: string
  name: string
  role: "manager" | "technician"
  department: string
  email: string
}

type AppState =
  | "landing"
  | "role-selector"
  | "manager-dashboard"
  | "technician-dashboard"
  | "document-ingestion"
  | "rolling-stock-manager"
  | "procurement-officer"
  | "hr-safety-coordinator"
  | "executive-director"

export default function Page() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const handleSignIn = () => {
    setCurrentUser(null)
    setAppState("role-selector")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setAppState("landing")
  }

  const handleNavigateToIngestion = () => {
    setAppState("document-ingestion")
  }

  const handleBackToDashboard = () => {
    if (currentUser?.role === "manager") {
      setAppState("manager-dashboard")
    } else {
      setAppState("technician-dashboard")
    }
  }

  const handleBackToSelector = () => setAppState("role-selector")

  const handleSelectRole = (role: RoleKey) => {
    switch (role) {
      case "rolling-stock-manager":
        setAppState("rolling-stock-manager")
        break
      case "procurement-officer":
        setAppState("procurement-officer")
        break
      case "hr-safety-coordinator":
        setAppState("hr-safety-coordinator")
        break
      case "executive-director":
        setAppState("executive-director")
        break
    }
  }

  switch (appState) {
    case "landing":
      return <LandingPage onSignIn={handleSignIn} />

    case "role-selector":
      return <RoleSelector onSelect={handleSelectRole} onBackToLanding={() => setAppState("landing")} />

    case "manager-dashboard":
      return <EnhancedManagerDashboard onLogout={handleLogout} />

    case "technician-dashboard":
      return <EnhancedTechnicianDashboard onLogout={handleLogout} />

    case "document-ingestion":
      return <DocumentIngestionInterface onBack={handleBackToDashboard} />

    case "rolling-stock-manager":
      return <RollingStockManagerDashboard onBack={handleBackToSelector} />

    case "procurement-officer":
      return <ProcurementOfficerDashboard onBack={handleBackToSelector} />

    case "hr-safety-coordinator":
      return <HRSafetyCoordinatorDashboard onBack={handleBackToSelector} />

    case "executive-director":
      return <ExecutiveDirectorDashboard onBack={handleBackToSelector} />

    default:
      return <LandingPage onSignIn={handleSignIn} />
  }
}
