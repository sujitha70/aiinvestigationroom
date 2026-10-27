const { GoogleGenerativeAI } = require("@google/generative-ai");
const { z } = require("zod");

// Difficulty requirements matrix
const DIFFICULTY_CONFIG = {
  easy: { suspects: 3, clues: 5, hints: 2 },
  medium: { suspects: 4, clues: 7, hints: 3 },
  hard: { suspects: 5, clues: 9, hints: 3 },
};

// Zod Schema for AI Output Validation
const GeminiMysterySchema = z.object({
  title: z.string().min(3),
  story: z.string().min(50),
  suspects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      role: z.string(),
      publicMotive: z.string(),
      alibi: z.string(),
      isCulprit: z.boolean(),
    })
  ),
  clues: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      relevance: z.string().optional(),
    })
  ),
  hints: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
  solution: z.object({
    culpritId: z.string(),
    culpritName: z.string(),
    explanation: z.string(),
    motive: z.string(),
    timeline: z.array(
      z.object({
        time: z.string(),
        event: z.string(),
      })
    ),
  }),
});

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "your_gemini_api_key") {
      this.client = new GoogleGenerativeAI(apiKey);
    } else {
      this.client = null;
    }
  }

  async generateCase(premise, difficulty = "medium") {
    const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;

    if (!this.client) {
      console.warn(
        "[GeminiService] GEMINI_API_KEY not configured. Generating context-tailored procedural case."
      );
      return this.generateProceduralCase(premise, difficulty, config);
    }

    try {
      const modelName = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

      const prompt = `You are the Master AI Mystery Architect.
Generate a complete, solvable fictional detective mystery based on this premise:
"${premise}"

SPECIFICATIONS:
- Difficulty Level: ${difficulty.toUpperCase()}
- Exactly ${config.suspects} Suspects
- Exactly ${config.clues} Clues
- Exactly ${config.hints} Hints

RULES:
1. Exactly ONE suspect must have isCulprit: true, and their ID and name must match solution.culpritId and solution.culpritName.
2. Clues must provide enough logical breadcrumbs to deduce the culprit while including plausible red herrings.
3. Every hint must give a progressive investigative clue without directly giving away the culprit's name.
4. Keep the timeline coherent and consistent.

RETURN STRICT JSON conforming to this schema:
{
  "title": "A Compelling Mystery Title",
  "story": "Detailed story synopsis describing the crime or incident, setting the stage for the detective.",
  "suspects": [
    {
      "id": "suspect-1",
      "name": "Full Fictional Name",
      "role": "Their occupation or relationship",
      "publicMotive": "What tension or apparent motive is known to the investigator",
      "alibi": "Where they claim they were",
      "isCulprit": true or false
    }
  ],
  "clues": [
    {
      "id": "clue-1",
      "title": "Name of Clue / Evidence Item",
      "description": "Specific detail discovered upon examining this evidence",
      "relevance": "How this relates to alibis or crime scene"
    }
  ],
  "hints": [
    {
      "id": "hint-1",
      "text": "Guidance on how to connect two clues or examine an alibi"
    }
  ],
  "solution": {
    "culpritId": "matching suspect-id",
    "culpritName": "matching suspect name",
    "explanation": "Comprehensive detective breakdown explaining how the clues logically prove their guilt and disprove their alibi.",
    "motive": "The real hidden motive behind the crime.",
    "timeline": [
      { "time": "11:30 PM", "event": "Action description" }
    ]
  }
}`;

      // Try primary model, with fallback candidate if 503/busy
      const defaultModel = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
      const candidateModels = Array.from(new Set([defaultModel, "gemini-3-flash-preview", "gemini-3.5-flash"]));
      let response = null;

      for (const currentModel of candidateModels) {
        try {
          const model = this.client.getGenerativeModel({
            model: currentModel,
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
            },
          });
          const generatePromise = model.generateContent(prompt);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout after 16s")), 16000)
          );
          response = await Promise.race([generatePromise, timeoutPromise]);
          if (response) {
            console.log(`[GeminiService] Successfully generated case using AI model: ${currentModel}`);
            break;
          }
        } catch (mErr) {
          console.warn(`[GeminiService] Model ${currentModel} error: ${mErr.message}, trying next candidate...`);
        }
      }

      if (!response) {
        throw new Error("All Gemini models temporarily busy");
      }

      const text = response.response.text();
      let parsed = JSON.parse(text);

      // Validate schema
      const validation = GeminiMysterySchema.safeParse(parsed);
      if (validation.success) {
        return validation.data;
      }

      console.warn(
        "[GeminiService] AI Output had schema discrepancies, attempting repair..."
      );
      // Ensure culprit sync
      if (parsed.solution && parsed.solution.culpritId && Array.isArray(parsed.suspects)) {
        parsed.suspects.forEach((s) => {
          s.isCulprit = s.id === parsed.solution.culpritId;
        });
      }

      return parsed;
    } catch (err) {
      console.error("[GeminiService] Error during generation:", err);
      return this.generateProceduralCase(premise, difficulty, config);
    }
  }

  generateProceduralCase(premise, difficulty, config) {
    const titleSeed = premise.length > 35 ? premise.slice(0, 35) + "..." : premise;
    const suspects = [
      {
        id: "suspect-1",
        name: "Arthur Pendelton",
        role: "Estate Steward & Archivist",
        publicMotive: "Bitter dispute over inheritance and family artifacts",
        alibi: "Claims he was cataloging archives in the library from 10 PM to midnight",
        isCulprit: false,
      },
      {
        id: "suspect-2",
        name: "Vivian Sterling",
        role: "Senior Appraiser",
        publicMotive: "Facing imminent financial ruin from fraudulent certificates",
        alibi: "Claims she stepped into the courtyard to take an urgent phone call",
        isCulprit: true,
      },
      {
        id: "suspect-3",
        name: "Damian Cross",
        role: "Private Security Specialist",
        publicMotive: "Reprimanded for protocol failure and had access to passcodes",
        alibi: "Stationed at the outer perimeter gate console",
        isCulprit: false,
      },
      {
        id: "suspect-4",
        name: "Claire Moreau",
        role: "Visiting Research Fellow",
        publicMotive: "Published controversial thesis on the disputed provenance",
        alibi: "Drafting notes in the dining room with headphones on",
        isCulprit: false,
      },
      {
        id: "suspect-5",
        name: "Gerald Finch",
        role: "Maintenance Engineer",
        publicMotive: "Denied severance package earlier that morning",
        alibi: "Testing backup generator breakers in the basement sub-level",
        isCulprit: false,
      },
    ].slice(0, config.suspects);

    // Make sure suspect-2 is culprit unless suspects < 2
    const culprit = suspects[1] || suspects[0];
    culprit.isCulprit = true;
    suspects.forEach((s) => {
      if (s.id !== culprit.id) s.isCulprit = false;
    });

    const allClues = [
      {
        id: "clue-1",
        title: "Courtyard Mud Footprints",
        description:
          "High-end designer heel impressions found in the muddy courtyard soil leading toward the side fire escape.",
        relevance: "Matches Vivian Sterling's custom Italian footwear.",
      },
      {
        id: "clue-2",
        title: "Security Access Console Log",
        description:
          "Terminal indicates Door 4B was opened via guest RFID pass at 11:24 PM, not a security master card.",
        relevance: "Disproves security chief Damian Cross's involvement.",
      },
      {
        id: "clue-3",
        title: "Torn Silk Fabric Scrap",
        description:
          "A small shred of navy silk snagged on the window latch of the second-floor gallery.",
        relevance: "Vivian was wearing a navy silk wrap during the evening.",
      },
      {
        id: "clue-4",
        title: "Encrypted Cellular Message",
        description:
          "Message fragment sent at 11:15 PM reading: 'The buyer is waiting at the docks at midnight.'",
        relevance: "Points to an immediate planned sale of the target item.",
      },
      {
        id: "clue-5",
        title: "Library Dust Pattern",
        description:
          "Heavy dust on the library threshold undisturbed; the catalog log was pre-dated by three hours.",
        relevance: "Arthur Pendelton's alibi of being in the library was fabricated to hide his drunkenness, but he didn't commit the crime.",
      },
      {
        id: "clue-6",
        title: "Basement Electrical Meter",
        description:
          "Voltage logs confirm the breaker was tripped manually from the main floor breaker panel, not the basement.",
        relevance: "Finch was indeed in the basement trying to restore power.",
      },
      {
        id: "clue-7",
        title: "Smudged Perfume Scent",
        description:
          "Faint scent of rare Bulgarian Rose lingered near the opened display cabinet.",
        relevance: "Vivian was known exclusively for wearing custom Bulgarian Rose fragrance.",
      },
      {
        id: "clue-8",
        title: "Dining Room Audio Recording",
        description:
          "Voice recorder captured continuous typing sounds in the dining room between 10:30 PM and 11:45 PM.",
        relevance: "Corroborates Claire Moreau's typing alibi.",
      },
      {
        id: "clue-9",
        title: "Discarded Latex Glove in Planter",
        description:
          "A surgical glove found in an ornamental planter bearing micro-traces of antique lacquer polish.",
        relevance: "Recovered from the path between the courtyard and Vivian's assigned guest room.",
      },
    ].slice(0, config.clues);

    const hints = [
      {
        id: "hint-1",
        text: "Compare the footwear evidence found near the courtyard with the attire worn by the suspects during the incident.",
      },
      {
        id: "hint-2",
        text: "Notice which suspect claimed to be outside taking a phone call at the precise moment the courtyard fire escape was accessed.",
      },
      {
        id: "hint-3",
        text: "The scent and silk fiber left at the scene directly contradict Vivian's claim of having never entered the inner gallery.",
      },
    ].slice(0, config.hints);

    return {
      title: `The Mystery of ${titleSeed}`,
      story: `An urgent investigation has commenced following the incident: "${premise}". At approximately 11:20 PM, security was breached and critical evidence was disturbed. Multiple individuals were present within the perimeter, each harboring hidden tensions and conflicting accounts. The investigator must examine the physical clues, interview the suspects, and unmask the true culprit.`,
      difficulty,
      suspects,
      clues: allClues,
      hints,
      solution: {
        culpritId: culprit.id,
        culpritName: culprit.name,
        explanation: `Vivian Sterling claimed she stepped into the courtyard merely to take a private phone call. However, the footprint impression in the courtyard mud, the torn navy silk fabric matching her evening wrap, and the distinctive scent of Bulgarian Rose near the broken display case conclusively place her at the scene. Furthermore, the guest RFID card logged at Door 4B confirms she entered the private corridor during the blackout window.`,
        motive:
          "Facing exposure for circulating counterfeit certificates, she orchestrated the theft to sell the genuine piece to a private black-market collector.",
        timeline: [
          {
            time: "11:15 PM",
            event: "Vivian sends encrypted message confirming midnight dock handover.",
          },
          {
            time: "11:20 PM",
            event: "Vivian excuses herself to the courtyard under the guise of an urgent call.",
          },
          {
            time: "11:24 PM",
            event: "Vivian enters Door 4B via guest RFID pass and bypasses the display latch.",
          },
          {
            time: "11:35 PM",
            event: "Vivian returns to the parlor before the alarm is sounded.",
          },
        ],
      },
    };
  }
}

module.exports = new GeminiService();
