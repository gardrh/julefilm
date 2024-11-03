// Test Script (test.js)
async function testGoogleSheetsIntegration() {
    const googleScriptURL = 'https://script.google.com/macros/s/AKfycbzIXHWRPtrAlIWFDzvWyUvjpUfXrm8EkQKY5bW4bv_G2bDnUceQdClWB_Ghd_75tZzZqQ/exec';
    
    console.log('Starting integration tests...');

    // Test 1: GET Request (Loading Movies)
    try {
        console.log('Test 1: Fetching movies...');
        const response = await fetch(googleScriptURL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const movies = await response.json();
        console.log('Movies loaded successfully:', movies);
        console.log('Number of movies:', movies.length);
    } catch (error) {
        console.error('Test 1 Failed - Error loading movies:', error);
    }

    // Test 2: POST Request (Submitting Rating)
    try {
        console.log('Test 2: Submitting test rating...');
        const testData = {
            movieID: "TEST123",
            title: "Test Movie",
            rating: 5,
            comment: "Test comment - " + new Date().toISOString()
        };

        const response = await fetch(googleScriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        console.log('Rating submission result:', result);
    } catch (error) {
        console.error('Test 2 Failed - Error submitting rating:', error);
    }
}
