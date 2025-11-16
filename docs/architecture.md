# Architecture and Design

## 1. System Architecture Overview

### 1.1 Architecture Pattern

Nexus follows a **Component-Based Single Page Application (SPA)** architecture with **Context API State Management**.

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Environment                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   React Application                     │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │           GameProvider (Context API)              │  │ │
│  │  │  ┌─────────────────────────────────────────────┐ │  │ │
│  │  │  │          React Router (Routes)              │ │  │ │
│  │  │  │  ┌───────────────────────────────────────┐  │ │  │ │
│  │  │  │  │  Landing │ Setup │ Puzzle │ Completion│  │ │  │ │
│  │  │  │  └───────────────────────────────────────┘  │ │  │ │
│  │  │  └─────────────────────────────────────────────┘ │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓↑                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              localStorage (Browser API)                 │ │
│  │  • Puzzle Cache (24h TTL)                              │ │
│  │  • User Preferences                                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓↑
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │     Google Gemini API (gemini-2.0-flash)               │ │
│  │     • Puzzle Generation                                 │ │
│  │     • Retry Logic (3 attempts)                          │ │
│  │     • Fallback to Hardcoded Puzzles                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Architectural Layers

**Presentation Layer**
- React components (`/src/components`)
- Organized by feature/responsibility
- Pure rendering logic, minimal business logic

**State Management Layer**
- GameContext (`/src/context/GameContext.jsx`)
- Centralized state for entire application
- Custom hooks for specific domains

**Business Logic Layer**
- Custom hooks (`/src/hooks`)
- Utility functions (`/src/utils`)
- Separated from UI concerns

**Data Layer**
- localStorage for caching
- No traditional database
- External API integration

**Routing Layer**
- React Router DOM
- Client-side routing
- Four main routes

## 2. Component Architecture

### 2.1 Component Hierarchy

```
App (Router + GameProvider)
│
├── Landing Page (/)
│   ├── Hero Section
│   ├── Interactive Demo Graph
│   ├── Features Showcase
│   ├── How It Works
│   ├── Cognitive Science Explanation
│   └── Footer
│
├── Setup Page (/setup)
│   ├── Language Selector
│   ├── Difficulty Selector
│   ├── Theme Selector (Optional)
│   ├── Generate Button
│   ├── Loading Component
│   └── Footer
│
├── Puzzle Page (/game)
│   ├── Header
│   │   ├── Logo
│   │   ├── Timer Display
│   │   ├── Score Display
│   │   ├── Reset Button
│   │   └── Home Button
│   ├── Main Content Area
│   │   ├── GraphCanvas
│   │   │   ├── ReactFlow Container
│   │   │   ├── CustomNode (multiple instances)
│   │   │   └── CustomEdge (multiple instances)
│   │   └── Sidebar
│   │       ├── Progress Bar
│   │       ├── Statistics
│   │       └── Instructions
│   └── InputModal (conditional)
│       ├── Element Context
│       ├── Input Field
│       ├── Hint Buttons
│       ├── Submit Button
│       └── Feedback Display
│
└── Completion Page (/completion)
    ├── Celebration Animation
    ├── Score Card
    │   ├── Final Score
    │   ├── Time Taken
    │   ├── Hints Used
    │   ├── Mistakes Made
    │   └── Accuracy Percentage
    ├── Achievement Badges
    │   ├── Perfect Accuracy Badge
    │   ├── No Hints Badge
    │   ├── Speed Master Badge
    │   └── High Score Badge
    └── Action Buttons
        ├── Play Again
        ├── New Language
        └── Home
```

### 2.2 Component Catalog

