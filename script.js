const SHEET_ID = '1XsdRBateJPBKKqiulRxWuj_sR1DWFYHLR361Q-3ftVI';
const API_KEY = '29940940425-j7nk0vnoh16jr48fke3skh7bkuitcj3d.apps.googleusercontent.com';

async function fetchMovies() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/movies?key=${API_KEY}`);
    const data = await response.json();
    const movies = data.values.slice(1); // Remove header row
    populateMovieDropdown(movies);
}

function populateMovieDropdown(movies) {
    const movieSelect = document.getElementById('movieSelect');
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie[0]; // Movie ID
        option.textContent = `${movie[1]} (${movie[2]})`; // Movie Title (Year)
        movieSelect.appendChild(option);
    });
}

fetchMovies();


document.getElementById('stars').addEventListener('click', (event) => {
    const stars = event.target.parentNode;
    const rating = Array.from(stars.children).indexOf(event.target) + 1;
    stars.dataset.rating = rating;
    Array.from(stars.children).forEach((star, index) => {
        star.innerHTML = index < rating ? '&#9733;' : '&#9734;';
    });
});


async function submitRating() {
    const movieID = document.getElementById('movieSelect').value;
    const rating = document.getElementById('stars').dataset.rating;
    const comment = document.getElementById('comment').value;
    const date = new Date().toISOString();

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/ratings:append?valueInputOption=RAW&key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            range: 'ratings',
            majorDimension: 'ROWS',
            values: [[movieID, rating, comment, date]]
        })
    });

    if (response.ok) {
        alert('Thank you for your rating!');
        fetchRatings(movieID); // Refresh reviews for this movie
    } else {
        alert('Error submitting your rating. Please try again.');
    }
}

async function fetchRatings(movieID) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/ratings?key=${API_KEY}`);
    const data = await response.json();
    const reviews = data.values.filter(row => row[0] === movieID); // Filter by MovieID

    const reviewsSection = document.getElementById('reviews');
    reviewsSection.innerHTML = reviews.map(review => `<p><strong>Rating:</strong> ${review[1]} stars<br><strong>Comment:</strong> ${review[2]}</p>`).join('');
}
