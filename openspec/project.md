# Project Context

## Purpose
The purpose of this project is to build a browser-based music player that allows users to input and play both beat and melody patterns using structured JSON. The player will feature start and stop buttons with proper state toggling, two stacked text areas for beat and melody input, and a status/message box for playback feedback. It will support expressive playback with simultaneous notes/beats, sustained durations, and dynamic volume arrays. Users will also be able to save and load patterns via localStorage for persistence, with the UI adapting to hide save/load options if localStorage is unavailable. Add Real-time visual feedback, tempo control, pattern editing tools and pattern validators features as well. Make instrument and dynamics optional for the melody and beat pattern.

## Tech Stack
- Frontend: Vanilla JavaScript (ES6+), HTML5, CSS3
- Audio: Web Audio API for sound synthesis and scheduling
- Storage: localStorage for saving/loading user patterns (optional, only if available)
- Testing (optional): Mocha + JSDOM for unit and integration testing
- Build Tools: None required (vanilla web project)
- Package Management: None (no external dependencies)

## Project Conventions

### Code Style
- Consistent indentation (2 spaces) and semantic HTML.
- Variables and functions use camelCase.
- JSON keys are lowercase and domain-specific (note, dur, instrument, vol, beat).
- Avoid hardcoding values; prefer configuration-driven logic.
- CSS uses IDs for key components (#beat-input, #melody-input, #status-box, #play-btn, #stop-btn).

### Architecture Patterns
- Separation of concerns:
 - UI (HTML/CSS)
 - Playback logic (JavaScript modules)
 - JSON parsing/validation (helper functions)
- State management: simple JS objects track playback state (playing, stopped, current position).
- Schema normalization: unify melody and beat structures to ensure consistent parsing and playback.
- Progressive enhancement: save/load UI only shown if localStorage is available.

### Testing Strategy
- Unit tests: validate JSON parsing, duration handling, and volume array interpolation.
- Integration tests: simulate user interactions (play/stop, input changes) with JSDOM.
- UI tests: ensure buttons toggle correctly and status box updates reliably.
- Playback tests: confirm synchronization between melody and beat inputs.

### Git Workflow
- Branching strategy: lightweight Git Flow
 - main for stable releases
 - feature branches for new components or audio logic
- Commit conventions: Conventional Commits (feat:, fix:, test:, docs:).
- Pull requests require code review and passing tests before merging.

## Domain Context
- Melody JSON structure: supports single notes, rests, and arrays of simultaneous notes. Durations are normalized to the shortest note, with longer notes sustaining.
- Beat JSON structure: mirrors melody schema with beat instead of note.
- Volume arrays: represent dynamic changes within a note/beat’s duration, interpolated smoothly.
- UI behavior: play/stop buttons toggle based on playback state; when music ends, stop is disabled and play is enabled.
- Status box: displays playback state, errors, or user feedback.
- Persistence: patterns can be saved/loaded via localStorage. If unavailable, save/load UI is hidden.

## Important Constraints
- Must run entirely in the browser with no external dependencies beyond vanilla JS, HTML, and CSS.
- Playback must remain synchronized between melody and beat inputs.
- JSON schema must be extensible for future instruments and beat types.
- UI must remain responsive and accessible (keyboard navigation, ARIA roles).
- Save/load functionality must gracefully degrade if localStorage is unavailable.

## External Dependencies
- Web Audio API for audio synthesis and scheduling.
- Mocha + JSDOM (optional) for testing.

## Project Structure
```
MusicPlayer/
├── index.html              # Main application entry point (planned)
├── css/
│   └── styles.css          # Application styles (planned)
├── js/
│   ├── main.js            # Application initialization (planned)
│   ├── audio-engine.js    # Web Audio API wrapper and synthesis (planned)
│   ├── json-parser.js     # JSON validation and parsing logic (planned)
│   ├── playback.js        # Playback scheduling and state management (planned)
│   └── storage.js         # localStorage save/load functionality (planned)
├── tests/
│   ├── unit/              # Unit tests for individual modules (planned)
│   └── integration/       # Integration tests for user workflows (planned)
└── openspec/              # Project documentation and specs (current)
    ├── AGENTS.md          # AI assistant instructions
    └── project.md         # This file - project context and specifications
```

## Development Environment
- No build process required - open `index.html` directly in browser
- Modern browser with Web Audio API support required
- Local development server recommended for testing (e.g., `python -m http.server`)
- Git for version control
- Current status: Project specification phase - implementation files not yet created

## Current Status
- Phase: Planning/Specification
- Files created: openspec/ documentation only
- Next steps: Implement core HTML structure, CSS styling, and JavaScript modules
- Testing framework: Mocha + JSDOM planned but not yet implemented
