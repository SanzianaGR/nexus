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

  // INTERMEDIATE PUZZLES
  romanian_intermediate: {
    nodes: [
      { id: "1", word: "studentul", translation: "the student", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "universitatea",
        translation: "the university",
        hidden: true,
        hints: [
          "A place of higher education",
          "Starts with 'u', 13 letters",
          "universitatea",
        ],
      },
      { id: "3", word: "biblioteca", translation: "the library", hidden: false },
      {
        id: "4",
        word: "???",
        answer: "cartea",
        translation: "the book",
        hidden: true,
        hints: ["You read this", "6 letters, starts with 'c'", "cartea"],
      },
      { id: "5", word: "cunoștințele", translation: "knowledge", hidden: false },
      {
        id: "6",
        word: "???",
        answer: "profesorul",
        translation: "the professor",
        hidden: true,
        hints: ["Teaches at university", "10 letters, starts with 'p'", "profesorul"],
      },
      { id: "7", word: "examenul", translation: "the exam", hidden: false },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "studiază la",
        hidden: true,
        hints: ["Studies at", "Verb form with 'la'", "studiază la"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "conține",
        hidden: false,
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        relationship: "are",
        hidden: false,
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "???",
        answer: "oferă",
        hidden: true,
        hints: ["Provides or gives", "Starts with 'o'", "oferă"],
      },
      {
        id: "e6-1",
        source: "6",
        target: "1",
        relationship: "predă",
        hidden: false,
      },
      {
        id: "e1-7",
        source: "1",
        target: "7",
        relationship: "dă",
        hidden: false,
      },
    ],
    theme: "education",
    difficulty: "intermediate",
  },

  spanish_intermediate: {
    nodes: [
      { id: "1", word: "la ciudad", translation: "the city", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "el parque",
        translation: "the park",
        hidden: true,
        hints: ["Green space in the city", "8 letters, 'el p____e'", "el parque"],
      },
      { id: "3", word: "los árboles", translation: "the trees", hidden: false },
      {
        id: "4",
        word: "???",
        answer: "el aire",
        translation: "the air",
        hidden: true,
        hints: ["What we breathe", "6 letters, starts with 'a'", "el aire"],
      },
      { id: "5", word: "la gente", translation: "the people", hidden: false },
      {
        id: "6",
        word: "???",
        answer: "el restaurante",
        translation: "the restaurant",
        hidden: true,
        hints: ["Place to eat", "13 letters, 'el r_______e'", "el restaurante"],
      },
      { id: "7", word: "la comida", translation: "the food", hidden: false },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "tiene",
        hidden: false,
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "???",
        answer: "contiene",
        hidden: true,
        hints: ["Has or contains", "Verb form", "contiene"],
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        relationship: "producen",
        hidden: false,
      },
      {
        id: "e5-2",
        source: "5",
        target: "2",
        relationship: "???",
        answer: "visita",
        hidden: true,
        hints: ["Goes to see", "Starts with 'v'", "visita"],
      },
      {
        id: "e1-6",
        source: "1",
        target: "6",
        relationship: "tiene",
        hidden: false,
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
        relationship: "sirve",
        hidden: false,
      },
    ],
    theme: "city life",
    difficulty: "intermediate",
  },

  french_intermediate: {
    nodes: [
      { id: "1", word: "le voyageur", translation: "the traveler", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "l'aéroport",
        translation: "the airport",
        hidden: true,
        hints: ["Where planes take off", "9 letters, starts with 'a'", "l'aéroport"],
      },
      { id: "3", word: "l'avion", translation: "the airplane", hidden: false },
      {
        id: "4",
        word: "???",
        answer: "le pays",
        translation: "the country",
        hidden: true,
        hints: ["A nation or land", "7 letters, 'le p___s'", "le pays"],
      },
      { id: "5", word: "la culture", translation: "the culture", hidden: false },
      {
        id: "6",
        word: "???",
        answer: "le musée",
        translation: "the museum",
        hidden: true,
        hints: ["Place with art and history", "8 letters, 'le m____'", "le musée"],
      },
      { id: "7", word: "l'histoire", translation: "the history", hidden: false },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "arrive à",
        hidden: true,
        hints: ["Gets to", "Verb with 'à'", "arrive à"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "a des",
        hidden: false,
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        relationship: "???",
        answer: "vole vers",
        hidden: true,
        hints: ["Flies to", "Two words", "vole vers"],
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "a une",
        hidden: false,
      },
      {
        id: "e1-6",
        source: "1",
        target: "6",
        relationship: "visite",
        hidden: false,
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
        relationship: "montre",
        hidden: false,
      },
    ],
    theme: "travel",
    difficulty: "intermediate",
  },

  // ADVANCED PUZZLES
  romanian_advanced: {
    nodes: [
      { id: "1", word: "societatea", translation: "society", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "economia",
        translation: "the economy",
        hidden: true,
        hints: [
          "Financial system of a country",
          "8 letters, starts with 'e'",
          "economia",
        ],
      },
      {
        id: "3",
        word: "???",
        answer: "dezvoltarea",
        translation: "development",
        hidden: true,
        hints: ["Growth or progress", "11 letters, 'dezv_______'", "dezvoltarea"],
      },
      { id: "4", word: "inovația", translation: "innovation", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "tehnologia",
        translation: "technology",
        hidden: true,
        hints: ["Modern tools and systems", "10 letters, 'tehn______'", "tehnologia"],
      },
      { id: "6", word: "educația", translation: "education", hidden: false },
      {
        id: "7",
        word: "???",
        answer: "progresul",
        translation: "progress",
        hidden: true,
        hints: ["Forward movement", "9 letters, starts with 'p'", "progresul"],
      },
      {
        id: "8",
        word: "???",
        answer: "viitorul",
        translation: "the future",
        hidden: true,
        hints: ["What comes next", "8 letters, 'vi_____l'", "viitorul"],
      },
      { id: "9", word: "schimbarea", translation: "change", hidden: false },
      {
        id: "10",
        word: "???",
        answer: "adaptarea",
        translation: "adaptation",
        hidden: true,
        hints: ["Adjusting to new conditions", "9 letters, 'ada______'", "adaptarea"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "depinde de",
        hidden: true,
        hints: ["Relies on", "Two words", "depinde de"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "necesită",
        hidden: false,
      },
      {
        id: "e4-3",
        source: "4",
        target: "3",
        relationship: "???",
        answer: "accelerează",
        hidden: true,
        hints: ["Speeds up", "Starts with 'a'", "accelerează"],
      },
      {
        id: "e5-4",
        source: "5",
        target: "4",
        relationship: "permite",
        hidden: false,
      },
      {
        id: "e6-5",
        source: "6",
        target: "5",
        relationship: "???",
        answer: "promovează",
        hidden: true,
        hints: ["Promotes or advances", "Starts with 'p'", "promovează"],
      },
      {
        id: "e3-7",
        source: "3",
        target: "7",
        relationship: "generează",
        hidden: false,
      },
      {
        id: "e7-8",
        source: "7",
        target: "8",
        relationship: "???",
        answer: "construiește",
        hidden: true,
        hints: ["Builds or creates", "Verb form", "construiește"],
      },
      {
        id: "e1-9",
        source: "1",
        target: "9",
        relationship: "experimentează",
        hidden: false,
      },
      {
        id: "e9-10",
        source: "9",
        target: "10",
        relationship: "cere",
        hidden: false,
      },
    ],
    theme: "social progress",
    difficulty: "advanced",
  },

  spanish_advanced: {
    nodes: [
      { id: "1", word: "el artista", translation: "the artist", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "la creatividad",
        translation: "creativity",
        hidden: true,
        hints: [
          "Ability to create new ideas",
          "13 letters, 'la cre______d'",
          "la creatividad",
        ],
      },
      {
        id: "3",
        word: "???",
        answer: "la obra",
        translation: "the work/artwork",
        hidden: true,
        hints: ["Piece of art", "6 letters, 'la o__a'", "la obra"],
      },
      { id: "4", word: "la emoción", translation: "emotion", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "el espectador",
        translation: "the spectator",
        hidden: true,
        hints: ["Person who watches", "12 letters, 'el esp______r'", "el espectador"],
      },
      { id: "6", word: "la galería", translation: "the gallery", hidden: false },
      {
        id: "7",
        word: "???",
        answer: "la exposición",
        translation: "the exhibition",
        hidden: true,
        hints: ["Art display event", "12 letters, 'la exp______n'", "la exposición"],
      },
      {
        id: "8",
        word: "???",
        answer: "la cultura",
        translation: "the culture",
        hidden: true,
        hints: ["Shared values and arts", "9 letters, 'la cul____a'", "la cultura"],
      },
      { id: "9", word: "la sociedad", translation: "society", hidden: false },
      {
        id: "10",
        word: "???",
        answer: "la inspiración",
        translation: "inspiration",
        hidden: true,
        hints: ["Creative spark", "13 letters, 'la ins_______n'", "la inspiración"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "posee",
        hidden: true,
        hints: ["Has or possesses", "Verb form", "posee"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "produce",
        hidden: false,
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        relationship: "???",
        answer: "evoca",
        hidden: true,
        hints: ["Brings forth or evokes", "Starts with 'e'", "evoca"],
      },
      {
        id: "e5-3",
        source: "5",
        target: "3",
        relationship: "contempla",
        hidden: false,
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
        relationship: "???",
        answer: "organiza",
        hidden: true,
        hints: ["Arranges or organizes", "Verb form", "organiza"],
      },
      {
        id: "e7-3",
        source: "7",
        target: "3",
        relationship: "presenta",
        hidden: false,
      },
      {
        id: "e8-1",
        source: "8",
        target: "1",
        relationship: "valora",
        hidden: false,
      },
      {
        id: "e9-8",
        source: "9",
        target: "8",
        relationship: "crea",
        hidden: false,
      },
      {
        id: "e10-1",
        source: "10",
        target: "1",
        relationship: "motiva",
        hidden: false,
      },
    ],
    theme: "art and culture",
    difficulty: "advanced",
  },

  french_advanced: {
    nodes: [
      { id: "1", word: "le philosophe", translation: "the philosopher", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "la réflexion",
        translation: "reflection/thought",
        hidden: true,
        hints: [
          "Deep thinking process",
          "11 letters, 'la réf______n'",
          "la réflexion",
        ],
      },
      {
        id: "3",
        word: "???",
        answer: "la vérité",
        translation: "the truth",
        hidden: true,
        hints: ["What is real or factual", "9 letters, 'la vér___'", "la vérité"],
      },
      { id: "4", word: "la connaissance", translation: "knowledge", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "la sagesse",
        translation: "wisdom",
        hidden: true,
        hints: ["Deep understanding", "9 letters, 'la sag____'", "la sagesse"],
      },
      { id: "6", word: "l'expérience", translation: "experience", hidden: false },
      {
        id: "7",
        word: "???",
        answer: "la compréhension",
        translation: "understanding",
        hidden: true,
        hints: ["Grasping meaning", "16 letters, 'la comp________n'", "la compréhension"],
      },
      {
        id: "8",
        word: "???",
        answer: "le doute",
        translation: "doubt",
        hidden: true,
        hints: ["Uncertainty", "7 letters, 'le d___e'", "le doute"],
      },
      { id: "9", word: "la question", translation: "the question", hidden: false },
      {
        id: "10",
        word: "???",
        answer: "la pensée",
        translation: "thought",
        hidden: true,
        hints: ["Mental process", "8 letters, 'la pen___'", "la pensée"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "pratique",
        hidden: true,
        hints: ["Does or practices", "Verb form", "pratique"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "cherche",
        hidden: false,
      },
      {
        id: "e4-3",
        source: "4",
        target: "3",
        relationship: "???",
        answer: "révèle",
        hidden: true,
        hints: ["Reveals or shows", "Starts with 'r'", "révèle"],
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "mène à",
        hidden: false,
      },
      {
        id: "e6-4",
        source: "6",
        target: "4",
        relationship: "???",
        answer: "produit",
        hidden: true,
        hints: ["Creates or produces", "Verb form", "produit"],
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
        relationship: "développe",
        hidden: false,
      },
      {
        id: "e8-2",
        source: "8",
        target: "2",
        relationship: "stimule",
        hidden: false,
      },
      {
        id: "e9-8",
        source: "9",
        target: "8",
        relationship: "engendre",
        hidden: false,
      },
      {
        id: "e10-9",
        source: "10",
        target: "9",
        relationship: "pose",
        hidden: false,
      },
    ],
    theme: "philosophy",
    difficulty: "advanced",
  },

  // GERMAN PUZZLES
  german_beginner: {
    nodes: [
      { id: "1", word: "der Hund", translation: "the dog", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "das Tier",
        translation: "the animal",
        hidden: true,
        hints: ["A living creature", "7 letters, 'das T___'", "das Tier"],
      },
      { id: "3", word: "die Katze", translation: "the cat", hidden: false },
      { id: "4", word: "das Haus", translation: "the house", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "der Garten",
        translation: "the garden",
        hidden: true,
        hints: ["Outside space with plants", "10 letters, 'der Gar___'", "der Garten"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "ist ein",
        hidden: false,
      },
      {
        id: "e3-2",
        source: "3",
        target: "2",
        relationship: "ist ein",
        hidden: false,
      },
      {
        id: "e1-4",
        source: "1",
        target: "4",
        relationship: "???",
        answer: "wohnt in",
        hidden: true,
        hints: ["Lives in", "Two words", "wohnt in"],
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "hat einen",
        hidden: false,
      },
    ],
    theme: "animals",
    difficulty: "beginner",
  },

  german_intermediate: {
    nodes: [
      { id: "1", word: "der Student", translation: "the student", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "die Universität",
        translation: "the university",
        hidden: true,
        hints: ["Place of higher learning", "14 letters, 'die Uni______t'", "die Universität"],
      },
      { id: "3", word: "die Bibliothek", translation: "the library", hidden: false },
      {
        id: "4",
        word: "???",
        answer: "das Buch",
        translation: "the book",
        hidden: true,
        hints: ["You read this", "8 letters, 'das B___'", "das Buch"],
      },
      { id: "5", word: "das Wissen", translation: "knowledge", hidden: false },
      {
        id: "6",
        word: "???",
        answer: "der Professor",
        translation: "the professor",
        hidden: true,
        hints: ["University teacher", "13 letters, 'der Prof_____'", "der Professor"],
      },
      { id: "7", word: "die Prüfung", translation: "the exam", hidden: false },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "studiert an",
        hidden: true,
        hints: ["Studies at", "Two words", "studiert an"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "hat eine",
        hidden: false,
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        relationship: "enthält",
        hidden: false,
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "???",
        answer: "vermittelt",
        hidden: true,
        hints: ["Conveys or imparts", "Starts with 'v'", "vermittelt"],
      },
      {
        id: "e6-1",
        source: "6",
        target: "1",
        relationship: "unterrichtet",
        hidden: false,
      },
      {
        id: "e1-7",
        source: "1",
        target: "7",
        relationship: "macht",
        hidden: false,
      },
    ],
    theme: "education",
    difficulty: "intermediate",
  },

  german_advanced: {
    nodes: [
      { id: "1", word: "die Gesellschaft", translation: "society", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "die Wirtschaft",
        translation: "the economy",
        hidden: true,
        hints: ["Economic system", "14 letters, 'die Wirt______'", "die Wirtschaft"],
      },
      {
        id: "3",
        word: "???",
        answer: "die Entwicklung",
        translation: "development",
        hidden: true,
        hints: ["Growth or progress", "15 letters, 'die Entw______g'", "die Entwicklung"],
      },
      { id: "4", word: "die Innovation", translation: "innovation", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "die Technologie",
        translation: "technology",
        hidden: true,
        hints: ["Modern tech systems", "15 letters, 'die Tech______e'", "die Technologie"],
      },
      { id: "6", word: "die Bildung", translation: "education", hidden: false },
      {
        id: "7",
        word: "???",
        answer: "der Fortschritt",
        translation: "progress",
        hidden: true,
        hints: ["Forward movement", "15 letters, 'der Fort______t'", "der Fortschritt"],
      },
      {
        id: "8",
        word: "???",
        answer: "die Zukunft",
        translation: "the future",
        hidden: true,
        hints: ["What comes next", "11 letters, 'die Zuk____'", "die Zukunft"],
      },
      { id: "9", word: "die Veränderung", translation: "change", hidden: false },
      {
        id: "10",
        word: "???",
        answer: "die Anpassung",
        translation: "adaptation",
        hidden: true,
        hints: ["Adjusting to new things", "13 letters, 'die Anp_____g'", "die Anpassung"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "hängt ab von",
        hidden: true,
        hints: ["Depends on", "Three words", "hängt ab von"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "braucht",
        hidden: false,
      },
      {
        id: "e4-3",
        source: "4",
        target: "3",
        relationship: "???",
        answer: "beschleunigt",
        hidden: true,
        hints: ["Accelerates", "Starts with 'b'", "beschleunigt"],
      },
      {
        id: "e5-4",
        source: "5",
        target: "4",
        relationship: "ermöglicht",
        hidden: false,
      },
      {
        id: "e6-5",
        source: "6",
        target: "5",
        relationship: "???",
        answer: "fördert",
        hidden: true,
        hints: ["Promotes", "Starts with 'f'", "fördert"],
      },
      {
        id: "e3-7",
        source: "3",
        target: "7",
        relationship: "erzeugt",
        hidden: false,
      },
      {
        id: "e7-8",
        source: "7",
        target: "8",
        relationship: "???",
        answer: "gestaltet",
        hidden: true,
        hints: ["Shapes or forms", "Starts with 'g'", "gestaltet"],
      },
      {
        id: "e1-9",
        source: "1",
        target: "9",
        relationship: "erlebt",
        hidden: false,
      },
      {
        id: "e9-10",
        source: "9",
        target: "10",
        relationship: "erfordert",
        hidden: false,
      },
    ],
    theme: "social progress",
    difficulty: "advanced",
  },

  // ITALIAN PUZZLES
  italian_beginner: {
    nodes: [
      { id: "1", word: "il gatto", translation: "the cat", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "l'animale",
        translation: "the animal",
        hidden: true,
        hints: ["A living creature", "9 letters, 'l'ani____'", "l'animale"],
      },
      { id: "3", word: "il cane", translation: "the dog", hidden: false },
      { id: "4", word: "la casa", translation: "the house", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "il giardino",
        translation: "the garden",
        hidden: true,
        hints: ["Outside space with plants", "11 letters, 'il gia_____'", "il giardino"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "è un",
        hidden: false,
      },
      {
        id: "e3-2",
        source: "3",
        target: "2",
        relationship: "è un",
        hidden: false,
      },
      {
        id: "e1-4",
        source: "1",
        target: "4",
        relationship: "???",
        answer: "vive in",
        hidden: true,
        hints: ["Lives in", "Two words", "vive in"],
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "ha un",
        hidden: false,
      },
    ],
    theme: "animals",
    difficulty: "beginner",
  },

  italian_intermediate: {
    nodes: [
      { id: "1", word: "lo studente", translation: "the student", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "l'università",
        translation: "the university",
        hidden: true,
        hints: ["Place of higher learning", "12 letters, 'l'univ______'", "l'università"],
      },
      { id: "3", word: "la biblioteca", translation: "the library", hidden: false },
      {
        id: "4",
        word: "???",
        answer: "il libro",
        translation: "the book",
        hidden: true,
        hints: ["You read this", "8 letters, 'il li___'", "il libro"],
      },
      { id: "5", word: "la conoscenza", translation: "knowledge", hidden: false },
      {
        id: "6",
        word: "???",
        answer: "il professore",
        translation: "the professor",
        hidden: true,
        hints: ["University teacher", "13 letters, 'il prof______'", "il professore"],
      },
      { id: "7", word: "l'esame", translation: "the exam", hidden: false },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "studia a",
        hidden: true,
        hints: ["Studies at", "Two words", "studia a"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "contiene",
        hidden: false,
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        relationship: "ha",
        hidden: false,
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "???",
        answer: "fornisce",
        hidden: true,
        hints: ["Provides", "Starts with 'f'", "fornisce"],
      },
      {
        id: "e6-1",
        source: "6",
        target: "1",
        relationship: "insegna a",
        hidden: false,
      },
      {
        id: "e1-7",
        source: "1",
        target: "7",
        relationship: "fa",
        hidden: false,
      },
    ],
    theme: "education",
    difficulty: "intermediate",
  },

  italian_advanced: {
    nodes: [
      { id: "1", word: "l'artista", translation: "the artist", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "la creatività",
        translation: "creativity",
        hidden: true,
        hints: ["Ability to create", "13 letters, 'la crea______'", "la creatività"],
      },
      {
        id: "3",
        word: "???",
        answer: "l'opera",
        translation: "the work/artwork",
        hidden: true,
        hints: ["Piece of art", "7 letters, 'l'op___'", "l'opera"],
      },
      { id: "4", word: "l'emozione", translation: "emotion", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "lo spettatore",
        translation: "the spectator",
        hidden: true,
        hints: ["Person who watches", "13 letters, 'lo spet______'", "lo spettatore"],
      },
      { id: "6", word: "la galleria", translation: "the gallery", hidden: false },
      {
        id: "7",
        word: "???",
        answer: "la mostra",
        translation: "the exhibition",
        hidden: true,
        hints: ["Art display event", "9 letters, 'la mos___'", "la mostra"],
      },
      {
        id: "8",
        word: "???",
        answer: "la cultura",
        translation: "the culture",
        hidden: true,
        hints: ["Shared values and arts", "10 letters, 'la cul____'", "la cultura"],
      },
      { id: "9", word: "la società", translation: "society", hidden: false },
      {
        id: "10",
        word: "???",
        answer: "l'ispirazione",
        translation: "inspiration",
        hidden: true,
        hints: ["Creative spark", "13 letters, 'l'ispi______'", "l'ispirazione"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "possiede",
        hidden: true,
        hints: ["Possesses", "Starts with 'p'", "possiede"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "produce",
        hidden: false,
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        relationship: "???",
        answer: "evoca",
        hidden: true,
        hints: ["Evokes", "Starts with 'e'", "evoca"],
      },
      {
        id: "e5-3",
        source: "5",
        target: "3",
        relationship: "contempla",
        hidden: false,
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
        relationship: "???",
        answer: "organizza",
        hidden: true,
        hints: ["Organizes", "Starts with 'o'", "organizza"],
      },
      {
        id: "e7-3",
        source: "7",
        target: "3",
        relationship: "presenta",
        hidden: false,
      },
      {
        id: "e8-1",
        source: "8",
        target: "1",
        relationship: "valorizza",
        hidden: false,
      },
      {
        id: "e9-8",
        source: "9",
        target: "8",
        relationship: "crea",
        hidden: false,
      },
      {
        id: "e10-1",
        source: "10",
        target: "1",
        relationship: "motiva",
        hidden: false,
      },
    ],
    theme: "art and culture",
    difficulty: "advanced",
  },

  // PORTUGUESE PUZZLES
  portuguese_beginner: {
    nodes: [
      { id: "1", word: "o gato", translation: "the cat", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "o animal",
        translation: "the animal",
        hidden: true,
        hints: ["A living creature", "8 letters, 'o ani___'", "o animal"],
      },
      { id: "3", word: "o cão", translation: "the dog", hidden: false },
      { id: "4", word: "a casa", translation: "the house", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "o jardim",
        translation: "the garden",
        hidden: true,
        hints: ["Outside space with plants", "8 letters, 'o jar___'", "o jardim"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "é um",
        hidden: false,
      },
      {
        id: "e3-2",
        source: "3",
        target: "2",
        relationship: "é um",
        hidden: false,
      },
      {
        id: "e1-4",
        source: "1",
        target: "4",
        relationship: "???",
        answer: "mora em",
        hidden: true,
        hints: ["Lives in", "Two words", "mora em"],
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "tem",
        hidden: false,
      },
    ],
    theme: "animals",
    difficulty: "beginner",
  },

  portuguese_intermediate: {
    nodes: [
      { id: "1", word: "o estudante", translation: "the student", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "a universidade",
        translation: "the university",
        hidden: true,
        hints: ["Place of higher learning", "14 letters, 'a univ______e'", "a universidade"],
      },
      { id: "3", word: "a biblioteca", translation: "the library", hidden: false },
      {
        id: "4",
        word: "???",
        answer: "o livro",
        translation: "the book",
        hidden: true,
        hints: ["You read this", "7 letters, 'o li___'", "o livro"],
      },
      { id: "5", word: "o conhecimento", translation: "knowledge", hidden: false },
      {
        id: "6",
        word: "???",
        answer: "o professor",
        translation: "the professor",
        hidden: true,
        hints: ["University teacher", "11 letters, 'o prof_____'", "o professor"],
      },
      { id: "7", word: "o exame", translation: "the exam", hidden: false },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "estuda na",
        hidden: true,
        hints: ["Studies at", "Two words", "estuda na"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "contém",
        hidden: false,
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        relationship: "tem",
        hidden: false,
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "???",
        answer: "fornece",
        hidden: true,
        hints: ["Provides", "Starts with 'f'", "fornece"],
      },
      {
        id: "e6-1",
        source: "6",
        target: "1",
        relationship: "ensina",
        hidden: false,
      },
      {
        id: "e1-7",
        source: "1",
        target: "7",
        relationship: "faz",
        hidden: false,
      },
    ],
    theme: "education",
    difficulty: "intermediate",
  },

  portuguese_advanced: {
    nodes: [
      { id: "1", word: "a sociedade", translation: "society", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "a economia",
        translation: "the economy",
        hidden: true,
        hints: ["Financial system", "10 letters, 'a econ____'", "a economia"],
      },
      {
        id: "3",
        word: "???",
        answer: "o desenvolvimento",
        translation: "development",
        hidden: true,
        hints: ["Growth or progress", "17 letters, 'o desenv________o'", "o desenvolvimento"],
      },
      { id: "4", word: "a inovação", translation: "innovation", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "a tecnologia",
        translation: "technology",
        hidden: true,
        hints: ["Modern tech systems", "12 letters, 'a tecn______'", "a tecnologia"],
      },
      { id: "6", word: "a educação", translation: "education", hidden: false },
      {
        id: "7",
        word: "???",
        answer: "o progresso",
        translation: "progress",
        hidden: true,
        hints: ["Forward movement", "11 letters, 'o prog____o'", "o progresso"],
      },
      {
        id: "8",
        word: "???",
        answer: "o futuro",
        translation: "the future",
        hidden: true,
        hints: ["What comes next", "8 letters, 'o fut___'", "o futuro"],
      },
      { id: "9", word: "a mudança", translation: "change", hidden: false },
      {
        id: "10",
        word: "???",
        answer: "a adaptação",
        translation: "adaptation",
        hidden: true,
        hints: ["Adjusting to new things", "11 letters, 'a adap_____'", "a adaptação"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "depende de",
        hidden: true,
        hints: ["Depends on", "Two words", "depende de"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "necessita",
        hidden: false,
      },
      {
        id: "e4-3",
        source: "4",
        target: "3",
        relationship: "???",
        answer: "acelera",
        hidden: true,
        hints: ["Accelerates", "Starts with 'a'", "acelera"],
      },
      {
        id: "e5-4",
        source: "5",
        target: "4",
        relationship: "permite",
        hidden: false,
      },
      {
        id: "e6-5",
        source: "6",
        target: "5",
        relationship: "???",
        answer: "promove",
        hidden: true,
        hints: ["Promotes", "Starts with 'p'", "promove"],
      },
      {
        id: "e3-7",
        source: "3",
        target: "7",
        relationship: "gera",
        hidden: false,
      },
      {
        id: "e7-8",
        source: "7",
        target: "8",
        relationship: "???",
        answer: "constrói",
        hidden: true,
        hints: ["Builds", "Starts with 'c'", "constrói"],
      },
      {
        id: "e1-9",
        source: "1",
        target: "9",
        relationship: "experimenta",
        hidden: false,
      },
      {
        id: "e9-10",
        source: "9",
        target: "10",
        relationship: "requer",
        hidden: false,
      },
    ],
    theme: "social progress",
    difficulty: "advanced",
  },

  // DUTCH PUZZLES
  dutch_beginner: {
    nodes: [
      { id: "1", word: "de kat", translation: "the cat", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "het dier",
        translation: "the animal",
        hidden: true,
        hints: ["A living creature", "8 letters, 'het d___'", "het dier"],
      },
      { id: "3", word: "de hond", translation: "the dog", hidden: false },
      { id: "4", word: "het huis", translation: "the house", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "de tuin",
        translation: "the garden",
        hidden: true,
        hints: ["Outside space with plants", "7 letters, 'de t___'", "de tuin"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "is een",
        hidden: false,
      },
      {
        id: "e3-2",
        source: "3",
        target: "2",
        relationship: "is een",
        hidden: false,
      },
      {
        id: "e1-4",
        source: "1",
        target: "4",
        relationship: "???",
        answer: "woont in",
        hidden: true,
        hints: ["Lives in", "Two words", "woont in"],
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "heeft een",
        hidden: false,
      },
    ],
    theme: "animals",
    difficulty: "beginner",
  },

  dutch_intermediate: {
    nodes: [
      { id: "1", word: "de student", translation: "the student", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "de universiteit",
        translation: "the university",
        hidden: true,
        hints: ["Place of higher learning", "15 letters, 'de univ_______'", "de universiteit"],
      },
      { id: "3", word: "de bibliotheek", translation: "the library", hidden: false },
      {
        id: "4",
        word: "???",
        answer: "het boek",
        translation: "the book",
        hidden: true,
        hints: ["You read this", "8 letters, 'het b___'", "het boek"],
      },
      { id: "5", word: "de kennis", translation: "knowledge", hidden: false },
      {
        id: "6",
        word: "???",
        answer: "de professor",
        translation: "the professor",
        hidden: true,
        hints: ["University teacher", "12 letters, 'de prof_____'", "de professor"],
      },
      { id: "7", word: "het examen", translation: "the exam", hidden: false },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "studeert aan",
        hidden: true,
        hints: ["Studies at", "Two words", "studeert aan"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "heeft een",
        hidden: false,
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        relationship: "bevat",
        hidden: false,
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        relationship: "???",
        answer: "geeft",
        hidden: true,
        hints: ["Gives", "Starts with 'g'", "geeft"],
      },
      {
        id: "e6-1",
        source: "6",
        target: "1",
        relationship: "onderwijst",
        hidden: false,
      },
      {
        id: "e1-7",
        source: "1",
        target: "7",
        relationship: "maakt",
        hidden: false,
      },
    ],
    theme: "education",
    difficulty: "intermediate",
  },

  dutch_advanced: {
    nodes: [
      { id: "1", word: "de maatschappij", translation: "society", hidden: false },
      {
        id: "2",
        word: "???",
        answer: "de economie",
        translation: "the economy",
        hidden: true,
        hints: ["Financial system", "11 letters, 'de econ____'", "de economie"],
      },
      {
        id: "3",
        word: "???",
        answer: "de ontwikkeling",
        translation: "development",
        hidden: true,
        hints: ["Growth or progress", "15 letters, 'de ontw_______g'", "de ontwikkeling"],
      },
      { id: "4", word: "de innovatie", translation: "innovation", hidden: false },
      {
        id: "5",
        word: "???",
        answer: "de technologie",
        translation: "technology",
        hidden: true,
        hints: ["Modern tech systems", "14 letters, 'de tech______e'", "de technologie"],
      },
      { id: "6", word: "het onderwijs", translation: "education", hidden: false },
      {
        id: "7",
        word: "???",
        answer: "de vooruitgang",
        translation: "progress",
        hidden: true,
        hints: ["Forward movement", "14 letters, 'de voor______g'", "de vooruitgang"],
      },
      {
        id: "8",
        word: "???",
        answer: "de toekomst",
        translation: "the future",
        hidden: true,
        hints: ["What comes next", "11 letters, 'de toe_____'", "de toekomst"],
      },
      { id: "9", word: "de verandering", translation: "change", hidden: false },
      {
        id: "10",
        word: "???",
        answer: "de aanpassing",
        translation: "adaptation",
        hidden: true,
        hints: ["Adjusting to new things", "13 letters, 'de aanp_____g'", "de aanpassing"],
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        relationship: "???",
        answer: "hangt af van",
        hidden: true,
        hints: ["Depends on", "Three words", "hangt af van"],
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        relationship: "vereist",
        hidden: false,
      },
      {
        id: "e4-3",
        source: "4",
        target: "3",
        relationship: "???",
        answer: "versnelt",
        hidden: true,
        hints: ["Accelerates", "Starts with 'v'", "versnelt"],
      },
      {
        id: "e5-4",
        source: "5",
        target: "4",
        relationship: "mogelijk maakt",
        hidden: false,
      },
      {
        id: "e6-5",
        source: "6",
        target: "5",
        relationship: "???",
        answer: "bevordert",
        hidden: true,
        hints: ["Promotes", "Starts with 'b'", "bevordert"],
      },
      {
        id: "e3-7",
        source: "3",
        target: "7",
        relationship: "creëert",
        hidden: false,
      },
      {
        id: "e7-8",
        source: "7",
        target: "8",
        relationship: "???",
        answer: "vormt",
        hidden: true,
        hints: ["Forms or shapes", "Starts with 'v'", "vormt"],
      },
      {
        id: "e1-9",
        source: "1",
        target: "9",
        relationship: "ondergaat",
        hidden: false,
      },
      {
        id: "e9-10",
        source: "9",
        target: "10",
        relationship: "vereist",
        hidden: false,
      },
    ],
    theme: "social progress",
    difficulty: "advanced",
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
