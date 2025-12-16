import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";

admin.initializeApp();

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const OPENROUTER_API_KEY = defineSecret("OPENROUTER_API_KEY");

function getOpenRouterApiKey(): string | undefined {
  // Primary (Gen2): secret wired via `secrets: [OPENROUTER_API_KEY]`
  const secretValue = OPENROUTER_API_KEY.value();
  if (secretValue?.trim()) return secretValue.trim();

  // Fallback (local / emulators): plain env var
  const envKey = process.env.OPENROUTER_API_KEY;
  return envKey?.trim() || undefined;
}

interface OpenRouterRequest {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  systemInstruction?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Helper function to extract JSON from response (handles markdown code blocks)
function extractJSONFromResponse(text: string): string {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  
  // Remove ```json or ``` markers
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.trim();
  
  return cleaned;
}

// Helper function to safely parse JSON with better error handling
function safeParseJSON(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (error: any) {
    // Log the problematic JSON for debugging (first 1000 chars and last 500 chars)
    const preview = jsonString.length > 1500 
      ? `${jsonString.substring(0, 1000)}...${jsonString.substring(jsonString.length - 500)}`
      : jsonString;
    console.error('JSON parse error. Raw response length:', jsonString.length);
    console.error('JSON parse error. Response preview:', preview);
    console.error('JSON parse error details:', error.message);
    
    // Try to fix common issues
    let fixed = jsonString;
    
    // Try to find and extract JSON object if it's embedded in text
    const jsonMatch = fixed.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      fixed = jsonMatch[0];
      console.log('Extracted JSON object from response');
    }
    
    // Try parsing again with fixed version
    try {
      return JSON.parse(fixed);
    } catch (secondError: any) {
      // If still failing, throw with more context
      const errorMsg = error.message || 'Unknown JSON parse error';
      const responsePreview = jsonString.length > 500 
        ? `${jsonString.substring(0, 500)}...`
        : jsonString;
      throw new Error(`Failed to parse JSON: ${errorMsg}. Response preview: ${responsePreview}`);
    }
  }
}

// Helper function to call OpenRouter API
async function callOpenRouter(
  apiKey: string,
  request: OpenRouterRequest
): Promise<string> {
  const messages = [...(request.messages || [])];
  
  if (request.systemInstruction) {
    messages.unshift({
      role: 'system',
      content: request.systemInstruction
    });
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://orgphant.web.app',
      'X-Title': 'OrgPhant'
    },
    body: JSON.stringify({
      model: request.model || 'google/gemini-2.5-flash-preview-09-2025',
      messages: messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 4000, // Increased to avoid truncation
      ...(request.response_format && { response_format: request.response_format })
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
  }

  const data: OpenRouterResponse = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error("No response from AI");
  }

  return content;
}

// Cloud Function for chat completions
export const openrouterChat = onCall(
  { region: "europe-west3", secrets: [OPENROUTER_API_KEY] },
  async (request) => {
    // Verify user is authenticated
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
      throw new HttpsError(
        'failed-precondition',
        'OpenRouter API key not configured'
      );
    }

  try {
    const { messages, systemInstruction, model, temperature, max_tokens, response_format } = request.data;
    
    const response = await callOpenRouter(apiKey, {
      messages,
      systemInstruction,
      model,
      temperature,
      max_tokens,
      response_format
    });

    return { success: true, content: response };
  } catch (error: any) {
    console.error('OpenRouter error:', error);
    throw new HttpsError(
      'internal',
      error.message || 'Failed to get AI response'
    );
  }
  }
);

// Cloud Function for structure generation
export const openrouterGenerateStructure = onCall(
  { region: "europe-west3", secrets: [OPENROUTER_API_KEY] },
  async (request) => {
    // Verify user is authenticated
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
      throw new HttpsError(
        'failed-precondition',
        'OpenRouter API key not configured'
      );
    }

  try {
    const { prompt, systemPrompt } = request.data;
    
    const messages = [
      {
        role: 'user' as const,
        content: prompt
      }
    ];

    const response = await callOpenRouter(apiKey, {
      messages,
      systemInstruction: systemPrompt,
      model: 'google/gemini-2.5-flash-preview-09-2025',
      temperature: 0.3,
      max_tokens: 4000, // Increased to avoid truncation
      response_format: { type: 'json_object' }
    });

    // Extract and clean JSON from response
    const cleanedResponse = extractJSONFromResponse(response);
    const result = safeParseJSON(cleanedResponse);

    // Normalize to the expected schema for the frontend:
    // { companies: Company[], people: Person[] }
    const companiesRaw = (result as any)?.companies;
    const peopleRaw = (result as any)?.people;

    if (!Array.isArray(companiesRaw)) {
      throw new Error("Invalid AI response: 'companies' missing or not an array");
    }

    const normalized = {
      ...result,
      companies: companiesRaw.map((c: any) => ({
        ...c,
        id: String(c?.id ?? crypto.randomUUID()),
        name: String(c?.name ?? "Unnamed Company"),
        type: String(c?.type ?? "Unknown"),
        parentIds: Array.isArray(c?.parentIds) ? c.parentIds.map((x: any) => String(x)) : [],
      })),
      people: Array.isArray(peopleRaw)
        ? peopleRaw.map((p: any) => ({
            ...p,
            id: String(p?.id ?? crypto.randomUUID()),
            name: String(p?.name ?? "Unnamed Person"),
            role: String(p?.role ?? ""),
            companyId: String(p?.companyId ?? ""),
          }))
        : [],
    };

    return { success: true, data: normalized };
  } catch (error: any) {
    console.error('OpenRouter structure generation error:', error);
    console.error('Error stack:', error.stack);
    
    // Log the raw response if available for debugging
    if (error.message && error.message.includes('Response preview')) {
      console.error('Raw response preview included in error message');
    }
    
    throw new HttpsError(
      'internal',
      error.message || 'Failed to generate structure'
    );
  }
  }
);

