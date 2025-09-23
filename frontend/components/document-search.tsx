"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, CalendarIcon, FileText, Download, Eye, X } from "lucide-react"
import { format } from "date-fns"

interface SearchFilters {
  query: string
  documentType: string
  status: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  department: string
  priority: string
}

interface DocumentSearchProps {
  onSearchResults?: (results: any[]) => void
}

export function DocumentSearch({ onSearchResults }: DocumentSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    documentType: "all-types",
    status: "all-status",
    dateRange: { from: undefined, to: undefined },
    department: "all-departments",
    priority: "all-priorities",
  })

  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock search results
  const mockResults = [
    {
      id: "1",
      title: "Safety Circular - Emergency Brake Protocol Update",
      type: "safety-circular",
      status: "urgent",
      uploadedAt: "2024-01-20T10:30:00Z",
      department: "Safety Department",
      priority: "high",
      summary: "Updated emergency brake protocols for all metro trains. Immediate implementation required.",
      actionItems: 3,
      fileSize: "2.4 MB",
      language: "english",
    },
    {
      id: "2",
      title: "Incident Report - Platform 3 Delay Investigation",
      type: "incident-report",
      status: "review",
      uploadedAt: "2024-01-19T14:15:00Z",
      department: "Operations Team",
      priority: "medium",
      summary: "Investigation report for 15-minute delay at Platform 3 due to signal malfunction.",
      actionItems: 2,
      fileSize: "1.8 MB",
      language: "english",
    },
    {
      id: "3",
      title: "Vendor Invoice - Track Maintenance Equipment",
      type: "vendor-invoice",
      status: "approved",
      uploadedAt: "2024-01-18T09:45:00Z",
      department: "Procurement",
      priority: "low",
      summary: "Invoice for specialized track maintenance equipment purchased from TechRail Solutions.",
      actionItems: 1,
      fileSize: "0.9 MB",
      language: "english",
    },
    {
      id: "4",
      title: "Engineering Drawing - Platform Extension Design",
      type: "engineering-drawing",
      status: "processing",
      uploadedAt: "2024-01-17T16:20:00Z",
      department: "Engineering Team",
      priority: "medium",
      summary: "Technical drawings for Platform 5 extension project including structural modifications.",
      actionItems: 5,
      fileSize: "15.2 MB",
      language: "english",
    },
  ]

  const handleSearch = async () => {
    setIsSearching(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Filter mock results based on search criteria
    const filteredResults = mockResults.filter((doc) => {
      const matchesQuery =
        !filters.query ||
        doc.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        doc.summary.toLowerCase().includes(filters.query.toLowerCase())

      const matchesType = !filters.documentType || doc.type === filters.documentType
      const matchesStatus = !filters.status || doc.status === filters.status
      const matchesDepartment = !filters.department || doc.department === filters.department
      const matchesPriority = !filters.priority || doc.priority === filters.priority

      return matchesQuery && matchesType && matchesStatus && matchesDepartment && matchesPriority
    })

    setSearchResults(filteredResults)
    onSearchResults?.(filteredResults)
    setIsSearching(false)
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      documentType: "all-types",
      status: "all-status",
      dateRange: { from: undefined, to: undefined },
      department: "all-departments",
      priority: "all-priorities",
    })
    setSearchResults([])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "destructive"
      case "review":
        return "secondary"
      case "approved":
        return "default"
      case "processing":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-orange-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Document Search & Filter</span>
          </CardTitle>
          <CardDescription>Search across all KMRL documents with advanced filtering</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Query */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search documents, summaries, action items..."
                value={filters.query}
                onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select
              value={filters.documentType}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, documentType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="safety-circular">Safety Circular</SelectItem>
                <SelectItem value="incident-report">Incident Report</SelectItem>
                <SelectItem value="vendor-invoice">Vendor Invoice</SelectItem>
                <SelectItem value="engineering-drawing">Engineering Drawing</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.department}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, department: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-departments">All Departments</SelectItem>
                <SelectItem value="Safety Department">Safety Department</SelectItem>
                <SelectItem value="Operations Team">Operations Team</SelectItem>
                <SelectItem value="Engineering Team">Engineering Team</SelectItem>
                <SelectItem value="Procurement">Procurement</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.priority}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-priorities">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd")} - {format(filters.dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Date Range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from}
                  selected={filters.dateRange}
                  onSelect={(range) =>
                    setFilters((prev) => ({ ...prev, dateRange: range || { from: undefined, to: undefined } }))
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={clearFilters} size="sm">
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
            <p className="text-sm text-muted-foreground">{searchResults.length} documents found</p>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>{searchResults.length} documents match your criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((doc) => (
                <div key={doc.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <h3 className="font-semibold">{doc.title}</h3>
                        <Badge variant={getStatusColor(doc.status)}>{doc.status}</Badge>
                        <Badge variant="outline" className={getPriorityColor(doc.priority)}>
                          {doc.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{doc.summary}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{doc.department}</span>
                        <span>{doc.actionItems} action items</span>
                        <span>{doc.fileSize}</span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
