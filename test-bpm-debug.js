// Simple test for BPM validation
const testPatterns = [
    {
        name: "Beat pattern with BPM and beats array",
        pattern: {
            bpm: 350, // Invalid BPM
            beats: [
                {"beat": "kick", "dur": 1, "vol": [1]}
            ]
        }
    },
    {
        name: "Melody pattern with BPM and notes array", 
        pattern: {
            bpm: -10, // Invalid BPM
            notes: [
                {"note": "C4", "dur": 1, "vol": [0.8]}
            ]
        }
    },
    {
        name: "Beat pattern with BPM and pattern array",
        pattern: {
            bpm: 400, // Invalid BPM
            pattern: [
                {"beat": "kick", "dur": 1, "vol": [1]}
            ]
        }
    }
];

console.log("Testing BPM validation...");

testPatterns.forEach(test => {
    console.log(`\nTesting: ${test.name}`);
    console.log("Pattern:", JSON.stringify(test.pattern, null, 2));
    
    // Simulate the validation logic
    let patternItems = [];
    let bpm = null;
    
    if (Array.isArray(test.pattern)) {
        patternItems = test.pattern;
    } else if (typeof test.pattern === 'object' && test.pattern.pattern && Array.isArray(test.pattern.pattern)) {
        patternItems = test.pattern.pattern;
        bpm = test.pattern.bpm;
    } else if (typeof test.pattern === 'object' && Array.isArray(test.pattern.beats)) {
        patternItems = test.pattern.beats;
        bpm = test.pattern.bpm;
    } else if (typeof test.pattern === 'object' && Array.isArray(test.pattern.notes)) {
        patternItems = test.pattern.notes;
        bpm = test.pattern.bpm;
    }
    
    console.log("Extracted BPM:", bpm);
    console.log("Pattern items:", patternItems.length);
    
    // Validate BPM
    if (bpm !== null && bpm !== undefined) {
        if (typeof bpm !== 'number' || bpm <= 0 || bpm > 300) {
            console.log("❌ INVALID BPM detected!");
        } else {
            console.log("✅ BPM is valid");
        }
    } else {
        console.log("ℹ️ No BPM to validate");
    }
});