| Component | Type | Responsibility | File |
|-----------|------|----------------|------|
| App | Container | Routing, Provider setup | `/src/App.jsx` |
| GameProvider | Context | Global state management | `/src/context/GameContext.jsx` |
| Landing | Page | Introduction, education | `/src/components/Pages/Landing.jsx` |
| Setup | Page | Puzzle configuration | `/src/components/Pages/Setup.jsx` |
| Puzzle | Page | Main gameplay | `/src/components/Pages/Puzzle.jsx` |
| Completion | Page | Results display | `/src/components/Pages/Completion.jsx` |
| Header | Game UI | Timer, score, controls | `/src/components/Game/Header.jsx` |
| Sidebar | Game UI | Progress, stats | `/src/components/Game/Sidebar.jsx` |
| GraphCanvas | Graph | React Flow wrapper | `/src/components/Graph/GraphCanvas.jsx` |
| CustomNode | Graph | Word node rendering | `/src/components/Graph/CustomNode.jsx` |
| CustomEdge | Graph | Relationship edge rendering | `/src/components/Graph/CustomEdge.jsx` |
| InputModal | Modal | Answer input interface | `/src/components/Modals/InputModal.jsx` |
| Button | UI | Reusable button | `/src/components/UI/Button.jsx` |
| Card | UI | Reusable card container | `/src/components/UI/Card.jsx` |
| Loading | UI | Loading indicators | `/src/components/UI/Loading.jsx` |
| Footer | UI | Footer with links | `/src/components/UI/Footer.jsx` |

## 3. Data Flow Architecture

### 3.1 State Flow Diagram

```
User Action (Click/Input)
        ↓
Component Event Handler
        ↓
Context Callback (e.g., submitAnswer, useHint)
        ↓
State Update (useState setter)
        ↓
Context Re-render
        ↓
Component Props Update
        ↓
UI Re-render
```

### 3.2 Puzzle Generation Flow

```
User Clicks "Generate Puzzle"
        ↓
Setup Component → startNewGame()
        ↓
useGemini Hook → generatePuzzle(lang, diff, theme)
        ↓
Check localStorage Cache
        ├─ Cache Hit (< 24h) → Return Cached Puzzle
        └─ Cache Miss → Proceed to API
                ↓
        Build Gemini Prompt (400+ lines)
                ↓
        Call Gemini API
                ├─ Success → Parse JSON → Validate Schema → Cache → Return
                ├─ Retry 1 (wait 1s) → Call API Again
                ├─ Retry 2 (wait 2s) → Call API Again
                ├─ Retry 3 (wait 4s) → Call API Again
                └─ All Failed → Return Fallback Puzzle
                        ↓
GameContext Updates → currentPuzzle State
        ↓
Navigate to /game Route
        ↓
Puzzle Component Renders Graph
```

### 3.3 Answer Validation Flow

```
User Enters Answer → Clicks Submit
        ↓
InputModal → handleSubmit()
        ↓
validateAnswer(userInput, correctAnswer, threshold=0.85)
        ↓
Normalize Strings (lowercase, remove diacritics, punctuation)
        ↓
Calculate Levenshtein Distance
        ↓
Calculate Similarity = 1 - (distance / maxLength)
        ↓
Is Similarity ≥ 85%?
        ├─ YES → Correct Answer
        │   ├─ Update userAnswers State
        │   ├─ Visual Success Feedback (green, animation)
        │   ├─ Check Completion
        │   └─ Close Modal
        └─ NO → Incorrect Answer
            ├─ Increment Mistakes Counter
            ├─ Visual Error Feedback (red, shake)
            ├─ Clear Input Field
            └─ Keep Modal Open
```

## 4. Data Models

### 4.1 Puzzle Schema

```typescript
interface Puzzle {
  nodes: Node[];
  edges: Edge[];
  theme: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface Node {
  id: string;                    // e.g., "1", "2", "3"
  word: string;                  // "pisica" or "???" if hidden
  translation: string;           // "cat"
  pronunciation?: string;        // Optional, for non-Latin scripts
  hidden: boolean;               // true if user must guess
  answer?: string;               // "pisica" (only if hidden)
  hints?: [string, string, string]; // 3-level hints (only if hidden)
}

interface Edge {
  id: string;                    // e.g., "e1-2"
  source: string;                // Node ID
  target: string;                // Node ID
  relationship: string;          // "este un" or "???" if hidden
  hidden: boolean;               // true if user must guess
  answer?: string;               // "este un" (only if hidden)
  hints?: [string, string, string]; // 3-level hints (only if hidden)
}
```

### 4.2 Game State Schema

