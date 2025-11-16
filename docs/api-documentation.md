# API Documentation

## 1. External API Integration

### 1.1 Google Gemini API

**Base URL**: Via `@google/generative-ai` SDK (abstracted)

**Model**: `gemini-2.0-flash`

**Authentication**: API Key (via environment variable)

**Rate Limits**:
- Free Tier: 60 requests per minute
- Quota: Sufficient for moderate usage
- No billing required for MVP

---

#### Endpoint: Generate Content

**SDK Method**: `model.generateContent(prompt)`

**Request**:
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const result = await model.generateContent(prompt);
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Detailed instruction for puzzle generation (400+ lines) |

**Response**:
```javascript
{
  response: {
    text(): string,      // JSON string of puzzle
    candidates: [...],   // Alternative responses
    usageMetadata: {     // Token usage stats
      promptTokenCount: number,
      candidatesTokenCount: number,
      totalTokenCount: number
    }
  }
}
```

**Example Response** (cleaned):
```json
{
  "nodes": [
    {
      "id": "1",
      "word": "pisica",
      "translation": "cat",
      "hidden": false
    },
    {
      "id": "2",
      "word": "???",
      "answer": "mamifer",
      "translation": "mammal",
      "hidden": true,
      "hints": [
        "A warm-blooded vertebrate",
        "Has fur and feeds milk to young",
        "Starts with 'mam...'"
      ]
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2",
      "relationship": "este un",
      "hidden": false
    }
  ],
  "theme": "animals",
  "difficulty": "beginner"
}
```

**Error Handling**:
```javascript
try {
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(cleanResponse(text));
} catch (error) {
  if (error.status === 429) {
    // Rate limit exceeded
    await sleep(2000);
    return retry();
  } else if (error.status === 500) {
    // Server error
    return useFallbackPuzzle();
  } else {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
```

**Error Codes**:
| Code | Meaning | Action |
|------|---------|--------|
| 400 | Invalid request | Check prompt format |
| 429 | Rate limit exceeded | Retry with backoff |
| 500 | Server error | Use fallback puzzle |
| 503 | Service unavailable | Use fallback puzzle |

---

## 2. Internal API (Context + Hooks)

### 2.1 GameContext API

**Import**:
```javascript
import { useGame } from '../context/GameContext';
```

**Usage**:
```javascript
function MyComponent() {
  const game = useGame();
  // Access state and methods
}
```

**API Reference**:

#### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `selectedLanguage` | `string` | Currently selected language (default: 'romanian') |
| `selectedDifficulty` | `string` | Currently selected difficulty ('beginner', 'intermediate', 'advanced') |
| `selectedTheme` | `string` | Currently selected theme (optional) |
| `currentPuzzle` | `Puzzle \| null` | Active puzzle object |
| `userAnswers` | `{ nodes: Record<string, string>, edges: Record<string, string> }` | User's submitted answers |
| `hintsUsedMap` | `Record<string, number>` | Hint level per element (0-3) |
| `completed` | `boolean` | Whether puzzle is completed |
| `timer` | `TimerObject` | Timer state and controls (see 2.2) |
| `score` | `ScoreObject` | Score state and calculations (see 2.3) |

#### Methods

**setSelectedLanguage(language: string)**
- Sets the target learning language
- Example: `setSelectedLanguage('spanish')`

**setSelectedDifficulty(difficulty: string)**
- Sets puzzle difficulty
- Valid values: 'beginner', 'intermediate', 'advanced'
- Example: `setSelectedDifficulty('intermediate')`

**setSelectedTheme(theme: string)**
- Sets puzzle theme (optional)
- Valid values: '', 'animals', 'food', 'travel', etc.
- Example: `setSelectedTheme('animals')`

**setCurrentPuzzle(puzzle: Puzzle)**
- Updates the active puzzle
- Usually called after generation
- Example: `setCurrentPuzzle(generatedPuzzle)`

**submitNodeAnswer(nodeId: string, answer: string)**
- Submits user's answer for a hidden node
- Updates `userAnswers.nodes`
- Example: `submitNodeAnswer('2', 'mamifer')`

**submitEdgeAnswer(edgeId: string, answer: string)**
- Submits user's answer for a hidden edge
- Updates `userAnswers.edges`
- Example: `submitEdgeAnswer('e1-2', 'este un')`

**useHint(elementId: string)**
- Increments hint level for element
- Calls `score.addHint()` to deduct points
- Example: `useHint('node-2')`

**getHintLevel(elementId: string): number**
- Returns current hint level (0-3) for element
- Example: `const level = getHintLevel('node-2')`

**checkCompletion(): boolean**
- Checks if all hidden elements are correctly answered
- Returns `true` if complete, `false` otherwise
- Example: `if (checkCompletion()) { navigate('/completion'); }`

**setCompleted(completed: boolean)**
- Manually set completion status
- Example: `setCompleted(true)`

---

### 2.2 Timer API (via useTimer hook)

**Access**: Through `useGame().timer` or directly via `useTimer()`

**Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `seconds` | `number` | Elapsed time in seconds |
| `isRunning` | `boolean` | Whether timer is currently running |

