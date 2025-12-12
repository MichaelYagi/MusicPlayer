const expect = require('chai').expect;

describe('localStorage Persistence', () => {
    let storage;
    
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        storage = new StorageModule();
    });
    
    describe('loadPreferences()', () => {
        let player;
        
        beforeEach(() => {
            // Mock DOM elements
            document.body.innerHTML = `
                <div id="tempo-slider"></div>
                <div id="tempo-display"></div>
                <div id="master-volume"></div>
                <div id="master-volume-display"></div>
                <div id="autoscroll-btn"></div>
                <div id="beat-mute-btn"></div>
                <div id="beat-solo-btn"></div>
                <div id="melody-mute-btn"></div>
                <div id="melody-solo-btn"></div>
            `;
            
            // Mock MusicPlayer constructor
            player = {
                tempoSlider: document.getElementById('tempo-slider'),
                tempoDisplay: document.getElementById('tempo-display'),
                masterVolumeSlider: document.getElementById('master-volume'),
                masterVolumeDisplay: document.getElementById('master-volume-display'),
                autoScrollBtn: document.getElementById('autoscroll-btn'),
                beatMuteBtn: document.getElementById('beat-mute-btn'),
                beatSoloBtn: document.getElementById('beat-solo-btn'),
                melodyMuteBtn: document.getElementById('melody-mute-btn'),
                melodySoloBtn: document.getElementById('melody-solo-btn'),
                trackState: {},
                tempo: 120,
                masterVolume: 70,
                autoScrollDuringPlayback: true,
                loadPreferences: function() {},
                savePreferences: function() {}
            };
        });
        
        it('should load default values when no preferences exist', () => {
            // Mock empty preferences
            localStorage.getItem = () => null;
            
            player.loadPreferences();
            
            expect(player.tempo).to.equal(120);
            expect(player.masterVolume).to.equal(70);
            expect(player.autoScrollDuringPlayback).to.be.true;
            expect(player.trackState.beat.muted).to.be.false;
            expect(player.trackState.beat.soloed).to.be.false;
            expect(player.trackState.melody.muted).to.be.false;
            expect(player.trackState.melody.soloed).to.be.false;
        });
        
        it('should load saved preferences correctly', () => {
            // Mock saved preferences
            const savedPrefs = {
                tempo: 140,
                masterVolume: 85,
                autoScroll: false,
                beatMuted: true,
                beatSoloed: false,
                melodyMuted: false,
                melodySoloed: true
            };
            localStorage.getItem = (key) => {
                if (key === 'musicPlayerData') {
                    return JSON.stringify({ preferences: savedPrefs });
                }
                return null;
            };
            
            player.loadPreferences();
            
            expect(player.tempo).to.equal(140);
            expect(player.masterVolume).to.equal(85);
            expect(player.autoScrollDuringPlayback).to.be.false;
            expect(player.trackState.beat.muted).to.be.true;
            expect(player.trackState.beat.soloed).to.be.false;
            expect(player.trackState.melody.muted).to.be.false;
            expect(player.trackState.melody.soloed).to.be.true;
        });
        
        it('should update UI elements with loaded values', () => {
            // Mock saved preferences
            localStorage.getItem = () => {
                if (key === 'musicPlayerData') {
                    return JSON.stringify({
                        preferences: {
                            tempo: 160,
                            masterVolume: 90,
                            autoScroll: true
                        }
                    });
                }
                return null;
            };
            
            player.loadPreferences();
            
            expect(player.tempoSlider.value).to.equal('160');
            expect(player.tempoDisplay.textContent).to.equal('160');
            expect(player.masterVolumeSlider.value).to.equal('90');
            expect(player.masterVolumeDisplay.textContent).to.equal('90%');
            expect(player.autoScrollBtn.textContent).to.equal('Auto-Scroll: ON');
            expect(player.autoScrollBtn.classList.contains('active')).to.be.true;
        });
        
        it('should handle malformed localStorage data gracefully', () => {
            // Mock invalid JSON
            localStorage.getItem = () => 'invalid json';
            
            expect(() => player.loadPreferences()).to.not.throw();
            
            // Should use defaults
            expect(player.tempo).to.equal(120);
            expect(player.masterVolume).to.equal(70);
            expect(player.autoScrollDuringPlayback).to.be.true;
        });
    });
    
    describe('savePreferences()', () => {
        let player;
        
        beforeEach(() => {
            // Mock DOM elements
            document.body.innerHTML = `
                <div id="tempo-slider"></div>
                <div id="tempo-display"></div>
                <div id="master-volume"></div>
                <div id="master-volume-display"></div>
                <div id="autoscroll-btn"></div>
                <div id="beat-mute-btn"></div>
                <div id="beat-solo-btn"></div>
                <div id="melody-mute-btn"></div>
                <div id="melody-solo-btn"></div>
            `;
            
            // Mock MusicPlayer state
            player = {
                tempo: 150,
                masterVolume: 80,
                autoScrollDuringPlayback: false,
                trackState: {
                    beat: { muted: true, soloed: false },
                    melody: { muted: false, soloed: true }
                },
                savePreferences: function() {}
            };
            
            // Mock storage
            player.storage = {
                savePreferences: function(prefs) {
                    // Store for verification
                    player.lastSavedPrefs = prefs;
                }
            };
        });
        
        it('should save all current settings to localStorage', () => {
            player.savePreferences();
            
            const expected = {
                tempo: player.tempo,
                masterVolume: player.masterVolume,
                autoScrollDuringPlayback: player.autoScrollDuringPlayback,
                beatMuted: player.trackState.beat.muted,
                beatSoloed: player.trackState.beat.soloed,
                melodyMuted: player.trackState.melody.muted,
                melodySoloed: player.trackState.melody.soloed
            };
            
            expect(player.lastSavedPrefs).to.deep.equal(expected);
        });
        
        it('should call storage.savePreferences with correct data', () => {
            let called = false;
            let savedData = null;
            
            player.storage = {
                savePreferences: function(prefs) {
                    called = true;
                    savedData = prefs;
                }
            };
            
            player.savePreferences();
            
            expect(called).to.be.true;
            expect(savedData).to.be.an('object');
            expect(savedData).to.have.property('tempo');
            expect(savedData).to.have.property('masterVolume');
            expect(savedData).to.have.property('autoScrollDuringPlayback');
            expect(savedData).to.have.property('beatMuted');
            expect(savedData).to.have.property('beatSoloed');
            expect(savedData).to.have.property('melodyMuted');
            expect(savedData).to.have.property('melodySoloed');
        });
        
        it('should handle save errors gracefully', () => {
            // Mock storage error
            player.storage = {
                savePreferences: function(prefs) {
                    throw new Error('Storage error');
                }
            };
            
            expect(() => player.savePreferences()).to.not.throw();
        });
    });
    
    describe('UI Control Persistence Integration', () => {
        let player;
        
        beforeEach(() => {
            // Mock DOM and localStorage
            document.body.innerHTML = `
                <div id="tempo-slider"></div>
                <div id="tempo-display"></div>
                <div id="master-volume"></div>
                <div id="master-volume-display"></div>
                <div id="autoscroll-btn"></div>
                <div id="beat-mute-btn"></div>
                <div id="beat-solo-btn"></div>
                <div id="melody-mute-btn"></div>
                <div id="melody-solo-btn"></div>
            `;
            
            localStorage.clear();
            
            player = {
                tempoSlider: document.getElementById('tempo-slider'),
                tempoDisplay: document.getElementById('tempo-display'),
                masterVolumeSlider: document.getElementById('master-volume'),
                masterVolumeDisplay: document.getElementById('master-volume-display'),
                autoScrollBtn: document.getElementById('autoscroll-btn'),
                beatMuteBtn: document.getElementById('beat-mute-btn'),
                beatSoloBtn: document.getElementById('beat-solo-btn'),
                melodyMuteBtn: document.getElementById('melody-mute-btn'),
                melodySoloBtn: document.getElementById('melody-solo-btn'),
                trackState: {
                    beat: { muted: false, soloed: false },
                    melody: { muted: false, soloed: false }
                },
                tempo: 120,
                masterVolume: 70,
                autoScrollDuringPlayback: true,
                loadPreferences: function() {},
                savePreferences: function() {}
            };
        });
        
        it('should persist tempo changes', () => {
            // Mock localStorage
            let savedData = null;
            localStorage.setItem = (key, value) => {
                if (key === 'musicPlayerData') {
                    savedData = JSON.parse(value);
                }
            };
            
            // Change tempo
            player.tempo = 180;
            player.tempoSlider.value = 180;
            player.tempoDisplay.textContent = 180;
            player.savePreferences();
            
            expect(savedData.preferences.tempo).to.equal(180);
        });
        
        it('should persist volume changes', () => {
            // Mock localStorage
            let savedData = null;
            localStorage.setItem = (key, value) => {
                if (key === 'musicPlayerData') {
                    savedData = JSON.parse(value);
                }
            };
            
            // Change volume
            player.masterVolume = 90;
            player.masterVolumeSlider.value = 90;
            player.masterVolumeDisplay.textContent = '90%';
            player.savePreferences();
            
            expect(savedData.preferences.masterVolume).to.equal(90);
        });
        
        it('should persist auto-scroll changes', () => {
            // Mock localStorage
            let savedData = null;
            localStorage.setItem = (key, value) => {
                if (key === 'musicPlayerData') {
                    savedData = JSON.parse(value);
                }
            };
            
            // Change auto-scroll
            player.autoScrollDuringPlayback = false;
            player.autoScrollBtn.textContent = 'Auto-Scroll: OFF';
            player.autoScrollBtn.classList.remove('active');
            player.savePreferences();
            
            expect(savedData.preferences.autoScroll).to.be.false;
        });
        
        it('should persist track state changes', () => {
            // Mock localStorage
            let savedData = null;
            localStorage.setItem = (key, value) => {
                if (key === 'musicPlayerData') {
                    savedData = JSON.parse(value);
                }
            };
            
            // Change track states
            player.trackState.beat.muted = true;
            player.trackState.beat.soloed = true;
            player.trackState.melody.muted = true;
            player.trackState.melody.soloed = false;
            
            // Update UI
            player.beatMuteBtn.classList.add('muted');
            player.beatMuteBtn.textContent = 'Unmute Beat';
            player.beatSoloBtn.classList.add('soloed');
            player.beatSoloBtn.textContent = 'Unsolo Beat';
            player.melodyMuteBtn.classList.add('muted');
            player.melodyMuteBtn.textContent = 'Unmute Melody';
            player.melodySoloBtn.classList.remove('soloed');
            player.melodySoloBtn.textContent = 'Solo Melody';
            
            player.savePreferences();
            
            expect(savedData.preferences.beatMuted).to.be.true;
            expect(savedData.preferences.beatSoloed).to.be.true;
            expect(savedData.preferences.melodyMuted).to.be.true;
            expect(savedData.preferences.melodySoloed).to.be.false;
        });
    });
});