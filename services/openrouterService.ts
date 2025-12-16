import { CompanyType, StructureData, ProjectType } from "../types";
import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";

// Cloud Functions for OpenRouter API calls
const openrouterChatFunction = httpsCallable(functions, 'openrouterChat');
const openrouterGenerateStructureFunction = httpsCallable(functions, 'openrouterGenerateStructure');

// Context-aware prompt generation based on project type
const getSystemPromptForProjectType = (projectType?: ProjectType): string => {
  const isCorporateStructure = !projectType || projectType === ProjectType.CORPORATE_STRUCTURE;
  const parentTerm = isCorporateStructure ? 'übergeordneten Holdings' : 'übergeordneten Einheiten';
  
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
- 'parentIds' enthält die IDs der ${parentTerm}. Wenn keine Muttergesellschaft, ist das Array leer.
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
    },
    [ProjectType.PRINCE2_PROJECT]: {
      terminology: "Projektphasen, Work Packages, Produkte, Deliverables, Projektmanager, Team Manager",
      focus: "PRINCE2 Projektstruktur, Stages, Work Packages, Management Products, Project Board",
      example: "Erstelle eine PRINCE2 Projektstruktur mit Initiating Stage, mehreren Work Packages und einem Project Board."
    },
    [ProjectType.PSMI_PROJECT]: {
      terminology: "Projektphasen, Meilensteine, Deliverables, Work Packages, Stakeholder-Gruppen",
      focus: "PSMI Projektstruktur, Phasen, Meilensteine, Deliverables, Stakeholder-Management",
      example: "Erstelle eine PSMI Projektstruktur mit Planungsphase, mehreren Work Packages und Stakeholder-Gruppen."
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
  country?: string,
  memoryContext?: string
): string => {
  const countryContext = country 
    ? `IMPORTANT: Provide business and strategic advice considering the business environment, tax implications, and legal framework of ${country}. Consider local market conditions, regulations, and best practices for ${country}.`
    : '';

  const memorySection = memoryContext && memoryContext.trim()
    ? `\n\n${memoryContext}\n\nUse this context from previous discussions to avoid repetition and build upon established facts.`
    : '';

  const baseInstruction = `You are an experienced consultant with expertise in structure analysis and strategic consulting.

Your client shows you the following structure with detailed information:
${JSON.stringify(companyDetails, null, 2)}

${countryContext}${memorySection}

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
    },
    [ProjectType.PRINCE2_PROJECT]: {
      focus: "Projektphasen-Management, Work Package-Planung, Risikomanagement, Quality Management, Change Control",
      terminology: "Projektphasen, Work Packages, Produkte, Deliverables, Projektmanager, Team Manager, Project Board"
    },
    [ProjectType.PSMI_PROJECT]: {
      focus: "Projektphasen-Planung, Meilenstein-Management, Deliverable-Tracking, Stakeholder-Engagement, Ressourcenplanung",
      terminology: "Projektphasen, Meilensteine, Deliverables, Work Packages, Stakeholder-Gruppen, Projektmanager"
    }
  };

  const context = projectType ? contextMap[projectType] : contextMap[ProjectType.CORPORATE_STRUCTURE];
  
  return `${baseInstruction}

Spezifischer Kontext für diesen Projekttyp:
- Terminologie: ${context.terminology}
- Fokusbereiche: ${context.focus}

Konzentriere dich besonders auf die oben genannten Fokusbereiche bei deiner Beratung.`;
};

// Simple language detection from text
const detectLanguage = (text: string): string => {
  if (!text || text.trim().length === 0) return 'English';
  
  const lowerText = text.toLowerCase();
  
  // Count language-specific words to determine the most likely language
  const germanWords = (lowerText.match(/\b(der|die|das|und|oder|für|mit|von|zu|ist|sind|wird|werden|können|sollte|möchte|ich|du|wir|sie|dass|wenn|aber|auch|nicht|sein|haben|werden|können|müssen|sollen|dürfen|mögen|wollen|akquirieren|medienunternehmen|konsulting|beratung|geschäftsführung|organisationen|aufgaben|übernehmen)\b/g) || []).length;
  const frenchWords = (lowerText.match(/\b(le|la|les|et|ou|pour|avec|de|à|est|sont|sera|seront|peuvent|devrait|je|tu|nous|ils|elle|dans|sur|par|une|un|des|être|avoir|faire|aller|vouloir|pouvoir|devoir)\b/g) || []).length;
  const spanishWords = (lowerText.match(/\b(el|la|los|las|y|o|para|con|de|es|son|será|serán|pueden|debería|yo|tú|nosotros|ellos|ella|en|por|un|una|ser|estar|tener|hacer|ir|querer|poder|deber)\b/g) || []).length;
  const italianWords = (lowerText.match(/\b(il|la|lo|gli|le|e|o|per|con|di|è|sono|sarà|saranno|possono|dovrebbe|io|tu|noi|loro|ella|in|su|da|un|una|essere|avere|fare|andare|volere|potere|dovere)\b/g) || []).length;
  
  // German-specific characters and patterns
  const hasGermanChars = /[äöüÄÖÜß]/.test(text);
  
  // Determine language based on word count and special characters
  if (hasGermanChars || germanWords >= 3) {
    return 'German';
  }
  if (frenchWords >= 3) {
    return 'French';
  }
  if (spanishWords >= 3) {
    return 'Spanish';
  }
  if (italianWords >= 3) {
    return 'Italian';
  }
  
  // If we found some German words but no special chars, still likely German
  if (germanWords >= 2) {
    return 'German';
  }
  
  // Default to English
  return 'English';
};

// Get system instruction for Tax/Legal Chat
export const getTaxLegalSystemInstruction = (
  structureData: StructureData,
  country?: string,
  memoryContext?: string,
  userMessage?: string
): string => {
  const countryContext = country 
    ? `IMPORTANT: Provide tax and legal advice specifically for ${country}. Consider the local tax laws, legal framework, and regulatory requirements of ${country}.`
    : 'IMPORTANT: Provide general tax and legal advice. If specific country context is needed, ask the user to specify the country.';

  const memorySection = memoryContext && memoryContext.trim()
    ? `\n\n${memoryContext}\n\nUse this context from previous discussions to avoid repetition and build upon established facts.`
    : '';

  // Detect language from user message
  const responseLanguage = userMessage ? detectLanguage(userMessage) : 'English';
  
  // Language-specific instructions
  const languageInstructions = responseLanguage === 'German' 
    ? `IMPORTANT: Answer in German (Deutsch). Use German business terminology:
- "Consulting" should be translated to "Beratung"
- "AI Consulting" should be "KI-Beratung" or "KI Consulting"
- "Consulting Services" should be "Beratungsdienstleistungen"
- Use proper German grammar and professional business language.`
    : responseLanguage === 'French'
    ? `IMPORTANT: Answer in French. Use French business terminology:
- "Consulting" should be translated to "Conseil"
- "AI Consulting" should be "Conseil en IA"
- "Consulting Services" should be "Services de conseil"`
    : responseLanguage === 'Spanish'
    ? `IMPORTANT: Answer in Spanish. Use Spanish business terminology:
- "Consulting" should be translated to "Consultoría"
- "AI Consulting" should be "Consultoría en IA"
- "Consulting Services" should be "Servicios de consultoría"`
    : responseLanguage === 'Italian'
    ? `IMPORTANT: Answer in Italian. Use Italian business terminology:
- "Consulting" should be translated to "Consulenza"
- "AI Consulting" should be "Consulenza AI"
- "Consulting Services" should be "Servizi di consulenza"`
    : `IMPORTANT: Answer in English. Use standard business terminology.`;

  return `
You are an experienced business lawyer and tax advisor${country ? ` specializing in ${country} law and taxation` : ''}.
Your client shows you the following company structure (JSON format):
${JSON.stringify(structureData)}

${countryContext}${memorySection}

${languageInstructions}

Your task is to answer questions about this structure, identify risks (e.g. hidden profit distribution, organizational integration, liability) and suggest optimizations.
Answer precisely, professionally, but understandably in ${responseLanguage}.
Refer specifically to the names of companies and people in the structure.

FORMATTING REQUIREMENTS:
- Use proper Markdown table formatting for any tables or structured data
- Tables MUST use proper Markdown syntax with:
  1. A header row with column names
  2. A separator row with dashes (at least 3 dashes per column)
  3. Data rows with matching number of columns
- Example of CORRECT table format:
  | Column 1 | Column 2 | Column 3 |
  |----------|----------|----------|
  | Data 1   | Data 2   | Data 3   |
  | Data 4   | Data 5   | Data 6   |
- NEVER use malformed tables like: | Col1 | Col2 || ---|---|---||
- ALWAYS include the separator row between header and data
- Use headers, bold text (**text**), and lists appropriately for clarity
- Ensure all tables are complete with all rows properly formatted
  `.trim();
};