**Methods**:

**start()**
- Starts the timer
- Example: `timer.start()`

**pause()**
- Pauses the timer
- Example: `timer.pause()`

**reset()**
- Resets timer to 0 and stops it
- Example: `timer.reset()`

**formatTime(): string**
- Returns formatted time string (MM:SS)
- Example: `timer.formatTime()` → `"02:34"`

**Usage Example**:
```javascript
function Header() {
  const { timer } = useGame();

  return (
    <div>
      <span>Time: {timer.formatTime()}</span>
      <button onClick={timer.pause}>Pause</button>
      <button onClick={timer.start}>Resume</button>
    </div>
  );
}
```

---

### 2.3 Score API (via useScore hook)

**Access**: Through `useGame().score` or directly via `useScore()`

**Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `hintsUsed` | `number` | Total hints used |
| `mistakes` | `number` | Total incorrect submissions |
| `timeSpent` | `number` | Time spent in seconds |

**Methods**:

**addHint()**
- Increments hints used counter
- Deducts 10 points from score
- Example: `score.addHint()`

**addMistake()**
- Increments mistakes counter
- Affects accuracy percentage
- Example: `score.addMistake()`

**updateTime(seconds: number)**
- Updates time spent
- Called before calculating final score
- Example: `score.updateTime(timer.seconds)`

**calculateScore(): number**
- Calculates final score
- Formula: `max(0, 1000 - timeSpent - (hintsUsed * 10) + (mistakes === 0 ? 50 : 0))`
- Returns: `0-1050`
- Example: `const finalScore = score.calculateScore()`

**getAccuracy(): number**
- Calculates accuracy percentage
- Formula: `((correctAttempts / totalAttempts) * 100).toFixed(1)`
- Returns: String representation (e.g., "95.5")
- Example: `const accuracy = score.getAccuracy()`

**reset()**
- Resets all score metrics to 0
- Example: `score.reset()`

**Usage Example**:
```javascript
function CompletionPage() {
  const { score, timer } = useGame();

  useEffect(() => {
    score.updateTime(timer.seconds);
  }, []);

  const finalScore = score.calculateScore();
  const accuracy = score.getAccuracy();

  return (
    <div>
      <h2>Final Score: {finalScore}</h2>
      <p>Accuracy: {accuracy}%</p>
      <p>Time: {timer.formatTime()}</p>
      <p>Hints Used: {score.hintsUsed}</p>
      <p>Mistakes: {score.mistakes}</p>
    </div>
  );
}
```

---

### 2.4 useGemini Hook API

**Import**:
```javascript
import { useGemini } from '../hooks/useGemini';
```

**Usage**:
```javascript
function SetupPage() {
  const { generatePuzzle, loading, error } = useGemini();

  const handleGenerate = async () => {
    const puzzle = await generatePuzzle('romanian', 'beginner', 'animals');
    setCurrentPuzzle(puzzle);
  };
}
```

**API Reference**:

**generatePuzzle(language, difficulty, theme): Promise<Puzzle>**

Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `language` | `string` | Yes | Target language (e.g., 'romanian', 'spanish') |
| `difficulty` | `'beginner' \| 'intermediate' \| 'advanced'` | Yes | Puzzle difficulty |
| `theme` | `string` | No | Optional theme (e.g., 'animals', 'food') |

Returns: `Promise<Puzzle>` - Generated or cached puzzle

Behavior:
1. Checks localStorage cache first
2. If cache hit (< 24h), returns cached puzzle
3. If cache miss, calls Gemini API
4. Retries up to 3 times with exponential backoff
5. Falls back to hardcoded puzzle if all retries fail
6. Caches successful API responses

**loading: boolean**
- `true` when puzzle generation in progress
- `false` when idle or complete

**error: Error | null**
- `null` when no error
- Error object if generation failed (rare, due to fallbacks)

**Example**:
```javascript
const { generatePuzzle, loading } = useGemini();

if (loading) return <Loading />;

const puzzle = await generatePuzzle('spanish', 'intermediate', 'travel');
console.log(puzzle.nodes.length); // 7 (intermediate has 7 nodes)
```

---

## 3. Validation Utilities API

### 3.1 validateAnswer()

**Import**:
```javascript
import { validateAnswer } from '../utils/validation';
```

**Signature**:
```javascript
validateAnswer(
  userAnswer: string,
  correctAnswer: string,
  threshold: number = 0.85
): { isCorrect: boolean, similarity: number }
```

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `userAnswer` | `string` | - | User's submitted answer |
| `correctAnswer` | `string` | - | Correct answer from puzzle |
| `threshold` | `number` | 0.85 | Minimum similarity for acceptance (0-1) |

**Returns**:
```typescript
{
  isCorrect: boolean,    // true if similarity >= threshold
  similarity: number     // 0-1, where 1 is exact match
}
```

**Examples**:
```javascript
validateAnswer("pisică", "pisica");
// { isCorrect: true, similarity: 1 } (diacritics removed)

validateAnswer("pisiica", "pisica");
// { isCorrect: true, similarity: 0.857 } (1 extra char, still above 85%)

validateAnswer("cat", "pisica");
// { isCorrect: false, similarity: 0 } (different words)

validateAnswer("animal", "animale", 0.85);
// { isCorrect: true, similarity: 0.857 } (plural vs singular)
```

