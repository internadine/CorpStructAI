import { CompanyType, StructureData } from "../types";
import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";

// Cloud Functions for OpenRouter API calls
const openrouterChatFunction = httpsCallable(functions, 'openrouterChat');
const openrouterGenerateStructureFunction = httpsCallable(functions, 'openrouterGenerateStructure');

export const generateStructureFromText = async (prompt: string, currentData: StructureData): Promise<StructureData> => {
  try {
    const systemPrompt = `Du bist ein Experte für Unternehmensstrukturen. Analysiere Anfragen und erstelle valides JSON.

Aktueller Struktur-Kontext:
${JSON.stringify(currentData)}

Aufgabe:
Analysiere die Anfrage und die aktuelle Struktur.
Erstelle ein VOLLSTÄNDIGES valides JSON-Objekt, das die NEUE komplette Struktur darstellt (Unternehmen und Personen).
Wenn der Nutzer etwas hinzufügen möchte, behalte die bestehenden Daten und füge die neuen hinzu.
Wenn der Nutzer eine komplett neue Struktur will, ignoriere den Kontext.

Wichtig:
- Ein Unternehmen kann mehrere Muttergesellschaften haben ('parentIds' array).
- 'parentIds' enthält die IDs der übergeordneten Holdings. Wenn keine Muttergesellschaft, ist das Array leer.
- IDs müssen eindeutige Strings sein.

Erlaubte Unternehmenstypen ('type'): ${Object.values(CompanyType).join(', ')}.

Antworte NUR mit einem gültigen JSON-Objekt im folgenden Format:
{
  "companies": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "parentIds": ["string"],
      "description": "string (optional)"
    }
  ],
  "people": [
    {
      "id": "string",
      "name": "string",
      "role": "string",
      "companyId": "string"
    }
  ]
}`;

    const result = await openrouterGenerateStructureFunction({
      prompt,
      currentData,
      systemPrompt
    });

    const data = (result.data as any).data as StructureData;
    
    // Validate structure
    if (!data.companies || !Array.isArray(data.companies)) {
      throw new Error("Ungültige Antwort: companies fehlt oder ist kein Array");
    }
    if (!data.people || !Array.isArray(data.people)) {
      throw new Error("Ungültige Antwort: people fehlt oder ist kein Array");
    }

    return data;

  } catch (error) {
    console.error("OpenRouter API Fehler:", error);
    throw error;
  }
};

export const chatCompletion = async (
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  systemInstruction?: string
): Promise<string> => {
  try {
    const result = await openrouterChatFunction({
      messages,
      systemInstruction,
      model: 'google/gemini-2.5-flash-preview-09-2025',
      temperature: 0.7,
      max_tokens: 2000
    });

    return (result.data as any).content;

  } catch (error) {
    console.error("OpenRouter API Fehler:", error);
    throw error;
  }
};
