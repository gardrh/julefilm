const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzIXHWRPtrAlIWFDzvWyUvjpUfXrm8EkQKY5bW4bv_G2bDnUceQdClWB_Ghd_75tZzZqQ/exec';

async function fetchMovies() {
    try {
        const response = await fetch(APPS_SCRIPT_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const movies = await response.json();
        populateMovieDropdown(movies);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function populateMovieDropdown(movies) {
    const movieSelect = document.getElementById('movieSelect');
    movieSelect.innerHTML = ''; // Clear existing options
    
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.id; // Movie ID
        option.textContent = `${movie.title} (${movie.year})`; // Movie Title (Year)
        option.dataset.imdb = movie.imdb; // IMDb URL stored in the option dataset
        movieSelect.appendChild(option);
    });
}

async function submitRating() {
    const movieID = document.getElementById('movieSelect').value;
    const rating = document.querySelector('input[name="rating"]:checked').value; // Assuming you have radio buttons for rating
    const comment = document.getElementById('comment').value;

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movieID, rating, comment })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        if (result.status === 'success') {
            alert('Thank you for your rating!');
            // Optionally refresh the ratings or clear inputs
            document.getElementById('comment').value = ''; // Clear comment input
            fetchRatings(movieID); // If you have a function to fetch ratings
        } else {
            alert('Error submitting your rating. Please try again.');
        }
    } catch (error) {
        console.error('There was a problem with the submission:', error);
    }
}

// Fetch movies when the page loads
fetchMovies();
