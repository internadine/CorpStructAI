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

