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
      max_tokens: request.max_tokens ?? 2000,
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
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response);

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
      const { messages, chatType, structureData, existingMemories } = request.data;
      
      if (!messages || !Array.isArray(messages)) {
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

Your task: Extract important facts from this conversation that should be remembered for future discussions. Focus on:
- Specific facts about the corporate/team structure
- Decisions made or preferences stated
- Constraints or requirements mentioned
- Relationships between entities
- Important context that would be useful in future conversations

Filter out:
- Generic or obvious statements
- Temporary information
- Information already in existing memories

Return ONLY a JSON object in this exact format:
{
  "facts": [
    {
      "fact": "Brief, specific fact statement",
      "category": "corporate_structure|team_structure|decisions|preferences|constraints|relationships|other",
      "importance": 1-5,
      "tags": ["tag1", "tag2"]
    }
  ]
}

Importance scale:
- 5: Critical information that must be remembered
- 4: Very important context
- 3: Moderately important
- 2: Somewhat relevant
- 1: Minor detail

Extract 3-10 most important facts. Be selective and focus on actionable, specific information.`;

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
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response);
      const facts = result.facts || [];

      // Validate and normalize facts
      const normalizedFacts = facts
        .filter((fact: any) => fact.fact && fact.fact.trim().length > 0)
        .map((fact: any) => ({
          fact: String(fact.fact).trim(),
          category: fact.category || 'other',
          importance: Math.max(1, Math.min(5, Number(fact.importance) || 3)),
          tags: Array.isArray(fact.tags) ? fact.tags.map((t: any) => String(t)) : []
        }));

      return { success: true, facts: normalizedFacts };
    } catch (error: any) {
      console.error('Memory extraction error:', error);
      throw new HttpsError(
        'internal',
        error.message || 'Failed to extract memories'
      );
    }
  }
);

