import { GoogleGenAI, Type } from "@google/genai";
import { CompanyType, StructureData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStructureFromText = async (prompt: string, currentData: StructureData): Promise<StructureData> => {
  try {
    const modelId = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `
        Aktueller Struktur-Kontext:
        ${JSON.stringify(currentData)}
        
        Benutzeranfrage:
        ${prompt}
        
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
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  parentIds: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Liste der IDs der Muttergesellschaften"
                  },
                  description: { type: Type.STRING, nullable: true }
                },
                required: ["id", "name", "type", "parentIds"]
              }
            },
            people: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  companyId: { type: Type.STRING }
                },
                required: ["id", "name", "role", "companyId"]
              }
            }
          },
          required: ["companies", "people"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Keine Antwort von der KI");

    const result = JSON.parse(text) as StructureData;
    return result;

  } catch (error) {
    console.error("Gemini API Fehler:", error);
    throw error;
  }
};
