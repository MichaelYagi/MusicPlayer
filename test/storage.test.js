const StorageModule = require('../js/storage.js');

describe('Storage Module', () => {
    let storage;
    
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        storage = new StorageModule();
    });
    
    describe('Pattern Validation', () => {
        describe('Beat Pattern Validation', () => {
            it('should accept valid beat patterns', () => {
                const validPattern = [
                    {"beat": "kick", "dur": 1},
                    {"beat": "snare", "dur": 1},
                    {"beat": "hihat", "dur": 0.5}
                ];
                
                expect(storage.validatePattern(validPattern, 'beat')).to.be.true;
            });
            
            it('should accept beat patterns with rests', () => {
                const patternWithRests = [
                    {"beat": "kick", "dur": 1},
                    {"beat": "rest", "dur": 1},
                    {"beat": "snare", "dur": 1}
                ];
                
                expect(storage.validatePattern(patternWithRests, 'beat')).to.be.true;
            });
            
            it('should accept beat patterns with duration 0 rests', () => {
                const patternWithZeroRest = [
                    {"beat": "kick", "dur": 1},
                    {"beat": "rest", "dur": 0},
                    {"beat": "snare", "dur": 1}
                ];
                
                expect(storage.validatePattern(patternWithZeroRest, 'beat')).to.be.true;
            });
            
            it('should accept chord beat patterns', () => {
                const chordPattern = [
                    {"beat": "kick", "dur": 1},
                    {"beats": ["kick", "snare"], "dur": 1},
                    {"beat": "hihat", "dur": 0.5}
                ];
                
                expect(storage.validatePattern(chordPattern, 'beat')).to.be.true;
            });
            
            it('should reject invalid beat patterns', () => {
                const invalidPattern = [
                    {"beat": "kick"}, // missing dur
                    {"beat": "snare", "dur": -1} // negative duration
                ];
                
                expect(storage.validatePattern(invalidPattern, 'beat')).to.be.false;
            });
            
            it('should reject patterns with invalid beat types', () => {
                const invalidBeatPattern = [
                    {"beat": 123, "dur": 1}, // invalid beat type
                    {"beat": "snare", "dur": 1}
                ];
                
                expect(storage.validatePattern(invalidBeatPattern, 'beat')).to.be.false;
            });
        });
        
        describe('Melody Pattern Validation', () => {
            it('should accept valid melody patterns', () => {
                const validPattern = [
                    {"note": "C4", "dur": 1},
                    {"note": "E4", "dur": 1},
                    {"note": "G4", "dur": 0.5}
                ];
                
                expect(storage.validatePattern(validPattern, 'melody')).to.be.true;
            });
            
            it('should accept melody patterns with rests', () => {
                const patternWithRests = [
                    {"note": "C4", "dur": 1},
                    {"note": "rest", "dur": 1},
                    {"note": "E4", "dur": 1}
                ];
                
                expect(storage.validatePattern(patternWithRests, 'melody')).to.be.true;
            });
            
            it('should accept melody patterns with duration 0 rests', () => {
                const patternWithZeroRest = [
                    {"note": "C4", "dur": 1},
                    {"note": "rest", "dur": 0},
                    {"note": "E4", "dur": 1}
                ];
                
                expect(storage.validatePattern(patternWithZeroRest, 'melody')).to.be.true;
            });
            
            it('should accept chord melody patterns', () => {
                const chordPattern = [
                    {"note": "C4", "dur": 1},
                    {"notes": ["C4", "E4", "G4"], "dur": 1},
                    {"note": "G4", "dur": 0.5}
                ];
                
                expect(storage.validatePattern(chordPattern, 'melody')).to.be.true;
            });
            
            it('should accept frequency-based patterns', () => {
                const freqPattern = [
                    {"freq": 440, "dur": 1},
                    {"freq": 523.25, "dur": 1},
                    {"freq": 659.25, "dur": 0.5}
                ];
                
                expect(storage.validatePattern(freqPattern, 'melody')).to.be.true;
            });
            
            it('should reject invalid melody patterns', () => {
                const invalidPattern = [
                    {"note": "C4"}, // missing dur
                    {"note": "D4", "dur": -1} // negative duration
                ];
                
                expect(storage.validatePattern(invalidPattern, 'melody')).to.be.false;
            });
        });
        
        describe('BPM Validation', () => {
            it('should accept patterns with valid BPM', () => {
                const patternWithBPM = {
                    pattern: [{"beat": "kick", "dur": 1}],
                    bpm: 120
                };
                
                expect(storage.validatePattern(patternWithBPM, 'beat')).to.be.true;
            });
            
            it('should reject patterns with invalid BPM', () => {
                const patternWithInvalidBPM = {
                    pattern: [{"beat": "kick", "dur": 1}],
                    bpm: -10
                };
                
                expect(storage.validatePattern(patternWithInvalidBPM, 'beat')).to.be.false;
            });
            
            it('should reject patterns with BPM too high', () => {
                const patternWithHighBPM = {
                    pattern: [{"beat": "kick", "dur": 1}],
                    bpm: 500
                };
                
                expect(storage.validatePattern(patternWithHighBPM, 'beat')).to.be.false;
            });
        });
    });
    
    describe('Pattern Management', () => {
        it('should save and retrieve beat patterns', () => {
            const pattern = [{"beat": "kick", "dur": 1}, {"beat": "snare", "dur": 1}];
            
            const saved = storage.savePattern('beat', 'test-beat', pattern);
            expect(saved).to.be.true;
            
            const patterns = storage.getPatterns('beat');
            expect(patterns).to.have.length(1);
            expect(patterns[0].name).to.equal('test-beat');
            expect(patterns[0].pattern).to.deep.equal(pattern);
        });
        
        it('should save and retrieve melody patterns', () => {
            const pattern = [{"note": "C4", "dur": 1}, {"note": "E4", "dur": 1}];
            
            const saved = storage.savePattern('melody', 'test-melody', pattern);
            expect(saved).to.be.true;
            
            const patterns = storage.getPatterns('melody');
            expect(patterns).to.have.length(1);
            expect(patterns[0].name).to.equal('test-melody');
            expect(patterns[0].pattern).to.deep.equal(pattern);
        });
        
        it('should update existing patterns', () => {
            const pattern = [{"beat": "kick", "dur": 1}];
            const id = storage.savePattern('beat', 'test-beat', pattern);
            
            const updatedPattern = [{"beat": "snare", "dur": 1}];
            const updated = storage.updatePattern(id, { pattern: updatedPattern });
            expect(updated).to.be.true;
            
            const retrieved = storage.getPattern(id);
            expect(retrieved.pattern).to.deep.equal(updatedPattern);
        });
        
        it('should delete patterns', () => {
            const id = storage.savePattern('beat', 'test-beat', [{"beat": "kick", "dur": 1}]);
            
            const deleted = storage.deletePattern(id);
            expect(deleted).to.be.true;
            
            const retrieved = storage.getPattern(id);
            expect(retrieved).to.be.undefined;
        });
    });
    
    describe('Project Management', () => {
        it('should save and retrieve projects', () => {
            const beatPattern = [{"beat": "kick", "dur": 1}];
            const melodyPattern = [{"note": "C4", "dur": 1}];
            
            const saved = storage.saveProject('test-project', beatPattern, melodyPattern);
            expect(saved).to.be.true;
            
            const projects = storage.getProjects();
            expect(projects).to.have.length(1);
            expect(projects[0].name).to.equal('test-project');
            expect(projects[0].beatPattern).to.deep.equal(beatPattern);
            expect(projects[0].melodyPattern).to.deep.equal(melodyPattern);
        });
        
        it('should update projects', () => {
            const id = storage.saveProject('test-project', [{"beat": "kick"}], [{"note": "C4"}]);
            
            const newBeatPattern = [{"beat": "snare", "dur": 1}];
            const updated = storage.updateProject(id, { beatPattern: newBeatPattern });
            expect(updated).to.be.true;
            
            const project = storage.getProject(id);
            expect(project.beatPattern).to.deep.equal(newBeatPattern);
        });
        
        it('should delete projects', () => {
            const id = storage.saveProject('test-project', [{"beat": "kick"}], [{"note": "C4"}]);
            
            const deleted = storage.deleteProject(id);
            expect(deleted).to.be.true;
            
            const retrieved = storage.getProject(id);
            expect(retrieved).to.be.undefined;
        });
    });
    
    describe('Preferences Management', () => {
        it('should save and retrieve preferences', () => {
            const prefs = { tempo: 140, masterVolume: 0.8 };
            
            const saved = storage.savePreferences(prefs);
            expect(saved).to.be.true;
            
            const retrieved = storage.getPreferences();
            expect(retrieved.tempo).to.equal(140);
            expect(retrieved.masterVolume).to.equal(0.8);
        });
    });
    
    describe('Data Import/Export', () => {
        it('should export data correctly', () => {
            storage.savePattern('beat', 'test', [{"beat": "kick", "dur": 1}]);
            
            const exported = storage.exportData();
            expect(exported).to.have.property('version');
            expect(exported).to.have.property('data');
            expect(exported.data.patterns.beats).to.have.length(1);
        });
        
        it('should import data correctly', () => {
            const importData = {
                version: '1.0',
                data: {
                    patterns: {
                        beats: [{
                            id: 'test-id',
                            name: 'imported-beat',
                            pattern: [{"beat": "kick", "dur": 1}],
                            type: 'beat'
                        }]
                    }
                }
            };
            
            const imported = storage.importData(importData);
            expect(imported).to.be.true;
            
            const patterns = storage.getPatterns('beat');
            expect(patterns).to.have.length(1);
            expect(patterns[0].name).to.equal('imported-beat');
        });
    });
});