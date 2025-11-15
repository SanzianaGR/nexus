import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "../utils/storage";

// Fallback puzzles in case Gemini API fails
const FALLBACK_PUZZLES = {
  romanian_beginner: {
    nodes: [
      { id: "1", word: "pisica", translation: "cat", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "mamifer",
        translation: "mammal",
        hidden: true,
        hints: ["Warm-blooded vertebrate", "Has fur", "mamifer"],
      },
      { id: "3", word: "câine", translation: "dog", hidden: false },
      { id: "4", word: "casa", translation: "house", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "grădină",
        translation: "garden",
        hidden: true,
        hints: ["Outside space with plants", "Where flowers grow", "grădină"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "este un",
        hidden: false,
      },
      {
        id: "e3-2",
        source: "3",
        target: "2",
        relationship: "este un",
        hidden: false,
      },
      {
        id: "e1-4",
        source: "1",
        target: "4",
        relationship: "???",
        answer: "locuiește în",
        hidden: true,
        hints: ["Lives in", "Where cat stays", "locuiește în"],
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "are",
        hidden: false,
      },
    ],
    theme: "animals",
    difficulty: "beginner",
  },
  spanish_beginner: {
    nodes: [
      { id: "1", word: "gato", translation: "cat", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "animal",
        translation: "animal",
        hidden: true,
        hints: ["A living creature", "Cats are this", "animal"],
      },
      { id: "3", word: "perro", translation: "dog", hidden: false },
      { id: "4", word: "casa", translation: "house", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "jardín",
        translation: "garden",
        hidden: true,
        hints: ["Outside space", "Has plants", "jardín"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "es un",
        hidden: false,
      },
      {
        id: "e3-2",
        source: "3",
        target: "2",
        relationship: "es un",
        hidden: false,
      },
      {
        id: "e1-4",
        source: "1",
        target: "4",
        relationship: "???",
        answer: "vive en",
        hidden: true,
        hints: ["Lives in", "Where cat stays", "vive en"],
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "tiene",
        hidden: false,
      },
    ],
    theme: "animals",
    difficulty: "beginner",
  },
  french_beginner: {
    nodes: [
      { id: "1", word: "chat", translation: "cat", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "mammifère",
        translation: "mammal",
        hidden: true,
        hints: ["Warm-blooded", "Has fur", "mammifère"],
      },
      { id: "3", word: "chien", translation: "dog", hidden: false },
      { id: "4", word: "maison", translation: "house", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "jardin",
        translation: "garden",
        hidden: true,
        hints: ["Outside space", "Has plants", "jardin"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "est un",
        hidden: false,
      },
      {
        id: "e3-2",
        source: "3",
        target: "2",
        relationship: "est un",
        hidden: false,
      },
      {
        id: "e1-4",
        source: "1",
        target: "4",
        relationship: "???",
        answer: "vit dans",
        hidden: true,
        hints: ["Lives in", "Where cat stays", "vit dans"],
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "a un",
        hidden: false,
      },
    ],
    theme: "animals",
    difficulty: "beginner",
  },
};

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePuzzle = async (
    language,
    difficulty,
    theme = "general vocabulary"
  ) => {
    setLoading(true);
    setError(null);

    // Check cache first
    const cacheKey = `${language}_${difficulty}_${theme}`;
    const cached = storage.getPuzzle(cacheKey);

    if (cached) {
      setLoading(false);
      return cached;
    }

    // Determine node count and hidden count based on difficulty
    const difficultySettings = {
      beginner: { nodes: 5, hiddenNodes: 2, hiddenEdges: 1 },
      intermediate: { nodes: 7, hiddenNodes: 4, hiddenEdges: 2 },
      advanced: { nodes: 10, hiddenNodes: 6, hiddenEdges: 3 },
    };

    const settings =
      difficultySettings[difficulty] || difficultySettings.beginner;

    // Add randomization seed to ensure unique puzzles
    const randomSeed = Date.now() + Math.random();

    const prompt = `You are an expert language pedagogy AI specialized in creating semantic network puzzles for language learners. Generate a UNIQUE, never-before-seen puzzle.

RANDOMIZATION SEED: ${randomSeed}
Target Language: ${language}
Difficulty: ${difficulty}
Theme: ${theme}
Network Size: ${settings.nodes} nodes, ${settings.hiddenNodes} hidden nodes, ${settings.hiddenEdges} hidden relationships

═══════════════════════════════════════════════════════════════════
CORE PRINCIPLES (CRITICAL - DO NOT VIOLATE):
═══════════════════════════════════════════════════════════════════

1. UNIQUENESS & VARIETY
   - NEVER generate the same puzzle twice. Use the randomization seed to create truly original content.
   - Vary your starting points: Don't always start with "cat/dog/house"
   - Mix semantic domains: Combine abstract concepts with concrete objects
   - Use unexpected but logical connections that surprise and delight learners
   - Example variety: Instead of always "cat → mammal", try "bicycle → transportation", "happiness → emotion", "bread → bakery → city"

2. DIRECTED GRAPH LOGIC (CRITICAL)
   - Every edge has a DIRECTION: source → relationship → target
   - Relationships MUST be grammatically correct verbs/prepositions
   - Test each edge: Can you say "SOURCE RELATIONSHIP TARGET" as a valid sentence?
   
   ✓ CORRECT EXAMPLES:
   - "pisica" → "locuiește în" → "casa" = "The cat lives in the house"
   - "studentul" → "învață la" → "universitatea" = "The student studies at the university"
   - "cartea" → "este scrisă de" → "autorul" = "The book is written by the author"
   
   ✗ WRONG (Backwards logic):
   - "casa" → "locuiește în" → "pisica" = "The house lives in the cat" ❌
   - "universitatea" → "învață la" → "studentul" = "The university studies at the student" ❌

3. LINGUISTIC ACCURACY BY LANGUAGE
   
   ROMANIAN:
   - ALWAYS use definite articles: "pisica" (the cat), "casa" (the house), "grădina" (the garden)
   - Common relationships: "este un/o", "locuiește în", "face parte din", "are", "se află în", "provine din", "aparține la"
   - Proper case agreement: "câinele" (masc), "pisica" (fem), "copilul" (neut)
   
   SPANISH:
   - Use articles naturally: "el gato", "la casa", "el libro"
   - Common relationships: "es un/una", "vive en", "tiene", "pertenece a", "viene de", "está en"
   - Verb conjugation: "vive" (lives), "tiene" (has), "es" (is)
   
   FRENCH:
   - Always use articles: "le chat", "la maison", "l'école"
   - Common relationships: "est un/une", "vit dans", "a", "appartient à", "vient de", "se trouve dans"
   - Contractions: "du" (de + le), "au" (à + le), "de la", "à la"
   
   GERMAN:
   - Use proper articles with case: "der Hund" (nom), "den Hund" (acc), "dem Hund" (dat)
   - Common relationships: "ist ein/eine", "wohnt in", "hat", "gehört zu", "kommt aus"
   - Capitalize all nouns: "das Haus", "der Garten"
   
   ITALIAN:
   - Use articles: "il gatto", "la casa", "l'albero"
   - Common relationships: "è un/una", "vive in", "ha", "appartiene a", "viene da"
   
   PORTUGUESE:
   - Articles: "o gato", "a casa", "o livro"
   - Common relationships: "é um/uma", "mora em", "tem", "pertence a", "vem de"
   
   DUTCH:
   - Articles: "de kat", "het huis" (de/het distinction critical!)
   - Common relationships: "is een", "woont in", "heeft", "hoort bij", "komt uit"

4. EDUCATIONAL PROGRESSION
   
   BEGINNER (A1-A2):
   - Concrete, everyday vocabulary: family, home, food, animals, colors, numbers
   - Simple relationships: "is a", "has", "lives in", "belongs to"
   - Direct semantic connections: cat → animal, house → room
   - Example themes: "daily routine", "my family", "at the market", "in the park"
   
   INTERMEDIATE (B1-B2):
   - Abstract concepts: emotions, ideas, processes
   - Complex relationships: "comes from", "is part of", "is used for", "leads to"
   - Cultural vocabulary: traditions, cuisine, geography
   - Example themes: "city life", "cultural traditions", "work environment", "travel"
   
   ADVANCED (C1-C2):
   - Sophisticated vocabulary: nuanced emotions, technical terms, idioms
   - Multi-layered relationships: cause-effect, metaphorical connections
   - Cultural depth: literature, history, philosophy
   - Example themes: "social dynamics", "environmental issues", "artistic movements", "philosophical concepts"

5. NETWORK STRUCTURE RULES
   - Create a CONNECTED graph: every node reachable from at least one other
   - Aim for 2-4 connections per node (not all nodes need same number)
   - Create interesting paths: users should traverse the network to understand relationships
   - Balance tree-like and web-like structures: some branching, some convergence
   - Hidden nodes should be INFERRABLE from visible connections
   
   GOOD NETWORK EXAMPLE:
   studentul → "învață la" → universitatea
                              ↓ "se află în"
   cartea ← "este în" ← biblioteca
   cartea → "conține" → informația → "ajută la" → învățarea
   
   BAD NETWORK (disconnected):
   pisica → animal
   mașina → vehicul  (no connection to first pair!)

6. HINT QUALITY (CRITICAL FOR GAMEPLAY)
   
   Hints MUST follow this progression for hidden elements:
   
   Hint 1 - CONCEPTUAL/SEMANTIC:
   - Give the general category or semantic field
   - Examples: "A type of transportation", "An emotion", "Something in nature"
   
   Hint 2 - STRUCTURAL/PHONETIC:
   - Give letter count, starts/ends with, or phonetic clue
   - Examples: "Starts with 'b', 5 letters", "Rhymes with 'day'", "Has 3 syllables"
   
   Hint 3 - NEAR-ANSWER:
   - Give most of the word or very direct clue
   - Examples: "bic____", "the opposite of night", actual answer with one letter missing
   
   GOOD HINT PROGRESSION:
   Word: "grădina" (garden)
   1. "An outdoor space where plants grow"
   2. "7 letters, starts with 'gr'"
   3. "gr_dina"
   
   BAD HINT PROGRESSION:
   1. "It's green" (too vague)
   2. "Outside" (too vague)
   3. "garden" (English answer, should be Romanian!)

7. THEME CREATIVITY
   Don't be predictable! Use diverse themes:
   - Nature: "forest ecosystem", "weather patterns", "ocean life"
   - Urban: "city infrastructure", "public transportation", "neighborhood"
   - Abstract: "emotions", "time concepts", "learning process"
   - Cultural: "traditional foods", "festivals", "art forms"
   - Professional: "school subjects", "workplace", "tools and crafts"
   - Everyday: "morning routine", "cooking", "technology"

8. JSON OUTPUT REQUIREMENTS
   - Output ONLY valid JSON, no markdown, no explanations
   - Use proper escaping for special characters
   - Ensure all IDs are unique strings
   - All hidden elements MUST have "answer" and "hints" arrays with exactly 3 hints
   - Pronunciation field ONLY for non-Latin scripts (Japanese, Chinese, Arabic, etc.)

═══════════════════════════════════════════════════════════════════
OUTPUT FORMAT:
═══════════════════════════════════════════════════════════════════

{
  "nodes": [
    {
      "id": "1",
      "word": "word in target language with proper grammar",
      "translation": "English translation",
      "pronunciation": "only for non-Latin scripts",
      "hidden": false
    },
    {
      "id": "2",
      "word": "???",
      "answer": "word in target language",
      "translation": "English translation",
      "hidden": true,
      "hints": [
        "Conceptual hint (semantic category)",
        "Structural hint (phonetic/spelling clue)",
        "Near-answer hint (almost gives it away)"
      ]
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2",
      "relationship": "grammatically correct verb/preposition",
      "hidden": false
    },
    {
      "id": "e2-3",
      "source": "2",
      "target": "3",
      "relationship": "???",
      "answer": "grammatically correct verb/preposition",
      "hidden": true,
      "hints": [
        "Describes the relationship type",
        "Starts with [letter], verb form",
        "Almost complete word"
      ]
    }
  ],
  "theme": "${theme}",
  "difficulty": "${difficulty}"
}

═══════════════════════════════════════════════════════════════════
QUALITY CHECKLIST (Verify before outputting):
═══════════════════════════════════════════════════════════════════

✓ Is this puzzle truly unique? (Use randomization seed!)
✓ Does every edge make grammatical sense in the source → target direction?
✓ Are articles and grammar correct for the target language?
✓ Are all nodes reachable (connected graph)?
✓ Do hidden elements have exactly 3 progressively helpful hints?
✓ Is vocabulary appropriate for ${difficulty} level?
✓ Are hints in ENGLISH but answers in TARGET LANGUAGE?
✓ Does the semantic network teach meaningful connections?
✓ Would this puzzle be fun and challenging for a learner?

Now generate a unique, high-quality puzzle following ALL rules above.`;

    // Try Gemini API with retries
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
          console.warn("No Gemini API key found, using fallback puzzle");
          throw new Error("No API key");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("Gemini model initialized");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the response - remove markdown code blocks if present
        const cleanedText = text
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        const puzzle = JSON.parse(cleanedText);

        // Validate puzzle structure
        if (
          !puzzle.nodes ||
          !puzzle.edges ||
          !Array.isArray(puzzle.nodes) ||
          !Array.isArray(puzzle.edges)
        ) {
          throw new Error("Invalid puzzle structure");
        }

        // Cache the puzzle
        storage.savePuzzle(cacheKey, puzzle);

        setLoading(false);
        return puzzle;
      } catch (err) {
        console.error(`Gemini API attempt ${attempt + 1} failed:`, err);

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, attempt))
          );
        }
      }
    }

    // All retries failed, use fallback
    console.warn("All Gemini attempts failed, using fallback puzzle");
    setError("Using pre-made puzzle. AI generation unavailable.");

    // Select fallback puzzle
    const fallbackKey = `${language.toLowerCase()}_${difficulty}`;
    const fallback =
      FALLBACK_PUZZLES[fallbackKey] || FALLBACK_PUZZLES.romanian_beginner;

    setLoading(false);
    return fallback;
  };

  return { generatePuzzle, loading, error };
}
