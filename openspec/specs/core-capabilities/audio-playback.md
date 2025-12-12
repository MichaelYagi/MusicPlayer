# Audio Playback Capability

## Purpose
The MusicPlayer provides comprehensive audio synthesis and playback capabilities using the Web Audio API, supporting multiple instrument types, beat sounds, and real-time audio generation.

## Requirements

### Requirement: Audio Context Management
The system SHALL initialize and manage a Web Audio API context for audio synthesis.

#### Scenario: Audio context initialization
- **WHEN** the user first interacts with the application
- **THEN** the system initializes an AudioContext with proper fallback for browser compatibility
- **AND** sets up a master gain node for volume control
- **AND** resumes the context if it was suspended by the browser

#### Scenario: Audio support detection
- **WHEN** the application loads
- **THEN** the system checks for Web Audio API support
- **AND** provides appropriate error handling if not supported

#### Scenario: Audio context cleanup
- **WHEN** stopping playback or page unload
- **THEN** the system properly stops all active audio sources
- **AND** cleans up audio resources to prevent memory leaks

### Requirement: Note Synthesis
The system SHALL synthesize musical notes with configurable properties.

#### Scenario: Single note playback
- **WHEN** a note event is triggered with frequency, duration, and volume
- **THEN** the system creates an oscillator with the specified frequency
- **AND** applies appropriate envelope shaping (attack, decay, sustain, release)
- **AND** routes the audio through the master gain node

#### Scenario: Note frequency lookup
- **WHEN** a note name is provided (e.g., "C4", "F#5")
- **THEN** the system converts it to the corresponding frequency in Hz
- **AND** supports notes from C0 to C8 with sharps/flats

#### Scenario: Rest handling
- **WHEN** a "rest" note is encountered
- **THEN** the system skips audio generation for that event
- **AND** maintains timing for proper rhythm

### Requirement: Instrument Synthesis
The system SHALL provide multiple synthesized instrument types with unique timbres.

#### Scenario: Piano synthesis
- **WHEN** piano instrument is selected
- **THEN** the system creates harmonics (fundamental, 2nd, 3rd, 5th)
- **AND** applies piano-like envelope with fast attack and moderate decay
- **AND** combines harmonics with appropriate volume levels

#### Scenario: Guitar synthesis
- **WHEN** guitar instrument is selected
- **THEN** the system creates plucked string characteristics using sawtooth waveform
- **AND** applies low-pass filtering to simulate guitar body resonance
- **AND** implements quick attack with pluck-style decay

#### Scenario: Electric guitar synthesis
- **WHEN** electric guitar instrument is selected
- **THEN** the system applies distortion using waveshaper
- **AND** uses aggressive harmonics for rock-style tone
- **AND** includes appropriate filtering and envelope shaping

#### Scenario: Strings synthesis
- **WHEN** strings instrument is selected
- **THEN** the system creates ensemble effect with multiple detuned oscillators
- **AND** applies subtle vibrato (5Hz) for realistic string sound
- **AND** implements slow attack and long sustain envelope

#### Scenario: Basic waveform synthesis
- **WHEN** basic waveforms are selected (sine, square, sawtooth, triangle)
- **THEN** the system creates oscillators with the specified waveform type
- **AND** applies standard envelope shaping
- **AND** supports direct frequency input or note name conversion

### Requirement: Percussion and Beat Sounds
The system SHALL synthesize various percussion sounds for beat patterns.

#### Scenario: Drum sound synthesis
- **WHEN** kick drum sound is requested
- **THEN** the system generates sub-bass sine sweep (150Hz to 50Hz)
- **AND** adds attack click noise burst
- **AND** includes harmonic layer for body

#### Scenario: Snare synthesis
- **WHEN** snare drum sound is requested
- **THEN** the system generates filtered noise with multiple layers
- **AND** creates crack component (3500Hz bandpass)
- **AND** adds body component (1200Hz) and air component (9000Hz)

#### Scenario: Hi-hat synthesis
- **WHEN** hi-hat sound is requested
- **THEN** the system generates high-frequency filtered noise
- **AND** applies highpass filtering at 8000Hz
- **AND** includes bandpass filtering at 9000Hz for metallic character

#### Scenario: Clap synthesis
- **WHEN** clap sound is requested
- **THEN** the system generates multiple noise bursts
- **AND** creates pink noise to reduce high-frequency harshness
- **AND** applies bandpass filtering around 2000Hz

#### Scenario: Percussion sound library
- **WHEN** accessing beat sounds
- **THEN** the system provides 15 different percussion types:
  - kick, snare, hihat, tom, crash, ride, clap, rim
  - cowbell, tambourine, bongo, conga, floor_tom, splash, china

