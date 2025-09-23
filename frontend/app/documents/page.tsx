"use client"

import { useState } from "react"
import { DocumentSearch } from "@/components/document-search"
import { DocumentAnalytics } from "@/components/document-analytics"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, BarChart3, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DocumentsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("search")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold">Document Management</h1>
          </div>
          <Button onClick={() => router.push("/upload")}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search & Filter</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <DocumentSearch />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <DocumentAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
