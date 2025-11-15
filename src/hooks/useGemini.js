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

    const prompt = `You are a language learning puzzle generator. Create a semantic network DIRECTED graph puzzle.

Parameters:
- Target language: ${language}
- Difficulty: ${difficulty}
- Theme: ${theme}
- Number of nodes: ${settings.nodes}

CRITICAL REQUIREMENTS:
1. Generate a connected DIRECTED graph (edges have direction - arrows matter!)
2. Use PROPER GRAMMAR with articles: "casa" (the house), "câinele" (the dog), NOT "casa" (bare form)
3. Relationships MUST make grammatical sense with direction:
   - CORRECT: "pisica" (source) → "locuiește în" → "casa" (target) = "The cat lives in the house"
   - WRONG: "casa" → "locuiește în" → "pisica" = "The house lives in the cat" ❌
4. Use practical, common vocabulary appropriate for ${difficulty} learners
5. Relationships in target language: "este un", "are", "locuiește în", "face parte din", etc.
6. ${settings.hiddenNodes} nodes should be hidden for user to fill in
7. ${settings.hiddenEdges} edges should have hidden relationship labels
8. Each hidden element needs 3 progressive hints (in English)
9. Vocabulary should connect logically - teach through meaningful semantic connections
10. Include pronunciation guide for non-Latin scripts (Japanese, Mandarin, Chinese)

GRAMMAR RULES:
- Romanian: Use definite articles ("pisica", "casa", "grădina") not bare forms
- Spanish: Use articles where natural ("el gato", "la casa")
- French: Use articles ("le chat", "la maison")
- Ensure subject-verb-object order makes sense with arrow direction

Output ONLY valid JSON (no markdown, no extra text):
{
  "nodes": [
    {
      "id": "string",
      "word": "string (in target language WITH proper articles)",
      "translation": "string (English translation)",
      "pronunciation": "string (optional, for non-Latin scripts)",
      "hidden": boolean,
      "answer": "string (if hidden)",
      "hints": ["hint1", "hint2", "hint3"] (if hidden)
    }
  ],
  "edges": [
    {
      "id": "string",
      "source": "node_id (subject)",
      "target": "node_id (object)",
      "relationship": "string (verb/preposition in target language)",
      "hidden": boolean,
      "answer": "string (if hidden)",
      "hints": ["hint1", "hint2", "hint3"] (if hidden)
    }
  ],
  "theme": "string",
  "difficulty": "string"
}

EXAMPLE (Romanian):
pisica (source) → "este un" → mamifer (target) ✓ "The cat is a mammal"
pisica (source) → "locuiește în" → casa (target) ✓ "The cat lives in the house"
casa (source) → "are" → grădina (target) ✓ "The house has a garden"

Make it educational, grammatically correct, and fun!`;

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
      FALLBACK_PUZZLES[fallbackKey] || FALLBACK_PUZZLES.spanish_beginner;

    setLoading(false);
    return fallback;
  };

  return { generatePuzzle, loading, error };
}
