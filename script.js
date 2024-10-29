// Load movies from Google Sheets and populate dropdown
async function loadMovies() {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzIXHWRPtrAlIWFDzvWyUvjpUfXrm8EkQKY5bW4bv_G2bDnUceQdClWB_Ghd_75tZzZqQ/exec');
    const movies = await response.json();

    const movieSelect = document.getElementById("movieSelect");
    movieSelect.innerHTML = movies
        .map(movie => `<option value="${movie.id}">${movie.title} (${movie.year})</option>`)
        .join("");
}

loadMovies();

let selectedRating = 0;

// Snowflake Rating System
const snowflakes = document.querySelectorAll("#snowflakeRating span");
snowflakes.forEach(snowflake => {
    snowflake.addEventListener("click", () => {
        selectedRating = parseInt(snowflake.getAttribute("data-value"));
        updateSnowflakeRating(selectedRating);
    });
});

function updateSnowflakeRating(rating) {
    snowflakes.forEach(snowflake => {
        const value = parseInt(snowflake.getAttribute("data-value"));
        if (value <= rating) {
            snowflake.classList.add("selected");
        } else {
            snowflake.classList.remove("selected");
        }
    });
}

// Submit rating to Google Sheets
async function submitRating() {
    const movieID = document.getElementById("movieSelect").value;
    const comment = document.getElementById("review").value;

    if (selectedRating === 0) {
        alert("Please select a snowflake rating!");
        return;
    }

    const response = await fetch('https://script.google.com/macros/s/AKfycbzIXHWRPtrAlIWFDzvWyUvjpUfXrm8EkQKY5bW4bv_G2bDnUceQdClWB_Ghd_75tZzZqQ/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            movieID: movieID,
            rating: selectedRating,
            comment: comment
        })
    });

    if (response.ok) {
        showThankYouBox();
        clearForm();
    } else {
        alert("Failed to submit rating. Please try again.");
    }
}

function showThankYouBox() {
    const thankYouBox = document.getElementById("thankYouBox");
    thankYouBox.style.display = "block";
}

function closeThankYouBox() {
    const thankYouBox = document.getElementById("thankYouBox");
    thankYouBox.style.display = "none";
}

function clearForm() {
    document.getElementById("movieSelect").value = "";
    document.getElementById("review").value = "";
    selectedRating = 0;
    updateSnowflakeRating(selectedRating);
}
