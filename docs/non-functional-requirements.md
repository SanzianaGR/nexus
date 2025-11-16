# Non-Functional Requirements

## 1. Performance Requirements

### NFR-P-01: Page Load Time
- **Requirement**: Initial page load shall complete within 3 seconds on standard broadband
- **Measurement**: Time to First Contentful Paint (FCP)
- **Current Performance**: Vite provides optimized bundling with code splitting
- **Implementation**: Lazy loading, minification, tree shaking

### NFR-P-02: Puzzle Generation Time
- **Requirement**: Puzzle generation shall complete within 10 seconds
- **Measurement**: Time from "Generate Puzzle" click to game page load
- **Current Performance**:
  - Cached puzzles: < 1 second
  - API generation: 3-8 seconds (depends on Gemini API)
  - Fallback: < 1 second
- **Implementation**: localStorage caching, 24-hour TTL

### NFR-P-03: Graph Rendering Performance
- **Requirement**: Graph shall render smoothly at 60fps with up to 10 nodes
- **Measurement**: Frame rate during zoom/pan operations
- **Current Performance**: React Flow optimized for performance
- **Implementation**: Dagre layout algorithm, GPU-accelerated transforms

### NFR-P-04: Answer Validation Speed
- **Requirement**: Answer validation shall complete within 100ms
- **Measurement**: Time from submit to feedback display
- **Current Performance**: < 50ms (Levenshtein algorithm is O(n*m))
- **Implementation**: Efficient string comparison algorithm

## 2. Scalability Requirements

### NFR-S-01: Browser Compatibility
- **Requirement**: Support modern evergreen browsers (last 2 versions)
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **ES Version**: ES2020+ required
- **Not Supported**: Internet Explorer 11

### NFR-S-02: Device Compatibility
- **Requirement**: Responsive design for mobile, tablet, and desktop
- **Mobile**: 320px min width (iPhone SE)
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Implementation**: Tailwind CSS responsive utilities

### NFR-S-03: Concurrent Users
- **Requirement**: N/A (client-side only, no backend)
- **Note**: Each user runs independently in browser

## 3. Reliability Requirements

### NFR-R-01: API Failure Handling
- **Requirement**: Application shall remain functional when Gemini API unavailable
- **Implementation**:
  - 3 retry attempts with exponential backoff
  - Fallback to hardcoded puzzles
  - No user-facing errors
- **Uptime Target**: 99% availability (via fallback)

### NFR-R-02: Data Persistence
- **Requirement**: Cached puzzles shall persist across browser sessions
- **Implementation**: localStorage (survives browser restart)
- **Limitation**: Cleared if user clears browser data
- **Expiration**: 24-hour TTL

### NFR-R-03: Error Recovery
- **Requirement**: Application errors shall not crash entire app
- **Current**: Basic error handling in components
- **Future**: Error boundaries for component isolation

## 4. Usability Requirements

### NFR-U-01: Learning Curve
- **Requirement**: New users shall understand gameplay within 2 minutes
- **Implementation**:
  - Interactive demo on landing page
  - Clear instructions in sidebar
  - Progressive hint system

### NFR-U-02: Accessibility (WCAG 2.1 Level A Target)
- **Color Contrast**: Meets minimum contrast ratios
- **Keyboard Navigation**: Basic support via native HTML
- **Screen Readers**: Limited support (needs improvement)
- **Focus Indicators**: Visible focus states
- **Future**: ARIA labels, skip links, keyboard shortcuts

### NFR-U-03: Internationalization
- **Requirement**: Support 7 target languages for learning content
- **Current**: Language-specific vocabulary in puzzles
- **UI Language**: English only
- **Future**: Localized UI for native speakers

## 5. Security Requirements

### NFR-SEC-01: API Key Protection
- **Requirement**: Protect Gemini API key from unauthorized use
- **Current Implementation**:
  - Environment variable (VITE_GEMINI_API_KEY)
  - **Note**: Exposed in client-side bundle (unavoidable for SPA)
