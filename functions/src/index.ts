import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

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
export const openrouterChat = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Get API key from environment (set via: firebase functions:config:set openrouter.api_key="your_key")
  const apiKey = functions.config().openrouter?.api_key;
  if (!apiKey) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'OpenRouter API key not configured'
    );
  }

  try {
    const { messages, systemInstruction, model, temperature, max_tokens, response_format } = data;
    
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
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to get AI response'
    );
  }
});

// Cloud Function for structure generation
export const openrouterGenerateStructure = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const apiKey = functions.config().openrouter?.api_key;
  if (!apiKey) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'OpenRouter API key not configured'
    );
  }

  try {
    const { prompt, currentData, systemPrompt } = data;
    
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
    return { success: true, data: result };
  } catch (error: any) {
    console.error('OpenRouter structure generation error:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to generate structure'
    );
  }
});
