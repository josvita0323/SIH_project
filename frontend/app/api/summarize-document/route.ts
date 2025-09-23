import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  const { text, documentType, context } = await req.json()

  const {
    text: summary,
    usage,
    finishReason,
  } = await generateText({
    model: openai("gpt-4o"),
    prompt: `You are an AI assistant for Kochi Metro Rail Limited (KMRL). 
    
    Summarize this ${documentType} document in 3-4 sentences, focusing on:
    - Key operational requirements or changes
    - Safety implications
    - Action items and deadlines
    - Impact on metro operations
    
    Context: ${context || "General KMRL document"}
    
    Document text:
    ${text}
    
    Provide a concise, actionable summary suitable for managers and technicians.`,
    maxOutputTokens: 500,
    temperature: 0.3,
  })

  return Response.json({
    summary,
    usage,
    finishReason,
  })
}