// Cloud Function for memory extraction from conversations
export const extractMemoriesFromConversation = onCall(
  { region: "europe-west3", secrets: [OPENROUTER_API_KEY] },
  async (request) => {
    // Verify user is authenticated
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
      throw new HttpsError(
        'failed-precondition',
        'OpenRouter API key not configured'
      );
    }

    try {
      console.log('extractMemoriesFromConversation called', {
        userId: request.auth?.uid,
        messageCount: request.data?.messages?.length,
        chatType: request.data?.chatType
      });
      
      const { messages, chatType, structureData, existingMemories } = request.data;
      
      if (!messages || !Array.isArray(messages)) {
        console.error('Invalid request: messages array is required', { messages });
        throw new Error("Messages array is required");
      }

      // Build extraction prompt
      const existingMemoriesText = existingMemories && existingMemories.length > 0
        ? `\n\nExisting memories (avoid duplicates):\n${existingMemories.map((m: string) => `- ${m}`).join('\n')}`
        : '';

      const structureDataText = structureData
        ? `\n\nCurrent structure data:\n${JSON.stringify(structureData, null, 2)}`
        : '';

      const extractionPrompt = `You are analyzing a conversation about a ${chatType === 'business' ? 'business/strategic' : 'tax/legal'} consultation regarding a corporate or team structure.

${structureDataText}

Conversation:
${messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text || m.content}`).join('\n\n')}

${existingMemoriesText}

Your task: Extract ONLY the most critical facts from this conversation that are essential for future discussions. Be VERY selective.

Focus ONLY on:
- Critical decisions or commitments made
- Important structural facts that significantly impact advice
- Key constraints or requirements that affect future recommendations
- Essential relationships or ownership details

STRICTLY Filter out:
- Generic or obvious statements
- Temporary information
- Information already in existing memories
- Minor details or context
- Facts that are already clear from the structure data itself
- Redundant information

Return ONLY a JSON object in this exact format:
{
  "facts": [
    {
      "fact": "Brief, specific fact statement",
      "category": "corporate_structure|team_structure|decisions|preferences|constraints|relationships|other",
      "importance": 4-5,
      "tags": ["tag1", "tag2"]
    }
  ]
}

Importance scale (ONLY extract importance 4-5):
- 5: Critical information that fundamentally affects advice (e.g., "Company X must remain AZAV-certified", "Decision to expand to country Y")
- 4: Very important context that significantly impacts recommendations (e.g., "Preference for tax optimization over growth", "Constraint: no new entities")
- 3-1: DO NOT extract - these are not important enough

CRITICAL: Extract ONLY 1-3 most important facts (importance 4-5). If the conversation doesn't contain any facts of importance 4 or 5, return an empty facts array. Be extremely selective - quality over quantity.`;

      const extractionMessages = [
        {
          role: 'user' as const,
          content: extractionPrompt
        }
      ];

      const response = await callOpenRouter(apiKey, {
        messages: extractionMessages,
        model: 'google/gemini-2.5-flash-preview-09-2025',
        temperature: 0.3, // Lower temperature for consistent extraction
        max_tokens: 4000, // Increased to avoid truncation
        response_format: { type: 'json_object' }
      });

      // Extract and clean JSON from response
      const cleanedResponse = extractJSONFromResponse(response);
      const result = safeParseJSON(cleanedResponse);
      const facts = result.facts || [];

      // Validate and normalize facts
      const normalizedFacts = facts
        .filter((fact: any) => {
          // Only keep facts with actual content
          if (!fact.fact || fact.fact.trim().length === 0) return false;
          // Only keep high-importance facts (4-5)
          const importance = Math.max(1, Math.min(5, Number(fact.importance) || 3));
          return importance >= 4;
        })
        .map((fact: any) => ({
          fact: String(fact.fact).trim(),
          category: fact.category || 'other',
          importance: Math.max(4, Math.min(5, Number(fact.importance) || 4)), // Ensure minimum 4
          tags: Array.isArray(fact.tags) ? fact.tags.map((t: any) => String(t)) : []
        }));

      console.log('Memory extraction completed', {
        factsCount: normalizedFacts.length,
        facts: normalizedFacts.map((f: { fact: string; category: string; importance: number }) => ({ fact: f.fact.substring(0, 50) + '...', category: f.category, importance: f.importance }))
      });

      return { success: true, facts: normalizedFacts };
    } catch (error: any) {
      console.error('Memory extraction error:', error);
      console.error('Error stack:', error.stack);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        name: error.name
      });
      throw new HttpsError(
        'internal',
        error.message || 'Failed to extract memories'
      );
    }
  }
);

