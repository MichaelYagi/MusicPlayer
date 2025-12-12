# MIDI File Processing Capability

## Purpose
The MusicPlayer provides comprehensive MIDI file parsing capabilities, allowing users to import Standard MIDI Files and convert them to the application's beat and melody pattern formats.

## Requirements

### Requirement: MIDI File Format Support
The system SHALL parse Standard MIDI Files (Type 0 and Type 1) following the MIDI specification.

#### Scenario: MIDI file validation
- **WHEN** a MIDI file is uploaded
- **THEN** the system validates the MThd header chunk
- **AND** verifies proper MIDI file structure
- **AND** rejects files with invalid format

#### Scenario: Header chunk parsing
- **WHEN** parsing the MIDI header
- **THEN** the system extracts format type (0 or 1)
- **AND** reads number of tracks
- **AND** parses time division (PPQ - pulses per quarter note)
- **AND** rejects SMPTE time format (not supported)

#### Scenario: Track chunk parsing
- **WHEN** parsing MIDI track chunks
- **THEN** the system validates MTrk header for each track
- **AND** reads track length information
- **AND** processes all events within track boundaries

### Requirement: MIDI Event Processing
The system SHALL process all MIDI event types and extract musical information.

#### Scenario: Note events processing
- **WHEN** note on events are encountered
- **THEN** the system extracts note number (0-127)
- **AND** captures velocity information
- **AND** records timing information
- **AND** handles note velocity 0 as note off events

#### Scenario: Note off events processing
- **WHEN** note off events are encountered
- **THEN** the system matches note off with corresponding note on
- **AND** calculates note duration
- **AND** records release velocity if available

#### Scenario: Control change events
- **WHEN** control change events are encountered
- **THEN** the system extracts controller number and value
- **AND** processes standard MIDI controllers (volume, pan, expression)

#### Scenario: Program change events
- **WHEN** program change events are encountered
- **THEN** the system extracts instrument/patch number
- **AND** records instrument changes per channel

#### Scenario: Pitch bend events
- **WHEN** pitch bend events are encountered
- **THEN** the system extracts 14-bit pitch bend value
- **AND** processes pitch bend range and sensitivity

#### Scenario: Channel pressure events
- **WHEN** channel pressure (aftertouch) events are encountered
- **THEN** the system extracts pressure amount
- **AND** records channel-wide pressure changes

#### Scenario: Polyphonic key pressure
- **WHEN** polyphonic key pressure events are encountered
- **THEN** the system extracts specific note pressure
- **AND** records per-note aftertouch information

### Requirement: MIDI Meta Event Processing
The system SHALL process MIDI meta events to extract tempo and timing information.

#### Scenario: Tempo meta events
- **WHEN** tempo meta events (type 0x51) are encountered
- **THEN** the system extracts microseconds per quarter note
- **AND** calculates BPM tempo (60,000,000 / microseconds per quarter)
- **AND** applies tempo changes for timing calculations

#### Scenario: Time signature meta events
- **WHEN** time signature meta events are encountered
- **THEN** the system extracts numerator and denominator
- **AND** processes metronome click and division information

#### Scenario: Key signature meta events
- **WHEN** key signature meta events are encountered
- **THEN** the system extracts key and scale information
- **AND** records tonal context for the MIDI file

#### Scenario: Track name meta events
- **WHEN** track name meta events are encountered
- **THEN** the system extracts track names
- **AND** preserves track organization information

### Requirement: MIDI Data Structure Parsing
The system SHALL handle MIDI data encoding and variable-length quantities.

#### Scenario: Variable-length quantity parsing
- **WHEN** reading delta times and meta event lengths
- **THEN** the system correctly parses variable-length values
- **AND** handles multi-byte encoding (up to 4 bytes)
- **AND** processes continuation bits properly

#### Scenario: Running status handling
- **WHEN** MIDI messages use running status
- **THEN** the system correctly interprets omitted status bytes
- **AND** applies previous status byte to current data
- **AND** maintains proper event timing

#### Scenario: System exclusive handling
- **WHEN** system exclusive messages are encountered
- **THEN** the system skips SysEx messages safely
- **AND** finds proper message termination (0xF7)
- **AND** continues parsing subsequent events

