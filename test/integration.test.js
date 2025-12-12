const MusicPlayer = require('../js/main.js');
const StorageModule = require('../js/storage.js');
const MidiParser = require('../js/midi-parser.js');

describe('Integration Tests', () => {
    let player, storage, parser;
    
    beforeEach(() => {
        // Create DOM elements
        document.body.innerHTML = `
            <div id="beat-input"></div>
            <div id="melody-input"></div>
            <div id="beat-viz"></div>
            <div id="melody-viz"></div>
            <div id="status-box"></div>
            <div id="tempo-display"></div>
            <div id="master-volume-display"></div>
        `;
        
        localStorage.clear();
        player = new MusicPlayer();
        storage = new StorageModule();
        parser = new MidiParser();
    });
    
    describe('Player-Storage Integration', () => {
        it('should save and load patterns through storage', () => {
            const beatPattern = [
                {"beat": "kick", "dur": 1},
                {"beat": "snare", "dur": 1}
            ];
            
            // Save pattern through storage
            const saved = storage.savePattern('beat', 'integration-test', beatPattern);
            expect(saved).to.be.true;
            
            // Load pattern through player
            const patterns = storage.getPatterns('beat');
            expect(patterns).to.have.length(1);
            expect(patterns[0].pattern).to.deep.equal(beatPattern);
        });
        
        it('should validate patterns consistently across modules', () => {
            const pattern = [
                {"beat": "kick", "dur": 1},
                {"beat": "rest", "dur": 0}
            ];
            
            // Both should accept the pattern
            const storageValid = storage.validatePattern(pattern, 'beat');
            const playerValid = player.validatePattern(pattern, 'beat');
            
            expect(storageValid).to.be.true;
            expect(playerValid.isValid).to.be.true;
        });
    });
    
    describe('Player-Audio Integration', () => {
        it('should play patterns through audio engine', () => {
            const pattern = [
                {"beat": "kick", "dur": 0.5},
                {"beat": "snare", "dur": 0.5}
            ];
            
            // Should not throw when playing
            expect(() => player.playBeatPattern(pattern, 120)).to.not.throw();
        });
        
        it('should handle tempo changes in playback', () => {
            player.setTempo(60);
            expect(player.tempo).to.equal(60);
            
            const pattern = [{"beat": "kick", "dur": 1}];
            expect(() => player.playBeatPattern(pattern, 60)).to.not.throw();
        });
        
        it('should handle volume changes in playback', () => {
            player.setMasterVolume(0.5);
            expect(player.masterVolume).to.equal(0.5);
            
            const pattern = [{"beat": "kick", "dur": 1}];
            expect(() => player.playBeatPattern(pattern, 120)).to.not.throw();
        });
    });
    
    describe('MIDI-Player Integration', () => {
        it('should parse MIDI and create playable patterns', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 60, time: 0, duration: 1, velocity: 80 }, // C4
                            { pitch: 64, time: 1, duration: 1, velocity: 80 }  // E4
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.melodyPattern).to.be.an('array');
            expect(result.melodyPattern).to.have.length(2);
            
            // Should be playable by the player
            expect(() => player.playMelodyPattern(result.melodyPattern, 120)).to.not.throw();
        });
        
        it('should handle MIDI drum patterns', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 36, time: 0, duration: 1, velocity: 100 }, // Kick
                            { pitch: 38, time: 1, duration: 1, velocity: 100 }  // Snare
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.beatPattern).to.be.an('array');
            
            // Should be playable by the player
            expect(() => player.playBeatPattern(result.beatPattern, 120)).to.not.throw();
        });
    });
    
    describe('Duration 0 Handling Integration', () => {
        it('should consistently handle duration 0 across all modules', () => {
            const beatPattern = [
                {"beat": "kick", "dur": 1},
                {"beat": "snare", "dur": 0},  // Should be ignored
                {"beat": "hihat", "dur": 0.5}
            ];
            
            const melodyPattern = [
                {"note": "C4", "dur": 1},
                {"note": "D4", "dur": 0},  // Should be ignored
                {"note": "E4", "dur": 0.5}
            ];
            
            // Storage should accept
            expect(storage.validatePattern(beatPattern, 'beat')).to.be.true;
            expect(storage.validatePattern(melodyPattern, 'melody')).to.be.true;
            
            // Player should calculate duration correctly
            const beatDuration = player.calculatePatternDuration(beatPattern, 'beat');
            const melodyDuration = player.calculatePatternDuration(melodyPattern, 'melody');
            expect(beatDuration).to.equal(1.5); // 1 + 0.5 (ignoring 0)
            expect(melodyDuration).to.equal(1.5); // 1 + 0.5 (ignoring 0)
            
            // Visualization should ignore duration 0
            player.beatInput.value = JSON.stringify(beatPattern);
            player.melodyInput.value = JSON.stringify(melodyPattern);
            player.visualizePattern('beat');
            player.visualizePattern('melody');
            
            const beatVizItems = player.beatViz.querySelectorAll('.viz-item');
            const melodyVizItems = player.melodyViz.querySelectorAll('.viz-item');
            expect(beatVizItems).to.have.length(2); // kick, hihat
            expect(melodyVizItems).to.have.length(2); // C4, E4
            
            // Playback should ignore duration 0
            expect(() => player.playBeatPattern(beatPattern, 120)).to.not.throw();
            expect(() => player.playMelodyPattern(melodyPattern, 120)).to.not.throw();
        });
    });
    
    describe('Project Management Integration', () => {
        it('should save and load complete projects', () => {
            const beatPattern = [{"beat": "kick", "dur": 1}];
            const melodyPattern = [{"note": "C4", "dur": 1}];
            
            // Save project
            const saved = storage.saveProject('integration-project', beatPattern, melodyPattern);
            expect(saved).to.be.true;
            
            // Load project
            const projects = storage.getProjects();
            expect(projects).to.have.length(1);
            
            const project = projects[0];
            expect(project.name).to.equal('integration-project');
            expect(project.beatPattern).to.deep.equal(beatPattern);
            expect(project.melodyPattern).to.deep.equal(melodyPattern);
            
            // Should be playable
            expect(() => player.playBeatPattern(project.beatPattern, project.tempo)).to.not.throw();
            expect(() => player.playMelodyPattern(project.melodyPattern, project.tempo)).to.not.throw();
        });
    });
    
    describe('Error Handling Integration', () => {
        it('should handle invalid data gracefully across modules', () => {
            const invalidPatterns = [
                null,
                undefined,
                [],
                'invalid string',
                { invalid: 'object' }
            ];
            
            invalidPatterns.forEach(pattern => {
                // Storage should handle gracefully
                expect(() => storage.validatePattern(pattern, 'beat')).to.not.throw();
                
                // Player should handle gracefully
                expect(() => player.calculatePatternDuration(pattern, 'beat')).to.not.throw();
                expect(() => player.playBeatPattern(pattern, 120)).to.not.throw();
            });
        });
        
        it('should handle audio context failures', () => {
            // Mock AudioContext failure
            const originalAudioContext = global.AudioContext;
            global.AudioContext = function() {
                throw new Error('AudioContext not available');
            };
            
            expect(() => {
                const newPlayer = new MusicPlayer();
                newPlayer.playBeatPattern([{"beat": "kick", "dur": 1}], 120);
            }).to.not.throw();
            
            // Restore
            global.AudioContext = originalAudioContext;
        });
    });
    
    describe('Performance Integration', () => {
        it('should handle large patterns efficiently', () => {
            const largePattern = [];
            for (let i = 0; i < 1000; i++) {
                largePattern.push({
                    beat: i % 2 === 0 ? "kick" : "snare",
                    dur: 0.25
                });
            }
            
            // Should handle large patterns without issues
            const startTime = Date.now();
            const duration = player.calculatePatternDuration(largePattern, 'beat');
            const endTime = Date.now();
            
            expect(duration).to.equal(250); // 1000 * 0.25
            expect(endTime - startTime).to.be.below(100); // Should complete quickly
        });
        
        it('should handle rapid tempo changes', () => {
            for (let i = 60; i <= 200; i += 10) {
                player.setTempo(i);
                expect(player.tempo).to.equal(i);
                
                const pattern = [{"beat": "kick", "dur": 1}];
                expect(() => player.playBeatPattern(pattern, i)).to.not.throw();
            }
        });
    });
});