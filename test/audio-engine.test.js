const AudioEngine = require('../js/audio-engine.js');

describe('Audio Engine', () => {
    let audioEngine;
    
    beforeEach(() => {
        audioEngine = new AudioEngine();
    });
    
    describe('Initialization', () => {
        it('should initialize correctly', () => {
            expect(audioEngine.isInitialized).to.be.false;
            
            audioEngine.init();
            expect(audioEngine.isInitialized).to.be.true;
            expect(audioEngine.audioContext).to.not.be.null;
        });
        
        it('should not initialize twice', () => {
            audioEngine.init();
            const firstContext = audioEngine.audioContext;
            
            audioEngine.init();
            expect(audioEngine.audioContext).to.equal(firstContext);
        });
    });
    
    describe('Note Playing', () => {
        beforeEach(() => {
            audioEngine.init();
        });
        
        it('should play notes with default parameters', () => {
            const result = audioEngine.playNote(440, 1.0);
            expect(result).to.not.be.null;
        });
        
        it('should play notes with custom parameters', () => {
            const result = audioEngine.playNote(523.25, 0.5, 0.8, 0.1, 'square');
            expect(result).to.not.be.null;
        });
        
        it('should play chords', () => {
            const notes = [440, 523.25, 659.25];
            const result = audioEngine.playChord(notes, 1.0);
            expect(result).to.not.be.null;
        });
        
        it('should handle invalid frequencies gracefully', () => {
            const result = audioEngine.playNote(-440, 1.0);
            expect(result).to.be.null;
        });
        
        it('should handle zero duration gracefully', () => {
            const result = audioEngine.playNote(440, 0);
            expect(result).to.be.null;
        });
    });
    
    describe('Beat Playing', () => {
        beforeEach(() => {
            audioEngine.init();
        });
        
        it('should play different beat types', () => {
            expect(() => audioEngine.playBeat('kick', 0.3)).to.not.throw();
            expect(() => audioEngine.playBeat('snare', 0.2)).to.not.throw();
            expect(() => audioEngine.playBeat('hihat', 0.1)).to.not.throw();
            expect(() => audioEngine.playBeat('clap', 0.12)).to.not.throw();
        });
        
        it('should handle zero duration gracefully', () => {
            expect(() => audioEngine.playBeat('kick', 0)).to.not.throw();
        });
        
        it('should handle negative duration gracefully', () => {
            expect(() => audioEngine.playBeat('kick', -1)).to.not.throw();
        });
    });
    
    describe('Volume Control', () => {
        beforeEach(() => {
            audioEngine.init();
        });
        
        it('should create master gain node', () => {
            expect(audioEngine.masterGain).to.not.be.null;
        });
        
        it('should set master volume', () => {
            audioEngine.setMasterVolume(0.5);
            expect(audioEngine.masterVolume).to.equal(0.5);
        });
        
        it('should clamp volume to valid range', () => {
            audioEngine.setMasterVolume(1.5);
            expect(audioEngine.masterVolume).to.equal(1.0);
            
            audioEngine.setMasterVolume(-0.5);
            expect(audioEngine.masterVolume).to.equal(0.0);
        });
    });
    
    describe('Source Management', () => {
        beforeEach(() => {
            audioEngine.init();
        });
        
        it('should track active sources', () => {
            expect(audioEngine.activeSources).to.be.an('array');
            expect(audioEngine.activeSources).to.be.empty;
        });
        
        it('should add sources to active list', () => {
            const source = audioEngine.playNote(440, 1.0);
            expect(audioEngine.activeSources).to.have.length(1);
        });
        
        it('should stop all active sources', () => {
            audioEngine.playNote(440, 1.0);
            audioEngine.playNote(523.25, 1.0);
            
            expect(audioEngine.activeSources).to.have.length(2);
            
            audioEngine.stopAll();
            expect(audioEngine.activeSources).to.be.empty;
        });
    });
    
    describe('Noise Generation', () => {
        beforeEach(() => {
            audioEngine.init();
        });
        
        it('should add noise to audio context', () => {
            expect(() => audioEngine.addNoise(0.1, 0.3)).to.not.throw();
        });
        
        it('should handle different noise types', () => {
            expect(() => audioEngine.addNoise(0.1, 0.3, 0, 'white')).to.not.throw();
            expect(() => audioEngine.addNoise(0.1, 0.3, 0, 'pink')).to.not.throw();
            expect(() => audioEngine.addNoise(0.1, 0.3, 0, 'metallic')).to.not.throw();
            expect(() => audioEngine.addNoise(0.1, 0.3, 0, 'sharp')).to.not.throw();
        });
        
        it('should handle zero duration gracefully', () => {
            expect(() => audioEngine.addNoise(0, 0.3)).to.not.throw();
        });
    });
    
    describe('Error Handling', () => {
        it('should handle initialization errors gracefully', () => {
            // Mock AudioContext to throw error
            const originalAudioContext = global.AudioContext;
            global.AudioContext = function() {
                throw new Error('AudioContext not supported');
            };
            
            expect(() => {
                const engine = new AudioEngine();
                engine.init();
            }).to.not.throw();
            
            // Restore original
            global.AudioContext = originalAudioContext;
        });
        
        it('should handle missing audio context gracefully', () => {
            const engine = new AudioEngine();
            // Don't initialize
            
            expect(() => engine.playNote(440, 1.0)).to.not.throw();
        });
    });
});