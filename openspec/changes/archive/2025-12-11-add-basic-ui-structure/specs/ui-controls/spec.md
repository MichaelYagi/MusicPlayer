## ADDED Requirements
### Requirement: Playback Controls
The system SHALL provide play and stop buttons for controlling audio playback.

#### Scenario: Play button activation
- **WHEN** user clicks the play button
- **THEN** the play button becomes disabled and stop button becomes enabled

#### Scenario: Stop button activation
- **WHEN** user clicks the stop button
- **THEN** the stop button becomes disabled and play button becomes enabled

### Requirement: Pattern Input Areas
The system SHALL provide separate text areas for beat and melody pattern input.

#### Scenario: Beat pattern input
- **WHEN** user accesses the beat input area
- **THEN** they can enter JSON-formatted beat patterns

#### Scenario: Melody pattern input
- **WHEN** user accesses the melody input area
- **THEN** they can enter JSON-formatted melody patterns

### Requirement: Default Pattern Examples
The system SHALL provide usable example patterns for both beat and melody inputs when the application loads.

#### Scenario: Default beat pattern
- **WHEN** the application loads
- **THEN** the beat input area contains a valid example beat pattern

#### Scenario: Default melody pattern
- **WHEN** the application loads
- **THEN** the melody input area contains a valid example melody pattern

#### Scenario: Examples are playable
- **WHEN** user clicks play with default examples
- **THEN** the patterns play successfully without errors

### Requirement: Status Feedback
The system SHALL provide a status box for displaying playback state and user feedback.

#### Scenario: Status update on play
- **WHEN** playback starts
- **THEN** the status box displays "Playing..."

#### Scenario: Status update on stop
- **WHEN** playback stops
- **THEN** the status box displays "Stopped"

#### Scenario: Error display
- **WHEN** an error occurs
- **THEN** the status box displays the error message

### Requirement: Responsive Layout
The system SHALL provide a responsive layout that works on desktop and mobile devices.

#### Scenario: Mobile view
- **WHEN** viewed on a mobile device
- **THEN** the layout adapts to smaller screen width

#### Scenario: Desktop view
- **WHEN** viewed on a desktop device
- **THEN** the layout utilizes available screen space efficiently