```typescript
interface GameState {
  // Settings
  selectedLanguage: string;
  selectedDifficulty: string;
  selectedTheme: string;

  // Puzzle
  currentPuzzle: Puzzle | null;
  userAnswers: {
    nodes: Record<string, string>;  // nodeId → user's answer
    edges: Record<string, string>;  // edgeId → user's answer
  };
  hintsUsedMap: Record<string, number>; // elementId → hint level (0-3)
  completed: boolean;
  currentPage: "landing" | "setup" | "puzzle" | "completion";

  // Timer
  timer: {
    seconds: number;
    isRunning: boolean;
    start: () => void;
    pause: () => void;
    reset: () => void;
    formatTime: () => string;  // Returns "MM:SS"
  };

  // Score
  score: {
    hintsUsed: number;
    mistakes: number;
    timeSpent: number;
    calculateScore: () => number;  // 1000 - time - (hints*10) + bonus
    getAccuracy: () => number;     // Percentage
    reset: () => void;
  };
}
```

## 5. Design Patterns Used

### 5.1 Context Provider Pattern

**Purpose**: Centralized state management without prop drilling

**Implementation**:
```javascript
// Context creation
const GameContext = createContext(null);

// Provider component
export function GameProvider({ children }) {
  const [state, setState] = useState(/* ... */);
  return (
    <GameContext.Provider value={state}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook for consumption
export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
}

// Usage in components
function MyComponent() {
  const { currentPuzzle, submitAnswer } = useGame();
  // ...
}
```

**Benefits**:
- No prop drilling through multiple levels
- Single source of truth
- Easy to test and reason about

### 5.2 Custom Hooks Pattern

**Purpose**: Reusable stateful logic extraction

**Implementation**:
```javascript
// useTimer.js
export function useTimer(autoStart = false) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);

  // useEffect for interval logic
  // ...

  return {
    seconds,
    isRunning,
    start: () => setIsRunning(true),
    pause: () => setIsRunning(false),
    reset: () => { setSeconds(0); setIsRunning(false); },
    formatTime: () => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };
}
```

**Benefits**:
- Logic separation from UI
- Reusable across components
- Easier testing
- Composable hooks

**Examples in Codebase**:
- `useTimer`: Timer management
- `useScore`: Score calculation
- `useGemini`: API integration and caching

### 5.3 Composition Pattern

**Purpose**: Build complex UIs from small, focused components

**Example**:
```javascript
// Card component (generic container)
function Card({ children, className }) {
  return <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>;
}

// Composed usage
function ScoreCard() {
  return (
    <Card>
      <h2>Your Score</h2>
      <ScoreDisplay />
      <Statistics />
    </Card>
  );
}
```

**Benefits**:
- Reusability
- Testability
- Flexibility
- Maintainability

### 5.4 Render Props / Children Pattern

**Purpose**: Flexible component APIs

**Example** (React Flow usage):
```javascript
<ReactFlowProvider>
  <ReactFlow nodes={nodes} edges={edges}>
    <Controls />
    <Background />
  </ReactFlow>
</ReactFlowProvider>
```

## 6. Graph Layout Algorithm

### 6.1 Dagre Layout

**Library**: `dagre` v0.8.5

**Purpose**: Automatic hierarchical graph layout

**Algorithm**: Directed acyclic graph (DAG) layout
- **Direction**: Top to bottom
- **Node Spacing**: 150px horizontal, 100px vertical
- **Rank Direction**: TB (top-bottom)

**Implementation**:
```javascript
import dagre from 'dagre';

function getLayoutedElements(nodes, edges) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Extract positioned nodes
  const layoutedNodes = nodes.map((node) => {
    const position = dagreGraph.node(node.id);
    return { ...node, position: { x: position.x, y: position.y } };
  });

  return { nodes: layoutedNodes, edges };
}
```

**File**: `/src/components/Graph/GraphCanvas.jsx:179`

## 7. Routing Architecture

### 7.1 Route Structure

```javascript
<Router>
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/setup" element={<Setup />} />
    <Route path="/game" element={<Puzzle />} />
    <Route path="/completion" element={<Completion />} />
  </Routes>
</Router>
```

### 7.2 Navigation Flow

```
Landing (/)
    ↓ "Start Learning"
Setup (/setup)
    ↓ "Generate Puzzle"
Puzzle (/game)
    ↓ "All Correct"
Completion (/completion)
    ↓ "Play Again" → Setup
    ↓ "Home" → Landing
```

### 7.3 Route Guards

**Current**: None (all routes publicly accessible)

