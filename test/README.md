# Music Player Test Suite

This directory contains comprehensive Mocha-based tests for the Music Player application.

## Test Structure

### Test Files

- **`storage.test.js`** - Tests for the StorageModule
  - Pattern validation (beat/melody)
  - BPM validation
  - Pattern management (save/load/update/delete)
  - Project management
  - Preferences management
  - Data import/export

- **`main.test.js`** - Tests for the main MusicPlayer class
  - Pattern duration calculation
  - Note to frequency conversion
  - Volume normalization
  - Pattern validation
  - Visualization
  - Audio scheduling
  - Tempo control
  - Volume control

- **`audio-engine.test.js`** - Tests for the AudioEngine class
  - Initialization
  - Note playing
  - Beat playing
  - Volume control
  - Source management
  - Noise generation
  - Error handling

- **`midi-parser.test.js`** - Tests for the MidiParser class
  - Basic parsing
  - Note extraction
  - Beat pattern generation
  - Melody pattern generation
  - Duration quantization
  - Velocity to volume conversion
  - Error handling
  - BPM detection

- **`integration.test.js`** - Cross-module integration tests
  - Player-Storage integration
  - Player-Audio integration
  - MIDI-Player integration
  - Duration 0 handling integration
  - Project management integration
  - Error handling integration
  - Performance tests

### Configuration Files

- **`setup.js`** - Test environment setup
  - DOM mocking with JSDOM
  - Web Audio API mocking
  - localStorage mocking
  - Console output suppression

- **`runner.html`** - Browser-based test runner
  - Runs tests in actual browser environment
  - Provides visual test results
  - Links back to main application
  - Uses Mocha and Chai loaded from CDN

## Running Tests

### Command Line (Node.js)

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage (HTML report)
npm run test:coverage

# Run tests with coverage (LCOV format for CI)
npm run test:coverage:lcov
```

### Browser Testing

1. Start local server:
```bash
npm run test:browser
```

2. Open `http://localhost:8000/test/runner.html` in your browser

## Key Test Scenarios

### Duration 0 Handling
Comprehensive tests ensure that items with `dur: 0` are:
- ✅ Accepted during validation
- ✅ Ignored during playback
- ✅ Excluded from visualization
- ✅ Not counted in duration calculations

### Pattern Validation
Tests cover:
- Valid/invalid beat patterns
- Valid/invalid melody patterns
- BPM range validation
- Chord patterns
- Rest patterns
- Frequency-based patterns

### Audio Engine
Tests verify:
- Proper initialization
- Note and beat playing
- Volume control
- Source management
- Error handling

### MIDI Parsing
Tests ensure:
- Correct note extraction
- Beat pattern generation
- Melody pattern generation
- Duration quantization
- Velocity conversion

### Integration
Cross-module tests verify:
- Data flow between components
- Consistent behavior across modules
- Error propagation
- Performance with large datasets

## Code Coverage

### What is Code Coverage?
Code coverage measures how much of your source code is executed when running tests. It helps identify:
- Untested code paths
- Dead code that can be removed
- Critical areas that need more testing
- Overall test quality metrics

### Coverage Tools
This project uses **NYC** (Istanbul) for code coverage with the following features:

#### Coverage Reports
- **HTML Report**: Interactive web-based coverage report
- **Text Report**: Command-line summary
- **LCOV Report**: For CI/CD integration

#### Coverage Metrics
- **Lines**: Percentage of executable lines tested
- **Functions**: Percentage of functions tested  
- **Branches**: Percentage of conditional branches tested
- **Statements**: Percentage of statements tested

#### Coverage Thresholds
- **Target**: 80% minimum for all metrics
- **Watermarks**: 50% (low), 80% (medium), 95% (high)

### Running Coverage

```bash
# Generate HTML coverage report
npm run test:coverage

# Generate LCOV report for CI/CD
npm run test:coverage:lcov
```

### Coverage Reports
After running `npm run test:coverage`, you'll find:
- `coverage/index.html` - Interactive coverage report
- `coverage/coverage-summary.txt` - Text summary
- `coverage/lcov.info` - LCOV format data

### Coverage Goals
The test suite aims for comprehensive coverage of:
- ✅ All public methods (target: 95%+)
- ✅ Edge cases (duration 0, invalid data) (target: 90%+)
- ✅ Error conditions (target: 85%+)
- ✅ Integration scenarios (target: 80%+)
- ✅ Performance considerations (target: 75%+)

### Improving Coverage
1. Run coverage report: `npm run test:coverage`
2. Open `coverage/index.html` in browser
3. Look for red/uncovered lines
4. Add tests for uncovered code paths
5. Aim for 80%+ coverage across all metrics

## Adding New Tests

When adding new functionality:

1. Add unit tests to the appropriate `.test.js` file
2. Add integration tests to `integration.test.js`
3. Update this README with new test scenarios
4. Ensure tests cover both success and failure cases

## Test Best Practices

- Use descriptive test names
- Test both positive and negative cases
- Mock external dependencies
- Clean up after each test
- Use assertions that provide clear feedback
- Group related tests in `describe` blocks