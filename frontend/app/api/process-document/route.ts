import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const kmrlDocumentSchema = z.object({
  documentType: z
    .enum([
      "safety-circular",
      "incident-report",
      "vendor-invoice",
      "engineering-drawing",
      "maintenance-manual",
      "other",
    ])
    .describe("Type of KMRL document"),
  title: z.string().describe("Document title or subject"),
  summary: z.string().describe("3-4 sentence summary highlighting operationally relevant content"),
  language: z.enum(["english", "malayalam", "mixed"]).describe("Primary language of the document"),
  actionItems: z
    .array(
      z.object({
        description: z.string().describe("What needs to be done"),
        assignee: z.string().describe("Who is responsible (department or role)"),
        deadline: z.string().optional().describe("When it needs to be completed (if mentioned)"),
        priority: z.enum(["high", "medium", "low"]).describe("Priority level based on safety/compliance requirements"),
        sourceLocation: z.object({
          page: z.number().describe("Page number where this action item was found"),
          context: z.string().describe("Relevant text excerpt from the document"),
        }),
      }),
    )
    .describe("Specific tasks, deadlines, and responsibilities extracted from the document"),
  keyInformation: z.object({
    departments: z.array(z.string()).describe("Departments or teams mentioned"),
    equipment: z.array(z.string()).describe("Equipment, trains, or infrastructure mentioned"),
    locations: z.array(z.string()).describe("Stations, depots, or specific locations mentioned"),
    regulations: z.array(z.string()).describe("Safety regulations or compliance requirements mentioned"),
    deadlines: z.array(z.string()).describe("All dates and deadlines mentioned"),
  }),
  urgencyLevel: z
    .enum(["immediate", "urgent", "normal", "low"])
    .describe("Overall urgency based on safety and operational impact"),
  complianceRequired: z.boolean().describe("Whether this document requires regulatory compliance tracking"),
})

export async function POST(req: Request) {
  const { file, documentMetadata } = await req.json()

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: kmrlDocumentSchema,
    messages: [
      {
        role: "system",
        content: `You are an AI assistant specialized in processing documents for Kochi Metro Rail Limited (KMRL). 
        Extract structured information focusing on:
        - Safety and operational requirements
        - Action items with clear responsibilities and deadlines
        - Compliance and regulatory requirements
        - Equipment and infrastructure references
        - Departmental assignments
        
        Pay special attention to Malayalam text and mixed-language documents common in Kerala.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Process this KMRL document and extract structured information. Document metadata: ${JSON.stringify(documentMetadata)}`,
          },
          {
            type: "file",
            data: file.data,
            mediaType: file.mediaType || "application/pdf",
            filename: file.filename || "document.pdf",
          },
        ],
      },
    ],
  })

  return Response.json({
    extractedData: object,
    processingTime: Date.now(),
    confidence: 0.94, // Mock confidence score
  })
}
