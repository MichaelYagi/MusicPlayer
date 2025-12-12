const MusicPlayer = require('../js/main.js');

describe('Music Player', () => {
    let player;
    
    beforeEach(() => {
        // Create DOM elements needed for the player
        document.body.innerHTML = `
            <div id="beat-input"></div>
            <div id="melody-input"></div>
            <div id="beat-viz"></div>
            <div id="melody-viz"></div>
            <div id="metronome-dot"></div>
        `;
        
        player = new MusicPlayer();
    });
    
    describe('Pattern Duration Calculation', () => {
        it('should calculate duration for simple beat patterns', () => {
            const pattern = [
                {"beat": "kick", "dur": 1},
                {"beat": "snare", "dur": 1},
                {"beat": "hihat", "dur": 0.5}
            ];
            
            const duration = player.calculatePatternDuration(pattern, 'beat');
            expect(duration).to.equal(2.5);
        });
        
        it('should calculate duration for simple melody patterns', () => {
            const pattern = [
                {"note": "C4", "dur": 1},
                {"note": "E4", "dur": 1},
                {"note": "G4", "dur": 0.5}
            ];
            
            const duration = player.calculatePatternDuration(pattern, 'melody');
            expect(duration).to.equal(2.5);
        });
        
        it('should ignore duration 0 items in beat patterns', () => {
            const pattern = [
                {"beat": "kick", "dur": 1},
                {"beat": "snare", "dur": 0},  // Should be ignored
                {"beat": "hihat", "dur": 0.5}
            ];
            
            const duration = player.calculatePatternDuration(pattern, 'beat');
            expect(duration).to.equal(1.5);
        });
        
        it('should ignore duration 0 items in melody patterns', () => {
            const pattern = [
                {"note": "C4", "dur": 1},
                {"note": "D4", "dur": 0},  // Should be ignored
                {"note": "E4", "dur": 0.5}
            ];
            
            const duration = player.calculatePatternDuration(pattern, 'melody');
            expect(duration).to.equal(1.5);
        });
        
        it('should handle patterns with BPM', () => {
            const patternWithBPM = {
                pattern: [{"beat": "kick", "dur": 1}, {"beat": "snare", "dur": 1}],
                bpm: 120
            };
            
            const duration = player.calculatePatternDuration(patternWithBPM, 'beat');
            expect(duration).to.equal(2);
        });
        
        it('should handle patterns with beats property', () => {
            const patternWithBeats = {
                beats: [{"beat": "kick", "dur": 1}, {"beat": "snare", "dur": 1}],
                bpm: 120
            };
            
            const duration = player.calculatePatternDuration(patternWithBeats, 'beat');
            expect(duration).to.equal(2);
        });
        
        it('should handle patterns with notes property', () => {
            const patternWithNotes = {
                notes: [{"note": "C4", "dur": 1}, {"note": "E4", "dur": 1}],
                bpm: 120
            };
            
            const duration = player.calculatePatternDuration(patternWithNotes, 'melody');
            expect(duration).to.equal(2);
        });
    });
    
    describe('Note to Frequency Conversion', () => {
        it('should convert notes correctly', () => {
            expect(player.noteToFrequency('A4')).to.equal(440);
            expect(player.noteToFrequency('C4')).to.equal(261.63);
            expect(player.noteToFrequency('C#4')).to.equal(277.18);
            expect(player.noteToFrequency('D4')).to.equal(293.66);
        });
        
        it('should handle different octaves', () => {
            expect(player.noteToFrequency('A3')).to.equal(220);
            expect(player.noteToFrequency('A5')).to.equal(880);
        });
        
        it('should return null for invalid notes', () => {
            expect(player.noteToFrequency('X4')).to.be.null;
            expect(player.noteToFrequency('')).to.be.null;
            expect(player.noteToFrequency(null)).to.be.null;
        });
    });
    
    describe('Volume Normalization', () => {
        it('should normalize single volume values', () => {
            const result = player.normalizeVolume(0.8);
            expect(result).to.deep.equal([0.8]);
        });
        
        it('should normalize volume arrays', () => {
            const result = player.normalizeVolume([0.5, 0.8, 1.0]);
            expect(result).to.deep.equal([0.5, 0.8, 1.0]);
        });
        
        it('should handle missing volume', () => {
            const result = player.normalizeVolume(undefined);
            expect(result).to.deep.equal([1]);
        });
    });
    
    describe('Pattern Validation', () => {
        it('should validate beat patterns', () => {
            const validBeatPattern = [
                {"beat": "kick", "dur": 1, "vol": 0.8},
                {"beat": "rest", "dur": 0.5},
                {"beats": ["kick", "snare"], "dur": 1}
            ];
            
            const result = player.validatePattern(validBeatPattern, 'beat');
            expect(result.isValid).to.be.true;
            expect(result.issues).to.be.empty;
        });
        
        it('should validate melody patterns', () => {
            const validMelodyPattern = [
                {"note": "C4", "dur": 1, "vol": 0.8},
                {"note": "rest", "dur": 0.5},
                {"notes": ["C4", "E4", "G4"], "dur": 1}
            ];
            
            const result = player.validatePattern(validMelodyPattern, 'melody');
            expect(result.isValid).to.be.true;
            expect(result.issues).to.be.empty;
        });
        
        it('should detect invalid beat patterns', () => {
            const invalidBeatPattern = [
                {"beat": "kick"}, // missing dur
                {"beat": "snare", "dur": -1} // negative dur
            ];
            
            const result = player.validatePattern(invalidBeatPattern, 'beat');
            expect(result.isValid).to.be.false;
            expect(result.issues).to.not.be.empty;
        });
        
        it('should detect invalid melody patterns', () => {
            const invalidMelodyPattern = [
                {"note": "C4"}, // missing dur
                {"note": "D4", "dur": -1} // negative dur
            ];
            
            const result = player.validatePattern(invalidMelodyPattern, 'melody');
            expect(result.isValid).to.be.false;
            expect(result.issues).to.not.be.empty;
        });
    });
    
    describe('Visualization', () => {
        it('should create visualization elements for beat patterns', () => {
            const pattern = [
                {"beat": "kick", "dur": 1},
                {"beat": "snare", "dur": 1}
            ];
            
            player.beatInput.value = JSON.stringify(pattern);
            player.visualizePattern('beat');
            
            const vizItems = player.beatViz.querySelectorAll('.viz-item');
            expect(vizItems).to.have.length(2);
            expect(vizItems[0].textContent).to.equal('kick');
            expect(vizItems[1].textContent).to.equal('snare');
        });
        
        it('should create visualization elements for melody patterns', () => {
            const pattern = [
                {"note": "C4", "dur": 1},
                {"note": "E4", "dur": 1}
            ];
            
            player.melodyInput.value = JSON.stringify(pattern);
            player.visualizePattern('melody');
            
            const vizItems = player.melodyViz.querySelectorAll('.viz-item');
            expect(vizItems).to.have.length(2);
            expect(vizItems[0].textContent).to.equal('C4');
            expect(vizItems[1].textContent).to.equal('E4');
        });
        
        it('should ignore duration 0 items in visualization', () => {
            const pattern = [
                {"beat": "kick", "dur": 1},
                {"beat": "snare", "dur": 0},  // Should be ignored
                {"beat": "hihat", "dur": 0.5}
            ];
            
            player.beatInput.value = JSON.stringify(pattern);
            player.visualizePattern('beat');
            
            const vizItems = player.beatViz.querySelectorAll('.viz-item');
            expect(vizItems).to.have.length(2); // Only kick and hihat
            expect(vizItems[0].textContent).to.equal('kick');
            expect(vizItems[1].textContent).to.equal('hihat');
        });
        
        it('should handle chord patterns in visualization', () => {
            const pattern = [
                {"beat": "kick", "dur": 1},
                {"beats": ["kick", "snare"], "dur": 1}
            ];
            
            player.beatInput.value = JSON.stringify(pattern);
            player.visualizePattern('beat');
            
            const vizItems = player.beatViz.querySelectorAll('.viz-item');
            expect(vizItems).to.have.length(2);
        });
    });
    
    describe('Audio Scheduling', () => {
        let audioCalls;
        
        beforeEach(() => {
            audioCalls = [];
            
            // Mock audio functions to track calls
            player.scheduleHit = function(...args) {
                audioCalls.push({ function: 'scheduleHit', args });
            };
            
            player.playPianoTone = function(...args) {
                audioCalls.push({ function: 'playPianoTone', args });
            };
        });
        
        it('should schedule beat pattern playback', () => {
            const pattern = [
                {"beat": "kick", "dur": 1},
                {"beat": "snare", "dur": 1}
            ];
            
            player.playBeatPattern(pattern, 120);
            
            expect(audioCalls).to.have.length(2);
            expect(audioCalls[0].args[0]).to.equal('kick');
            expect(audioCalls[1].args[0]).to.equal('snare');
        });
        
        it('should schedule melody pattern playback', () => {
            const pattern = [
                {"note": "C4", "dur": 1},
                {"note": "E4", "dur": 1}
            ];
            
            player.playMelodyPattern(pattern, 120);
            
            expect(audioCalls).to.have.length(2);
            expect(audioCalls[0].function).to.equal('playPianoTone');
            expect(audioCalls[1].function).to.equal('playPianoTone');
        });
        
        it('should ignore duration 0 items in beat playback', () => {
            const pattern = [
                {"beat": "kick", "dur": 1},
                {"beat": "snare", "dur": 0},  // Should be ignored
                {"beat": "hihat", "dur": 0.5}
            ];
            
            player.playBeatPattern(pattern, 120);
            
            expect(audioCalls).to.have.length(2); // Only kick and hihat
            expect(audioCalls[0].args[0]).to.equal('kick');
            expect(audioCalls[1].args[0]).to.equal('hihat');
        });
        
        it('should ignore duration 0 items in melody playback', () => {
            const pattern = [
                {"note": "C4", "dur": 1},
                {"note": "D4", "dur": 0},  // Should be ignored
                {"note": "E4", "dur": 0.5}
            ];
            
            player.playMelodyPattern(pattern, 120);
            
            expect(audioCalls).to.have.length(2); // Only C4 and E4
        });
    });
    
    describe('Tempo Control', () => {
        it('should set tempo correctly', () => {
            player.setTempo(120);
            expect(player.tempo).to.equal(120);
        });
        
        it('should validate tempo range', () => {
            player.setTempo(300); // Valid max
            expect(player.tempo).to.equal(300);
            
            player.setTempo(40); // Valid min
            expect(player.tempo).to.equal(40);
        });
        
        it('should clamp invalid tempo values', () => {
            player.setTempo(500); // Too high
            expect(player.tempo).to.equal(300);
            
            player.setTempo(10); // Too low
            expect(player.tempo).to.equal(40);
        });
    });
    
    describe('Volume Control', () => {
        it('should set master volume correctly', () => {
            player.setMasterVolume(0.8);
            expect(player.masterVolume).to.equal(0.8);
        });
        
        it('should validate volume range', () => {
            player.setMasterVolume(1.0); // Valid max
            expect(player.masterVolume).to.equal(1.0);
            
            player.setMasterVolume(0.0); // Valid min
            expect(player.masterVolume).to.equal(0.0);
        });
        
        it('should clamp invalid volume values', () => {
            player.setMasterVolume(1.5); // Too high
            expect(player.masterVolume).to.equal(1.0);
            
            player.setMasterVolume(-0.5); // Too low
            expect(player.masterVolume).to.equal(0.0);
        });
    });
});