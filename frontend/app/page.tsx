"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Zap,
  Users,
  Shield,
  ArrowRight,
  Upload,
  Search,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">KMRL DMS</h1>
              <p className="text-sm text-gray-600">
                Document Management System
              </p>
            </div>
          </div>
          <Button
            onClick={(e) => router.push("/selector")}
            className="bg-primary hover:bg-primary/90"
          >
            Sign In
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Document Processing
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Intelligent Document Management for{" "}
            <span className="text-primary">Kochi Metro</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            Transform your document workflow with AI-powered classification,
            summarization, and action item extraction. Built specifically for
            KMRL operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={(e) => router.push("/selector")}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Streamline Your Document Workflow
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From ingestion to action - our AI-powered system handles every
              step of your document processing pipeline.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Smart Ingestion</CardTitle>
                <CardDescription>
                  Upload PDFs, images, or connect email/WhatsApp channels. OCR
                  supports English and Malayalam.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>AI Processing</CardTitle>
                <CardDescription>
                  Automatic classification, summarization, and action item
                  extraction with full traceability to source.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Role-Based Views</CardTitle>
                <CardDescription>
                  Customized dashboards for managers and technicians with
                  relevant information and task prioritization.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Semantic Search</CardTitle>
                <CardDescription>
                  Find documents by meaning, not just keywords. Advanced search
                  across all processed content.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Calendar Integration</CardTitle>
                <CardDescription>
                  Automatic deadline tracking and calendar events linked to
                  document action items.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Compliance Ready</CardTitle>
                <CardDescription>
                  Full audit trail and compliance tracking for regulatory
                  requirements and safety standards.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">
              Simple workflow from document upload to actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Ingest",
                desc: "Upload or connect document sources",
              },
              {
                step: "02",
                title: "Process",
                desc: "AI classifies and extracts insights",
              },
              {
                step: "03",
                title: "Distribute",
                desc: "Route to relevant team members",
              },
              {
                step: "04",
                title: "Act",
                desc: "Complete tasks with full traceability",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join KMRL teams already using our AI-powered document management
            system.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={(e) => router.push("/selector")}
            className="bg-white text-primary hover:bg-gray-100"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">KMRL DMS</span>
          </div>
          <p className="text-gray-400">
            © 2024 Kochi Metro Rail Limited. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
