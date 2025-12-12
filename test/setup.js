// Test setup for Mocha tests
const { JSDOM } = require('jsdom');

// Set up DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLDivElement = dom.window.HTMLDivElement;
global.HTMLAudioElement = dom.window.HTMLAudioElement;

// Mock Web Audio API
global.AudioContext = class MockAudioContext {
    constructor() {
        this.currentTime = 0;
        this.sampleRate = 44100;
        this.state = 'running';
        this.masterGain = null;
        this.activeSources = [];
    }
    
    createOscillator() {
        return {
            type: 'sine',
            frequency: { setValueAtTime: () => {} },
            connect: () => {},
            start: () => {},
            stop: () => {}
        };
    }
    
    createGain() {
        return {
            gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
            connect: () => {}
        };
    }
    
    createBuffer() {
        return {
            getChannelData: () => new Float32Array(44100)
        };
    }
    
    createBufferSource() {
        return {
            buffer: null,
            connect: () => {},
            start: () => {},
            stop: () => {}
        };
    }
    
    createBiquadFilter() {
        return {
            type: 'lowpass',
            frequency: { value: 0 },
            Q: { value: 0 },
            connect: () => {}
        };
    }
    
    createAnalyser() {
        return {
            fftSize: 2048,
            getByteTimeDomainData: () => new Uint8Array(2048),
            connect: () => {}
        };
    }
};

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();
global.localStorage = localStorageMock;

// Suppress console output for cleaner test output
const originalConsole = console;
global.console = {
    ...originalConsole,
    log: () => {},
    error: () => {},
    warn: () => {}
};

// Export for use in tests
global.expect = require('chai').expect;

// NYC coverage hook is automatically loaded by nyc