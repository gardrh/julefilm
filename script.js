const googleScriptURL = 'https://script.google.com/macros/s/AKfycbzPc47ZgTCruUTX75UXj_rL4BHW6Zuv3_YjJBL1vziDe5Q0OfVWBe9SUV0Xt6DY--4Xcw/exec';

// Load movies from Google Sheets and populate dropdown
async function loadMovies() {
    try {
        const response = await fetch(googleScriptURL);
        const movies = await response.json();

        const movieSelect = document.getElementById("movieSelect");
        movieSelect.innerHTML = movies
            .map(movie => `<option value="${movie.id}">${movie.title} (${movie.year})</option>`)
            .join("");
    } catch (error) {
        console.error("Error loading movies:", error);
        alert("Failed to load movies.");
    }
}

loadMovies();

let selectedRating = 0;

// Snowflake Rating System
const snowflakes = document.querySelectorAll("#snowflakeRating span");
snowflakes.forEach((snowflake, index) => {
    snowflake.addEventListener("click", () => {
        selectedRating = index + 1;
        updateSnowflakeRating(selectedRating);
    });

    snowflake.addEventListener("mouseover", () => {
        updateSnowflakeRating(index + 1);
    });

    snowflake.addEventListener("mouseleave", () => {
        updateSnowflakeRating(selectedRating);
    });
});

function updateSnowflakeRating(rating) {
    snowflakes.forEach((snowflake, index) => {
        snowflake.classList.toggle("selected", index < rating);
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

    // Log data before submission
    console.log({
        movieID: movieID,
        rating: selectedRating,
        comment: comment
    });

    try {
        const response = await fetch(googleScriptURL, {
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
            const data = await response.json();
            console.log("Success:", data);
            showThankYouBox();
            clearForm();
        } else {
            const errorData = await response.text();
            console.error("Response error:", errorData);
            alert("Failed to submit rating. Please try again.");
        }
    } catch (error) {
        console.error("Error submitting rating:", error);
        alert("Failed to submit rating. Please try again.");
    }
}

// Show Thank You Box
function showThankYouBox() {
    document.getElementById("thankYouBox").style.display = "block";
}

// Hide Thank You Box
function closeThankYouBox() {
    document.getElementById("thankYouBox").style.display = "none";
}

// Clear form fields
function clearForm() {
    document.getElementById("movieSelect").value = "";  // Reset movie selection
    document.getElementById("review").value = "";        // Clear the comment field
    selectedRating = 0;                                  // Reset rating
    updateSnowflakeRating(selectedRating);               // Clear selected snowflakes
}