- **Risk**: Low (free tier API, rate-limited by Google)
- **Future**: Backend proxy to hide API key

### NFR-SEC-02: Data Privacy
- **Requirement**: No personal data collected or transmitted
- **Current**:
  - No user accounts
  - No analytics
  - No cookies (except localStorage for caching)
  - No third-party tracking
- **Compliance**: GDPR-friendly (no PII collected)

### NFR-SEC-03: XSS Prevention
- **Requirement**: Prevent cross-site scripting attacks
- **Implementation**:
  - React auto-escapes JSX content
  - No `dangerouslySetInnerHTML` usage
  - User input sanitized via validation
- **Risk**: Low (no user-generated content displayed)

### NFR-SEC-04: Input Validation
- **Requirement**: Validate all user inputs
- **Implementation**:
  - Answer validation: String length limits, character filtering
  - Language/difficulty selection: Restricted to predefined options
  - No SQL injection risk (no database)

## 6. Maintainability Requirements

### NFR-M-01: Code Organization
- **Requirement**: Clear separation of concerns
- **Implementation**:
  - Component-based architecture
  - Custom hooks for business logic
  - Utility modules for shared functions
  - Consistent file naming conventions

### NFR-M-02: Code Documentation
- **Requirement**: Key functions shall have inline comments
- **Current**: Moderate documentation
- **Files**: Complex algorithms (validation, layout) documented
- **Future**: JSDoc comments for all exported functions

### NFR-M-03: Dependency Management
- **Requirement**: Keep dependencies up to date
- **Current**: Latest versions of all packages (as of build date)
- **Update Frequency**: Quarterly recommended
- **Security**: Dependabot alerts enabled (if GitHub repo)

## 7. Portability Requirements

### NFR-PO-01: Deployment Flexibility
- **Requirement**: Deployable to any static hosting platform
- **Compatible Platforms**:
  - Vercel
  - Netlify
  - GitHub Pages
  - Cloudflare Pages
  - AWS S3 + CloudFront
- **Requirements**: Static file hosting, SPA fallback routing

### NFR-PO-02: Build Portability
- **Requirement**: Buildable on any OS with Node.js
- **Node Version**: 18+ recommended
- **OS**: Windows, macOS, Linux
- **Dependencies**: npm or yarn

## 8. Compliance Requirements

### NFR-C-01: Open Source Licensing
- **Requirement**: Comply with all dependency licenses
- **License Check**: MIT, Apache 2.0 (permissive)
- **Attribution**: Google Gemini AI credit in footer

### NFR-C-02: Educational Use
- **Requirement**: Free for educational purposes
- **Current**: Free tier Gemini API (60 requests/minute)
- **Limitation**: API quota may limit concurrent users

## 9. Quality Metrics

| Metric | Target | Current Status |
|--------|--------|---------------|
| Page Load Time | < 3s | ✅ ~1-2s |
| Puzzle Generation | < 10s | ✅ 3-8s |
| Graph FPS | 60fps | ✅ Smooth |
| Mobile Responsive | 320px+ | ✅ Yes |
| Browser Support | Modern | ✅ Chrome, Firefox, Safari, Edge |
| API Uptime | 99% | ✅ (via fallback) |
| Code Coverage | N/A | ❌ No tests |
| Accessibility | WCAG A | ⚠️ Partial |

## 10. Future Enhancements

### NFR-F-01: Testing Coverage
- Unit tests for validation logic
- Component tests for UI
- E2E tests for user flows
- Target: 80% coverage

### NFR-F-02: Performance Monitoring
- Real User Monitoring (RUM)
- Error tracking (Sentry)
- Analytics (privacy-friendly)

### NFR-F-03: Offline Support
- Service worker for offline caching
- Fallback puzzles available offline
- "Add to Home Screen" support (PWA)