**Future Enhancement**: Protect `/game` and `/completion` routes if no puzzle loaded

## 8. Styling Architecture

### 8.1 Tailwind CSS Utility-First Approach

**Configuration**: Tailwind CSS v4.1.17 with Vite plugin

**Advantages**:
- Rapid development
- Consistent design system
- Responsive utilities
- Minimal CSS bundle (tree-shaken)

**Example**:
```javascript
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Submit
</button>
```

### 8.2 Animation Strategy

**Library**: Framer Motion v12.23.24

**Usage**:
- Page transitions
- Modal animations
- Success/error feedback
- Element entrance animations

**Example**:
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

## 9. Security Architecture

### 9.1 Threat Model

**Trust Boundary**: Client-side only (no backend)

**Attack Surface**:
- XSS via user input (mitigated by React auto-escaping)
- API key exposure (unavoidable in SPA, low risk)
- localStorage tampering (no security impact, user-only data)

### 9.2 Security Controls

| Threat | Mitigation | Implementation |
|--------|-----------|----------------|
| XSS | React auto-escaping | Default React behavior |
| API Key Exposure | Free tier, rate-limited | Google Gemini controls |
| Input Validation | Levenshtein distance | `/src/utils/validation.js` |
| Data Tampering | No impact (client-side only) | N/A |

## 10. Deployment Architecture

### 10.1 Build Process

```
Source Code (/src)
    ↓
Vite Build Tool
    ├─ Transpile React/JSX → JavaScript
    ├─ Bundle Modules
    ├─ Tree Shake Unused Code
    ├─ Minify JavaScript/CSS
    ├─ Hash Filenames for Cache Busting
    └─ Generate Source Maps
        ↓
Output (/dist)
    ├─ index.html
    ├─ assets/
    │   ├─ index-[hash].js
    │   ├─ index-[hash].css
    │   └─ [images]-[hash].svg
    └─ vite.svg
```

### 10.2 Deployment Target

**Type**: Static file hosting (JAMstack)

**Requirements**:
- Serve `index.html` for all routes (SPA fallback)
- HTTPS support
- Environment variable injection

**Recommended Platforms**:
- **Vercel**: Zero-config, auto-deployment
- **Netlify**: SPA redirects, easy env vars
- **Cloudflare Pages**: Fast CDN, free tier
- **GitHub Pages**: Free, simple setup

### 10.3 Environment Configuration

**Development**:
```bash
npm run dev
# Runs on http://localhost:5173
# Hot Module Replacement (HMR) enabled
```

**Production**:
```bash
npm run build
npm run preview
# Build outputs to /dist
# Preview on http://localhost:4173
```

## 11. Architectural Decision Records (ADRs)

### ADR-001: Use React Context API instead of Redux

**Decision**: Use Context API for state management

**Rationale**:
- Small app with limited state complexity
- No need for Redux DevTools (simple debugging sufficient)
- Fewer dependencies and boilerplate
- Sufficient performance for use case

**Consequences**: May need to refactor if state grows significantly complex

---

### ADR-002: Client-Side Only Architecture (No Backend)

**Decision**: Build as pure frontend SPA

**Rationale**:
- Simplifies deployment (static hosting)
- Reduces infrastructure costs (free hosting)
- Suitable for MVP/hackathon timeline
- No user accounts or sensitive data

**Consequences**:
- API key exposed in client code
- No server-side puzzle validation
- Limited to free tier API quotas
- Future: May need backend for user accounts

---

### ADR-003: Use Google Gemini API for Puzzle Generation

**Decision**: Use Gemini 2.0 Flash model for AI generation

**Rationale**:
- Free tier with generous quota (60 req/min)
- Fast response times (<5s typical)
- Good JSON output quality
- Easy integration via official SDK

**Consequences**:
- Dependency on external service
- Need fallback puzzles for reliability
- API changes may break integration

---

### ADR-004: Use React Flow for Graph Visualization

**Decision**: Use `@xyflow/react` (React Flow) library

**Rationale**:
- Mature, well-maintained library
- Custom node/edge support
- Automatic layout integration (Dagre)
- Good performance (up to 10 nodes)
- Zoom/pan controls built-in

**Consequences**: Learning curve for customization, large bundle size

---

This architecture supports the current feature set while maintaining flexibility for future enhancements.