### Requirement: Chord and Polyphony Support
The system SHALL support playing multiple notes simultaneously for chords.

#### Scenario: Chord playback
- **WHEN** multiple notes are specified in a chord
- **THEN** the system creates separate oscillators for each note
- **AND** adjusts individual note volumes to prevent clipping
- **AND** synchronizes start and stop times for all chord notes

#### Scenario: Complex harmony
- **WHEN** chord includes more than 4 notes
- **THEN** the system manages polyphony without audio artifacts
- **AND** maintains CPU efficiency through proper resource management

### Requirement: Volume and Dynamics Control
The system SHALL provide comprehensive volume control and dynamic shaping.

#### Scenario: Master volume control
- **WHEN** master volume is adjusted
- **THEN** the system updates the master gain node value
- **AND** validates volume range (0.0 to 1.0)
- **AND** applies volume changes immediately to all active audio

#### Scenario: Per-note volume control
- **WHEN** individual notes have volume specifications
- **THEN** the system applies volume envelopes to individual gain nodes
- **AND** supports both single values and volume arrays for dynamic changes

#### Scenario: Volume envelope implementation
- **WHEN** volume envelope points are provided
- **THEN** the system applies linear or exponential ramps between points
- **AND** handles safe exponential ramps to avoid audio glitches

### Requirement: Audio Scheduling and Timing
The system SHALL provide precise audio scheduling for rhythmic accuracy.

#### Scenario: Real-time audio scheduling
- **WHEN** playback is initiated
- **THEN** the system calculates precise timing for all audio events
- **AND** schedules oscillators and gain nodes using AudioContext currentTime
- **AND** maintains synchronization between beat and melody tracks

#### Scenario: Tempo-based timing
- **WHEN** tempo is specified in BPM
- **THEN** the system calculates beat duration as 60/BPM seconds
- **AND** applies timing calculations consistently across all tracks

#### Scenario: Duration handling
- **WHEN** note durations are specified
- **THEN** the system schedules note release at appropriate times
- **AND** handles zero-duration items by skipping them entirely
- **AND** supports fractional beat durations (e.g., 0.25 for sixteenth notes)

### Requirement: Audio Resource Management
The system SHALL efficiently manage audio resources and prevent memory leaks.

#### Scenario: Active source tracking
- **WHEN** audio sources are created
- **THEN** the system tracks all active oscillators and buffer sources
- **AND** maintains an array of sources for cleanup operations

#### Scenario: Immediate audio termination
- **WHEN** stop is requested during playback
- **THEN** the system immediately stops all tracked audio sources
- **AND** disconnects all audio nodes
- **AND** suspends and resumes audio context for clean stop

## Implementation Status

### ✅ Implemented
- Audio context initialization and management
- Note synthesis with frequency lookup
- Piano, guitar, electric guitar, and strings instrument synthesis
- Basic waveform synthesis (sine, square, sawtooth, triangle)
- 15 percussion sound types including kick, snare, hihat, clap
- Chord and polyphony support
- Master and per-note volume control
- Volume envelope implementation with safe exponential ramps
- Real-time audio scheduling with precise timing
- Tempo-based timing calculations
- Active source tracking and cleanup
- Audio support detection

### ✅ Test Coverage
- Audio engine initialization and initialization error handling
- Note frequency conversion and validation
- Oscillator creation and basic playback
- Volume envelope application and normalization
- Beat sound synthesis and scheduling
- Master volume control functionality

## Technical Notes

### Audio Architecture
- Uses Web Audio API with AudioContext as central timing and processing hub
- Master gain node provides overall volume control and signal routing
- Individual gain nodes for each note enable independent dynamics
- Oscillator nodes generate pitched audio content
- Filter nodes shape timbre for different instruments
- Buffer sources generate noise for percussion sounds

### Performance Considerations
- Active sources are tracked for immediate cleanup on stop
- Volume envelopes use linear ramps when exponential ramps from zero would cause issues
- Zero-duration items are skipped to avoid unnecessary audio node creation
- Multiple oscillator components are managed as arrays for complex instruments

### Browser Compatibility
- Includes fallback for webkitAudioContext prefix
- Handles audio context suspension/resume for browser autoplay policies
- Gracefully degrades when Web Audio API is not supported

## Dependencies

### Browser APIs
- Web Audio API (AudioContext, OscillatorNode, GainNode, etc.)
- Browser audio context support detection

### Internal Modules
- AudioEngine class for all audio synthesis and management
- MusicPlayer class for application-level audio control