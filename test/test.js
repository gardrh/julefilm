const baseUrl = 'https://script.google.com/macros/s/AKfycbzIXHWRPtrAlIWFDzvWyUvjpUfXrm8EkQKY5bW4bv_G2bDnUceQdClWB_Ghd_75tZzZqQ/exec';

// Test Function to Fetch Movies
function testFetchMovies() {
    console.log('Test 1: Fetching movies...');

    fetch(baseUrl)  // Use the base URL to fetch movie data
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Movies loaded successfully:', data);
            console.log('Number of movies:', data.length);
        })
        .catch(error => {
            console.error('Test 1 Failed - Error loading movies:', error);
        });
}

// Test Function to Submit Rating
function testSubmitRating(movieID, title, rating, comment) {
    console.log('Test 2: Submitting test rating...');

    const ratingData = {
        movieID: movieID,
        title: title,
        rating: rating,
        comment: comment
    };

    fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ratingData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Rating submission result:', data);
    })
    .catch(error => {
        console.error('Test 2 Failed - Error submitting rating:', error);
    });
}

// Example Usage
document.getElementById('fetchMoviesBtn').onclick = testFetchMovies;  // Button for fetching movies
document.getElementById('submitRatingBtn').onclick = () => {
    testSubmitRating(1, 'Sample Movie', 5, 'Great movie!'); // Example rating submission
};