### Requirement: MIDI to Pattern Conversion
The system SHALL convert parsed MIDI data to the application's beat and melody pattern formats.

#### Scenario: Note number to note name conversion
- **WHEN** converting MIDI note numbers
- **THEN** the system converts to scientific pitch notation (C4, F#5, etc.)
- **AND** handles all 128 MIDI note numbers (C-1 to G9)
- **AND** includes proper octave calculation

#### Scenario: Melody pattern generation
- **WHEN** creating melody patterns from MIDI
- **THEN** the system groups notes by timing for chord detection
- **AND** calculates note durations based on note off events
- **AND** inserts rests for timing gaps
- **AND** normalizes velocities to 0-1 range
- **AND** rounds durations to reasonable note values (e.g., 0.25 for sixteenth notes)

#### Scenario: Beat pattern generation
- **WHEN** creating beat patterns from MIDI
- **THEN** the system analyzes MIDI channel 10 for percussion
- **AND** maps MIDI percussion notes to internal beat sound types
- **AND** generates basic beat patterns for non-percussion content
- **AND** maintains tempo consistency with melody pattern

#### Scenario: Multi-track processing
- **WHEN** processing multi-track MIDI files
- **THEN** the system combines all tracks into unified patterns
- **AND** merges simultaneous notes from different tracks into chords
- **AND** preserves overall timing and structure

### Requirement: Timing and Tempo Conversion
The system SHALL properly convert MIDI timing to application timing systems.

#### Scenario: PPQ to beat conversion
- **WHEN** converting MIDI timing
- **THEN** the system converts PPQ (ticks) to beat values
- **AND** calculates timing based on time division from header
- **AND** maintains precise timing relationships

#### Scenario: Tempo change handling
- **WHEN** MIDI contains tempo changes
- **THEN** the system applies tempo changes appropriately
- **AND** maintains timing accuracy across tempo changes
- **AND** reports primary tempo for pattern generation

#### Scenario: Absolute time calculation
- **WHEN** processing MIDI events
- **THEN** the system calculates absolute timing for each event
- **AND** accumulates delta times for proper event sequencing
- **AND** maintains timing relationships between tracks

## Implementation Status

### ✅ Implemented
- MIDI file validation and header chunk parsing
- Track chunk parsing with proper boundary checking
- Note on/off event processing with velocity handling
- Control change, program change, and pitch bend event processing
- Channel pressure and polyphonic key pressure processing
- Tempo meta event extraction and BPM calculation
- Variable-length quantity parsing
- Running status handling
- System exclusive message skipping
- Note number to scientific pitch notation conversion
- Basic melody pattern generation with chords and rests
- Simple beat pattern generation for non-percussion content
- Multi-track processing with track merging
- PPQ to beat timing conversion

### ✅ Test Coverage
- MIDI file parsing with valid and invalid files
- Header chunk extraction and validation
- Note event processing and duration calculation
- Tempo meta event extraction and BPM calculation
- Variable-length quantity parsing
- MIDI to pattern conversion with basic scenarios

## Technical Notes

### MIDI File Structure Support
- Supports Standard MIDI Files (Type 0 and Type 1)
- Handles multiple tracks with proper event sequencing
- Processes all standard MIDI channel messages
- Extracts common meta events (tempo, time signature, key signature)

### Timing System
- Uses PPQ (pulses per quarter note) for precise timing
- Converts MIDI timing to application beat values
- Handles tempo changes and maintains timing accuracy
- Calculates absolute timing for event scheduling

### Conversion Algorithm
- Groups simultaneous notes for chord detection
- Calculates note durations from note on/off pairs
- Inserts rests for timing gaps between phrases
- Normalizes MIDI velocities to 0-1 volume range
- Rounds durations to musically sensible values

### Limitations
- Does not process SMPTE time format
- Limited percussion mapping from MIDI note numbers
- Simple beat pattern generation (doesn't analyze percussion tracks)
- No support for MIDI controller automation mapping
- No support for MIDI sysex message interpretation

## Dependencies

### Internal Modules
- MidiParser class for all MIDI processing operations
- MusicPlayer class for MIDI import workflow management

### External Dependencies
- None - pure JavaScript implementation

### Browser APIs
- File API for MIDI file reading
- DataView for binary data parsing
- ArrayBuffer for efficient binary data handling