"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Building,
  AlertTriangle,
  Clock,
  Filter,
  SortDesc,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Mock search results data
const mockSearchResults = [
  {
    id: "1",
    title: "Safety Protocol Update for Platform Operations",
    type: "safety-circular",
    content:
      "Updated safety protocols for platform operations during peak hours. All staff must follow new guidelines for passenger safety and crowd management.",
    department: "Safety & Security",
    uploadedBy: "Safety Manager",
    uploadedAt: "2024-01-15T10:30:00Z",
    priority: "urgent",
    relevanceScore: 0.95,
    actionItems: 3,
    fileName: "safety-protocol-2024-001.pdf",
  },
  {
    id: "2",
    title: "Monthly Maintenance Report - January 2024",
    type: "maintenance-log",
    content:
      "Comprehensive maintenance report covering all rolling stock, track infrastructure, and station facilities. Includes preventive maintenance schedules and repair logs.",
    department: "Maintenance",
    uploadedBy: "Maintenance Chief",
    uploadedAt: "2024-01-31T16:45:00Z",
    priority: "medium",
    relevanceScore: 0.87,
    actionItems: 7,
    fileName: "maintenance-report-jan-2024.pdf",
  },
  {
    id: "3",
    title: "Vendor Invoice - Electrical Components Supply",
    type: "vendor-invoice",
    content:
      "Invoice for electrical components supply including LED lighting systems, power cables, and control panels for station upgrades.",
    department: "Procurement",
    uploadedBy: "Procurement Officer",
    uploadedAt: "2024-01-20T09:15:00Z",
    priority: "low",
    relevanceScore: 0.73,
    actionItems: 1,
    fileName: "vendor-invoice-elec-001.pdf",
  },
  {
    id: "4",
    title: "Incident Report - Signal Malfunction at Aluva Station",
    type: "incident-report",
    content:
      "Detailed incident report regarding signal malfunction at Aluva station on January 18th. Includes root cause analysis and corrective actions taken.",
    department: "Operations",
    uploadedBy: "Station Controller",
    uploadedAt: "2024-01-18T14:20:00Z",
    priority: "high",
    relevanceScore: 0.91,
    actionItems: 5,
    fileName: "incident-report-aluva-001.pdf",
  },
  {
    id: "5",
    title: "Engineering Drawing - Platform Extension Design",
    type: "engineering-drawing",
    content:
      "Technical drawings for platform extension at Ernakulam South station. Includes structural details, dimensions, and material specifications.",
    department: "Engineering",
    uploadedBy: "Chief Engineer",
    uploadedAt: "2024-01-25T11:00:00Z",
    priority: "medium",
    relevanceScore: 0.82,
    actionItems: 2,
    fileName: "platform-extension-design.dwg",
  },
]

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockSearchResults>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Filter results based on search query (simple mock implementation)
    const filtered = mockSearchResults.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setSearchResults(filtered)
    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "secondary"
      case "medium":
        return "default"
      case "low":
        return "outline"
      default:
        return "default"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "safety-circular":
        return <AlertTriangle className="h-4 w-4" />
      case "incident-report":
        return <AlertTriangle className="h-4 w-4" />
      case "maintenance-log":
        return <FileText className="h-4 w-4" />
      case "vendor-invoice":
        return <FileText className="h-4 w-4" />
      case "engineering-drawing":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-semibold">Document Search</h1>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Search Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Search KMRL Documents</h2>
            <p className="text-muted-foreground text-lg">
              Find documents using semantic search across all content, summaries, and action items
            </p>
          </div>

          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for safety protocols, maintenance reports, incidents, or any document content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="h-12 px-8">
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Search Suggestions */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Try searching for:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "safety protocols",
                    "maintenance schedule",
                    "incident reports",
                    "vendor invoices",
                    "platform operations",
                    "signal malfunction",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(suggestion)
                        handleSearch()
                      }}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <div>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    {isSearching ? "Searching..." : `${searchResults.length} results found`}
                    {searchQuery && !isSearching && (
                      <span className="text-muted-foreground font-normal"> for "{searchQuery}"</span>
                    )}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <SortDesc className="h-4 w-4 mr-2" />
                    Sort by Relevance
                  </Button>
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(result.type)}
                          <div>
                            <h4 className="font-semibold text-lg hover:text-primary transition-colors">
                              {result.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {result.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {result.uploadedBy}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(result.uploadedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(result.priority)}>{result.priority.toUpperCase()}</Badge>
                          <Badge variant="secondary">{Math.round(result.relevanceScore * 100)}% match</Badge>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">{result.content}</p>

                      <Separator className="my-4" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {result.fileName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {result.actionItems} action items
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Document
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {searchResults.length === 0 && !isSearching && hasSearched && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                      <p className="text-muted-foreground">Try adjusting your search terms or browse all documents</p>
                      <Button
                        variant="outline"
                        className="mt-4 bg-transparent"
                        onClick={() => router.push("/documents")}
                      >
                        Browse All Documents
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-4">Semantic Document Search</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our AI-powered search understands context and meaning, not just keywords. Search for concepts, topics,
                  or specific information across all your KMRL documents.
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <h4 className="font-medium mb-1">Safety Documents</h4>
                    <p className="text-sm text-muted-foreground">Protocols, incidents, compliance</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-medium mb-1">Operational Reports</h4>
                    <p className="text-sm text-muted-foreground">Maintenance, schedules, logs</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Building className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium mb-1">Administrative</h4>
                    <p className="text-sm text-muted-foreground">Invoices, contracts, drawings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
