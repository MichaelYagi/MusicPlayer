// Test BPM validation with empty pattern items
const testCases = [
    {
        name: "Invalid BPM with empty beats array",
        pattern: {
            bpm: 350,
            beats: []
        },
        shouldFail: true
    },
    {
        name: "Invalid BPM with empty notes array", 
        pattern: {
            bpm: -10,
            notes: []
        },
        shouldFail: true
    },
    {
        name: "Valid BPM with empty pattern array",
        pattern: {
            bpm: 120,
            pattern: []
        },
        shouldFail: false // Should pass because BPM is valid, even though pattern is empty
    }
];

console.log("Testing BPM validation with empty pattern items...");

testCases.forEach(test => {
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
    
    let issues = [];
    
    // Validate BPM - this should happen even if patternItems is empty
    if (bpm !== null && bpm !== undefined) {
        if (typeof bpm !== 'number' || bpm <= 0 || bpm > 300) {
            issues.push(`Invalid BPM: ${bpm}. Must be a number between 1 and 300`);
        }
    }
    
    const hasIssues = issues.length > 0;
    const testPassed = hasIssues === test.shouldFail;
    
    console.log("Issues:", issues);
    console.log("Expected to fail:", test.shouldFail);
    console.log("Actually has issues:", hasIssues);
    console.log(testPassed ? "✅ TEST PASSED" : "❌ TEST FAILED");
});