---

### 3.2 normalizeString()

**Import**:
```javascript
import { normalizeString } from '../utils/validation';
```

**Signature**:
```javascript
normalizeString(str: string): string
```

**Behavior**:
- Converts to lowercase
- Trims whitespace
- Removes diacritical marks (accents)
- Removes punctuation

**Examples**:
```javascript
normalizeString("Café!");        // "cafe"
normalizeString("über-cool");    // "ubercool"
normalizeString("It's naïve");   // "its naive"
```

---

## 4. Storage Utilities API

### 4.1 storage.savePuzzle()

**Import**:
```javascript
import { storage } from '../utils/storage';
```

**Signature**:
```javascript
storage.savePuzzle(key: string, puzzle: Puzzle): void
```

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | `string` | Cache key (format: `${language}_${difficulty}_${theme}`) |
| `puzzle` | `Puzzle` | Puzzle object to cache |

**Example**:
```javascript
storage.savePuzzle('romanian_beginner_animals', puzzleObject);
```

---

### 4.2 storage.getPuzzle()

**Signature**:
```javascript
storage.getPuzzle(
  key: string,
  maxAge: number = 86400000
): Puzzle | null
```

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | `string` | - | Cache key |
| `maxAge` | `number` | 86400000 | Max age in milliseconds (default: 24h) |

**Returns**: `Puzzle | null`
- Puzzle object if found and not expired
- `null` if not found or expired

**Example**:
```javascript
const cached = storage.getPuzzle('romanian_beginner_animals');
if (cached) {
  console.log('Using cached puzzle');
  return cached;
}
```

---

### 4.3 storage.clearPuzzles()

**Signature**:
```javascript
storage.clearPuzzles(): void
```

**Behavior**: Removes all cached puzzles from localStorage

**Example**:
```javascript
storage.clearPuzzles();
console.log('Cache cleared');
```

---

## 5. Type Definitions (TypeScript Reference)

While the project uses JavaScript, here are TypeScript definitions for reference:

```typescript
// Puzzle Types
interface Puzzle {
  nodes: Node[];
  edges: Edge[];
  theme: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Node {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  hidden: boolean;
  answer?: string;
  hints?: [string, string, string];
}

interface Edge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  hidden: boolean;
  answer?: string;
  hints?: [string, string, string];
}

// Game State Types
interface GameState {
  selectedLanguage: string;
  selectedDifficulty: string;
  selectedTheme: string;
  currentPuzzle: Puzzle | null;
  userAnswers: {
    nodes: Record<string, string>;
    edges: Record<string, string>;
  };
  hintsUsedMap: Record<string, number>;
  completed: boolean;
  timer: TimerState;
  score: ScoreState;
}

interface TimerState {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  formatTime: () => string;
}

interface ScoreState {
  hintsUsed: number;
  mistakes: number;
  timeSpent: number;
  addHint: () => void;
  addMistake: () => void;
  updateTime: (seconds: number) => void;
  calculateScore: () => number;
  getAccuracy: () => number;
  reset: () => void;
}

// Validation Types
interface ValidationResult {
  isCorrect: boolean;
  similarity: number;
}
```

---

## 6. Error Handling Patterns

### 6.1 API Error Handling

```javascript
try {
  const puzzle = await generatePuzzle(language, difficulty, theme);
  setCurrentPuzzle(puzzle);
} catch (error) {
  console.error('Puzzle generation failed:', error);
  // Fallback is automatic in useGemini hook
  // User sees fallback puzzle, no error UI
}
```

### 6.2 Validation Error Handling

```javascript
try {
  const { isCorrect } = validateAnswer(userInput, correctAnswer);
  if (isCorrect) {
    submitNodeAnswer(nodeId, userInput);
  } else {
    score.addMistake();
    showError('Incorrect, try again!');
  }
} catch (error) {
  console.error('Validation error:', error);
  showError('Something went wrong');
}
```

---

## 7. Rate Limiting and Best Practices

### 7.1 Gemini API Rate Limits

**Free Tier**: 60 requests per minute

**Mitigation**:
- Cache puzzles for 24 hours (reduces API calls by ~95%)
- Exponential backoff on failures
- Fallback puzzles for offline/over-limit scenarios

**Best Practices**:
- Don't regenerate puzzles unnecessarily
- Clear cache only when needed
- Monitor API usage via Google Cloud Console

### 7.2 localStorage Best Practices

**Limits**: ~5-10MB per origin (browser-dependent)

**Current Usage**: ~50KB for 10 cached puzzles (well within limits)

**Best Practices**:
- Periodically clear expired entries
- Monitor storage quota
- Handle quota exceeded errors gracefully

```javascript
try {
  storage.savePuzzle(key, puzzle);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    storage.clearPuzzles(); // Clear all and retry
    storage.savePuzzle(key, puzzle);
  }
}
```

---

This API documentation provides comprehensive reference for all internal and external APIs used in the Nexus application.
