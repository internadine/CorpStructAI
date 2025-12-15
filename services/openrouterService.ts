import { CompanyType, StructureData, ProjectType } from "../types";
import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";

// Cloud Functions for OpenRouter API calls
const openrouterChatFunction = httpsCallable(functions, 'openrouterChat');
const openrouterGenerateStructureFunction = httpsCallable(functions, 'openrouterGenerateStructure');

// Context-aware prompt generation based on project type
const getSystemPromptForProjectType = (projectType?: ProjectType): string => {
  const basePrompt = `Du bist ein Experte für Strukturplanung. Analysiere Anfragen und erstelle valides JSON.

Aktueller Struktur-Kontext:
{currentData}

Aufgabe:
Analysiere die Anfrage und die aktuelle Struktur.
Erstelle ein VOLLSTÄNDIGES valides JSON-Objekt, das die NEUE komplette Struktur darstellt (Unternehmen und Personen).
Wenn der Nutzer etwas hinzufügen möchte, behalte die bestehenden Daten und füge die neuen hinzu.
Wenn der Nutzer eine komplett neue Struktur will, ignoriere den Kontext.

Wichtig:
- Ein Unternehmen kann mehrere Muttergesellschaften haben ('parentIds' array).
- 'parentIds' enthält die IDs der übergeordneten Holdings. Wenn keine Muttergesellschaft, ist das Array leer.
- IDs müssen eindeutige Strings sein.

Erlaubte Unternehmenstypen ('type'): ${Object.values(CompanyType).join(', ')}.`;

  const contextMap: Record<ProjectType, { terminology: string; focus: string; example: string }> = {
    [ProjectType.CORPORATE_STRUCTURE]: {
      terminology: "Unternehmen, Firmen, Geschäftsführer, Mitarbeiter",
      focus: "Unternehmensstrukturen, Holdings, Beteiligungsverhältnisse",
      example: "Erstelle eine Holding Alpha, die Beta GmbH besitzt. Max Mustermann ist Geschäftsführer der Alpha."
    },
    [ProjectType.TEAM_STRUCTURE]: {
      terminology: "Teams, Abteilungen, Team-Mitglieder, Teamleiter",
      focus: "Team-Hierarchien, Scrum-Teams, Abteilungsstrukturen, Reporting-Lines",
      example: "Erstelle ein Engineering-Team mit Frontend- und Backend-Subteams. Sarah ist Teamleiterin."
    },
    [ProjectType.M_A_SCENARIOS]: {
      terminology: "Unternehmen, Akquisitionen, Fusionen, Zielgesellschaften",
      focus: "M&A-Strukturen, Übernahme-Szenarien, Integration, Synergien",
      example: "Erstelle eine Struktur für die Übernahme von Beta GmbH durch Alpha Holding."
    },
    [ProjectType.STARTUP_EQUITY]: {
      terminology: "Unternehmen, Gründer, Investoren, Equity-Holder",
      focus: "Cap-Tables, Equity-Verteilung, Funding-Runden, Option-Pools",
      example: "Erstelle eine Startup-Struktur mit 3 Gründern (je 30%) und einem Investor (10%)."
    },
    [ProjectType.FAMILY_BUSINESS]: {
      terminology: "Unternehmen, Familienmitglieder, Generationen, Nachfolger",
      focus: "Familienstrukturen, Nachfolgeplanung, Generationenübergang",
      example: "Erstelle eine Familienstruktur mit 2 Generationen: Vater als GF, Sohn als Nachfolger."
    },
    [ProjectType.COMPLIANCE_GOVERNANCE]: {
      terminology: "Unternehmen, Vorstände, Aufsichtsräte, Compliance-Officer",
      focus: "Governance-Strukturen, Compliance, Board-Strukturen",
      example: "Erstelle eine Governance-Struktur mit Vorstand und Aufsichtsrat."
    },
    [ProjectType.INTERNATIONAL_STRUCTURE]: {
      terminology: "Unternehmen, Tochtergesellschaften, Länder, Standorte",
      focus: "Internationale Strukturen, Cross-Border, Multi-Jurisdiktion",
      example: "Erstelle eine internationale Struktur mit Holding in Deutschland und Tochtergesellschaften in USA und UK."
    },
    [ProjectType.PARTNERSHIP_JV]: {
      terminology: "Partnerschaften, Joint Ventures, Partner, Beteiligungen",
      focus: "Partnership-Strukturen, Joint Ventures, strategische Allianzen",
      example: "Erstelle eine Joint-Venture-Struktur zwischen Alpha GmbH und Beta Corp (50/50)."
    },
    [ProjectType.INVESTMENT_FUND]: {
      terminology: "Fonds, LPs, GPs, Portfolio-Unternehmen",
      focus: "Fund-Strukturen, LP/GP-Beziehungen, Portfolio-Management",
      example: "Erstelle eine Fund-Struktur mit GP und mehreren LPs sowie Portfolio-Unternehmen."
    },
    [ProjectType.NONPROFIT]: {
      terminology: "Organisationen, Programme, Vorstände, Mitglieder",
      focus: "Non-Profit-Strukturen, Programme, Governance",
      example: "Erstelle eine Non-Profit-Struktur mit Vorstand und verschiedenen Programmen."
    },
    [ProjectType.REAL_ESTATE]: {
      terminology: "Immobilien-Gesellschaften, Properties, Verwaltung, Assets",
      focus: "Immobilien-Strukturen, Property-Holdings, Asset-Management",
      example: "Erstelle eine Immobilien-Struktur mit Holding und mehreren Property-Gesellschaften."
    }
  };

  const context = projectType ? contextMap[projectType] : contextMap[ProjectType.CORPORATE_STRUCTURE];
  
  return `${basePrompt}

Kontext für diesen Projekttyp:
- Terminologie: ${context.terminology}
- Fokus: ${context.focus}
- Beispiel: ${context.example}

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
};

export const generateStructureFromText = async (
  prompt: string, 
  currentData: StructureData, 
  projectType?: ProjectType
): Promise<StructureData> => {
  try {
    const baseSystemPrompt = getSystemPromptForProjectType(projectType);
    const systemPrompt = baseSystemPrompt.replace('{currentData}', JSON.stringify(currentData));

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

// Get context-aware system instruction for Business Consultant Chat
export const getBusinessConsultantSystemInstruction = (
  companyDetails: any[],
  projectType?: ProjectType,
  country?: string
): string => {
  const countryContext = country 
    ? `IMPORTANT: Provide business and strategic advice considering the business environment, tax implications, and legal framework of ${country}. Consider local market conditions, regulations, and best practices for ${country}.`
    : '';

  const baseInstruction = `You are an experienced consultant with expertise in structure analysis and strategic consulting.

Your client shows you the following structure with detailed information:
${JSON.stringify(companyDetails, null, 2)}

${countryContext}

Your task is to:
1. Analyze and understand the structure
2. Identify opportunities and synergies
3. Highlight potential
4. Provide strategic recommendations
5. Assess risks and opportunities
6. Develop concrete action recommendations

Consider:
- The business purposes/purposes of the individual units
- Available financial resources
- Company resources (buildings, etc.)
- Key personnel and their roles
- Ownership relationships and structure
- Potential synergies between units

Answer strategically, practically, and with concrete action recommendations in English.
Refer specifically to the names of units and their specific situations.`;

  const contextMap: Record<ProjectType, { focus: string; terminology: string }> = {
    [ProjectType.CORPORATE_STRUCTURE]: {
      focus: "steuerliche Optimierung, rechtliche Strukturen, Unternehmenswert, Wachstumsstrategien",
      terminology: "Firmen, Unternehmen, Geschäftsführer, Beteiligungen"
    },
    [ProjectType.TEAM_STRUCTURE]: {
      focus: "Team-Skalierung, Kommunikationswege, Team-Zusammensetzung, Agile-Praktiken, Ressourcenallokation",
      terminology: "Teams, Abteilungen, Team-Mitglieder, Teamleiter, Scrum-Master"
    },
    [ProjectType.M_A_SCENARIOS]: {
      focus: "Integration, Synergien, Risiken, Due Diligence, Post-Merger-Integration",
      terminology: "Akquisitionen, Zielgesellschaften, Übernahme, Fusion"
    },
    [ProjectType.STARTUP_EQUITY]: {
      focus: "Equity-Strukturen, Dilution, Investor-Relations, Cap-Table-Management, Exit-Strategien",
      terminology: "Gründer, Investoren, Equity, Anteile, Option-Pools"
    },
    [ProjectType.FAMILY_BUSINESS]: {
      focus: "Nachfolgeplanung, Generationenübergang, Konfliktlösung, Governance, Familienharmonie",
      terminology: "Familienmitglieder, Generationen, Nachfolger, Erben"
    },
    [ProjectType.COMPLIANCE_GOVERNANCE]: {
      focus: "Compliance-Anforderungen, Governance-Best-Practices, Risikomanagement, Regulatorische Anforderungen",
      terminology: "Vorstände, Aufsichtsräte, Compliance-Officer, Governance"
    },
    [ProjectType.INTERNATIONAL_STRUCTURE]: {
      focus: "Internationale Steueroptimierung, Transfer-Pricing, Regulatorische Compliance, Cross-Border-Risiken",
      terminology: "Tochtergesellschaften, Standorte, Länder, Jurisdiktionen"
    },
    [ProjectType.PARTNERSHIP_JV]: {
      focus: "Partnership-Dynamik, Profit-Sharing, Entscheidungsfindung, Risikoverteilung, Exit-Strategien",
      terminology: "Partner, Joint Ventures, Beteiligungen, Allianzen"
    },
    [ProjectType.INVESTMENT_FUND]: {
      focus: "Fund-Performance, LP-Relations, Portfolio-Optimierung, Distribution-Strategien, Waterfall-Strukturen",
      terminology: "Fonds, LPs, GPs, Portfolio-Unternehmen"
    },
    [ProjectType.NONPROFIT]: {
      focus: "Programm-Effektivität, Fundraising, Governance, Compliance, Impact-Messung",
      terminology: "Organisationen, Programme, Vorstände, Mitglieder"
    },
    [ProjectType.REAL_ESTATE]: {
      focus: "Asset-Optimierung, Steueroptimierung, Property-Management, Portfolio-Diversifikation, Wertsteigerung",
      terminology: "Immobilien-Gesellschaften, Properties, Verwaltung, Assets"
    }
  };

  const context = projectType ? contextMap[projectType] : contextMap[ProjectType.CORPORATE_STRUCTURE];
  
  return `${baseInstruction}

Spezifischer Kontext für diesen Projekttyp:
- Terminologie: ${context.terminology}
- Fokusbereiche: ${context.focus}

Konzentriere dich besonders auf die oben genannten Fokusbereiche bei deiner Beratung.`;
};
