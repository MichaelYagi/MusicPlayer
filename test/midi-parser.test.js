const MidiParser = require('../js/midi-parser.js');

describe('MIDI Parser', () => {
    let parser;
    
    beforeEach(() => {
        parser = new MidiParser();
    });
    
    describe('Basic Parsing', () => {
        it('should initialize correctly', () => {
            expect(parser).to.not.be.null;
            expect(parser.parse).to.be.a('function');
        });
        
        it('should handle empty input', () => {
            const result = parser.parse(new ArrayBuffer(0));
            expect(result).to.not.be.null;
            expect(result.tracks).to.be.an('array');
        });
        
        it('should handle invalid input gracefully', () => {
            const result = parser.parse(null);
            expect(result).to.not.be.null;
            expect(result.error).to.not.be.undefined;
        });
    });
    
    describe('Note Extraction', () => {
        it('should extract notes from MIDI data', () => {
            // Mock MIDI data structure
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 60, time: 0, duration: 1, velocity: 80 }, // C4
                            { pitch: 64, time: 1, duration: 1, velocity: 80 }, // E4
                            { pitch: 67, time: 2, duration: 1, velocity: 80 }  // G4
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.notes).to.be.an('array');
            expect(result.notes).to.have.length(3);
        });
        
        it('should convert MIDI pitch numbers to note names', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 60, time: 0, duration: 1, velocity: 80 }, // C4
                            { pitch: 61, time: 1, duration: 1, velocity: 80 }, // C#4
                            { pitch: 62, time: 2, duration: 1, velocity: 80 }  // D4
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.notes[0].note).to.equal('C4');
            expect(result.notes[1].note).to.equal('C#4');
            expect(result.notes[2].note).to.equal('D4');
        });
        
        it('should handle different octaves', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 48, time: 0, duration: 1, velocity: 80 }, // C3
                            { pitch: 72, time: 1, duration: 1, velocity: 80 }  // C5
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.notes[0].note).to.equal('C3');
            expect(result.notes[1].note).to.equal('C5');
        });
    });
    
    describe('Beat Pattern Generation', () => {
        it('should generate beat patterns from MIDI', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 36, time: 0, duration: 0.5, velocity: 100 }, // Kick
                            { pitch: 38, time: 0.5, duration: 0.5, velocity: 80 }, // Snare
                            { pitch: 42, time: 0.25, duration: 0.25, velocity: 60 } // Hi-hat
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.beatPattern).to.be.an('array');
            expect(result.beatPattern.length).to.be.greaterThan(0);
        });
        
        it('should identify kick drums correctly', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 36, time: 0, duration: 1, velocity: 100 } // Kick
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            const kickItem = result.beatPattern.find(item => item.beat === 'kick');
            expect(kickItem).to.not.be.undefined;
        });
        
        it('should identify snare drums correctly', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 38, time: 0, duration: 1, velocity: 100 } // Snare
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            const snareItem = result.beatPattern.find(item => item.beat === 'snare');
            expect(snareItem).to.not.be.undefined;
        });
        
        it('should identify hi-hat correctly', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 42, time: 0, duration: 1, velocity: 100 } // Hi-hat
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            const hihatItem = result.beatPattern.find(item => item.beat === 'hihat');
            expect(hihatItem).to.not.be.undefined;
        });
        
        it('should add rests for gaps in beat patterns', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 36, time: 0, duration: 0.5, velocity: 100 }, // Kick
                            { pitch: 38, time: 2, duration: 0.5, velocity: 100 }  // Snare (gap)
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            const restItem = result.beatPattern.find(item => item.beat === 'rest');
            expect(restItem).to.not.be.undefined;
        });
    });
    
    describe('Melody Pattern Generation', () => {
        it('should generate melody patterns from MIDI', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 60, time: 0, duration: 1, velocity: 80 }, // C4
                            { pitch: 64, time: 1, duration: 1, velocity: 80 }, // E4
                            { pitch: 67, time: 2, duration: 1, velocity: 80 }  // G4
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.melodyPattern).to.be.an('array');
            expect(result.melodyPattern.length).to.be.greaterThan(0);
        });
        
        it('should convert note names correctly', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 60, time: 0, duration: 1, velocity: 80 } // C4
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.melodyPattern[0].note).to.equal('C4');
        });
        
        it('should handle rests in melody patterns', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 60, time: 0, duration: 1, velocity: 80 }, // C4
                            { pitch: 64, time: 3, duration: 1, velocity: 80 }  // E4 (gap)
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            const restItem = result.melodyPattern.find(item => item.note === 'rest');
            expect(restItem).to.not.be.undefined;
        });
    });
    
    describe('Duration Quantization', () => {
        it('should quantize durations to reasonable values', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 60, time: 0, duration: 0.1, velocity: 80 }, // Very short
                            { pitch: 64, time: 0.1, duration: 2.7, velocity: 80 } // Long
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.melodyPattern[0].dur).to.be.gte(0.25); // Minimum 16th note
            expect(result.melodyPattern[1].dur).to.be.lte(4); // Maximum reasonable duration
        });
        
        it('should handle very short durations', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 60, time: 0, duration: 0.01, velocity: 80 } // Extremely short
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.melodyPattern[0].dur).to.be.gte(0.25);
        });
    });
    
    describe('Velocity to Volume Conversion', () => {
        it('should convert MIDI velocity to volume correctly', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 60, time: 0, duration: 1, velocity: 127 }, // Maximum
                            { pitch: 64, time: 1, duration: 1, velocity: 64 },  // Medium
                            { pitch: 67, time: 2, duration: 1, velocity: 0 }   // Minimum
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.melodyPattern[0].vol).to.be.closeTo(1.0, 0.1);
            expect(result.melodyPattern[1].vol).to.be.closeTo(0.5, 0.1);
            expect(result.melodyPattern[2].vol).to.be.closeTo(0.0, 0.1);
        });
    });
    
    describe('Error Handling', () => {
        it('should handle malformed MIDI data', () => {
            const malformedData = { invalid: 'data' };
            
            expect(() => parser.parse(malformedData)).to.not.throw();
            const result = parser.parse(malformedData);
            expect(result.error).to.not.be.undefined;
        });
        
        it('should handle missing tracks', () => {
            const noTracksData = { tracks: [] };
            
            const result = parser.parse(noTracksData);
            expect(result.tracks).to.be.an('array');
            expect(result.tracks).to.be.empty;
        });
        
        it('should handle tracks with no notes', () => {
            const noNotesData = {
                tracks: [
                    { notes: [] }
                ]
            };
            
            const result = parser.parse(noNotesData);
            expect(result.notes).to.be.an('array');
            expect(result.notes).to.be.empty;
        });
    });
    
    describe('BPM Detection', () => {
        it('should detect tempo from MIDI data', () => {
            const mockMidiData = {
                tempo: 120,
                tracks: [
                    {
                        notes: [
                            { pitch: 60, time: 0, duration: 1, velocity: 80 }
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.bpm).to.equal(120);
        });
        
        it('should use default BPM when not specified', () => {
            const mockMidiData = {
                tracks: [
                    {
                        notes: [
                            { pitch: 60, time: 0, duration: 1, velocity: 80 }
                        ]
                    }
                ]
            };
            
            const result = parser.parse(mockMidiData);
            expect(result.bpm).to.equal(120); // Default BPM
        });
    });
});