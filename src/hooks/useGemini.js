import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "../utils/storage";

// Fallback puzzles in case Gemini API fails
const FALLBACK_PUZZLES = {
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
      { id: "4", word: "mascota", translation: "pet", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "casa",
        translation: "house",
        hidden: true,
        hints: ["Where pets live", "A building where you live", "casa"],
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
        answer: "es",
        hidden: true,
        hints: ["To be", "Verb connecting subject and predicate", "es"],
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "vive en",
        hidden: false,
      },
    ],
    theme: "animals",
    difficulty: "beginner",
  },
  french_beginner: {
    nodes: [
      { id: "1", word: "pomme", translation: "apple", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "fruit",
        translation: "fruit",
        hidden: true,
        hints: ["Category of food", "Sweet and healthy", "fruit"],
      },
      { id: "3", word: "rouge", translation: "red", hidden: false },
      { id: "4", word: "manger", translation: "to eat", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "santé",
        translation: "health",
        hidden: true,
        hints: ["Being well", "Good for your...", "santé"],
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
        id: "e1-3",
        source: "1",
        target: "3",
        relationship: "???",
        answer: "a",
        hidden: true,
        hints: ["Has/is", "Possession verb", "a"],
      },
      {
        id: "e4-1",
        source: "4",
        target: "1",
        relationship: "action",
        hidden: false,
      },
      {
        id: "e2-5",
        source: "2",
        target: "5",
        relationship: "bon pour",
        hidden: false,
      },
    ],
    theme: "food",
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

    const prompt = `You are a language learning puzzle generator. Create a semantic network graph puzzle.

Parameters:
- Target language: ${language}
- Difficulty: ${difficulty}
- Theme: ${theme}
- Number of nodes: ${settings.nodes}

Requirements:
1. Generate a connected graph (no isolated nodes)
2. Use practical, common vocabulary appropriate for ${difficulty} learners
3. Relationships must be clear and educational: 'is a', 'has', 'used for', 'opposite of', 'similar to', 'part of', 'makes', 'lives in', etc.
4. ${settings.hiddenNodes} nodes should be hidden for user to fill in
5. ${settings.hiddenEdges} edges should have hidden relationship labels
6. Each hidden element needs 3 progressive hints
7. Vocabulary should connect logically (teach through meaningful semantic connections)
8. Include pronunciation guide for non-Latin scripts (Japanese, Mandarin)
9. Relationship labels should be in the target language

Output ONLY valid JSON (no markdown, no extra text):
{
  "nodes": [
    {
      "id": "string",
      "word": "string (in target language)",
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
      "source": "node_id",
      "target": "node_id",
      "relationship": "string",
      "hidden": boolean,
      "answer": "string (if hidden)",
      "hints": ["hint1", "hint2", "hint3"] (if hidden)
    }
  ],
  "theme": "string",
  "difficulty": "string"
}

Ensure graph teaches vocabulary through meaningful connections. Make it educational and fun!`;

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
