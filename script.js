const googleScriptURL = 'https://script.google.com/macros/s/AKfycbzPc47ZgTCruUTX75UXj_rL4BHW6Zuv3_YjJBL1vziDe5Q0OfVWBe9SUV0Xt6DY--4Xcw/exec';

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
let currentSnowflakeIndex = -1; // To track which snowflake is focused

function addSnowflakeListeners() {
    snowflakes.forEach((snowflake, index) => {
        // Mouse event listeners
        snowflake.addEventListener("mouseover", () => updateSnowflakeRating(index + 1));
        snowflake.addEventListener("mouseleave", () => updateSnowflakeRating(selectedRating));
        snowflake.addEventListener("click", () => {
            selectedRating = index + 1;
            updateSnowflakeRating(selectedRating);
        });

        // Keyboard event listener
        snowflake.addEventListener("keydown", (event) => {
            if (event.key === 'Enter') {
                selectedRating = index + 1;
                updateSnowflakeRating(selectedRating);
            }
        });
    });

    // Handle keyboard navigation with arrow keys and shift
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            if (currentSnowflakeIndex < snowflakes.length - 1) {
                currentSnowflakeIndex++;
                updateSnowflakeRating(currentSnowflakeIndex + 1);
                snowflakes[currentSnowflakeIndex].focus(); // Set focus to the current snowflake
            }
        } else if (event.key === 'ArrowLeft') {
            if (currentSnowflakeIndex > 0) {
                currentSnowflakeIndex--;
                updateSnowflakeRating(currentSnowflakeIndex + 1);
                snowflakes[currentSnowflakeIndex].focus(); // Set focus to the current snowflake
            }
        }
    });
}

function updateSnowflakeRating(rating) {
    snowflakes.forEach((snowflake, index) => {
        snowflake.classList.toggle("selected", index < rating);
        if (index < rating) {
            snowflake.setAttribute('tabindex', '0'); // Make the selected snowflakes focusable
        } else {
            snowflake.removeAttribute('tabindex');
        }
    });
}

addSnowflakeListeners();

async function submitRating() {
    const movieID = document.getElementById("movieSelect").value;
    const movieTitle = document.getElementById("movieSelect").selectedOptions[0].textContent.split(" (")[0];
    const comment = document.getElementById("review").value;

    if (selectedRating === 0) {
        alert("Please select a snowflake rating!");
        return;
    }

    try {
        const response = await fetch(googleScriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                movieID: movieID,
                title: movieTitle,
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
            console.error("Failed response:", await response.text());
            alert("Failed to submit rating. Please try again.");
        }
    } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to submit rating. Please try again.");
    }
}

function showThankYouBox() {
    document.getElementById("thankYouBox").style.display = "block";
}

function closeThankYouBox() {
    document.getElementById("thankYouBox").style.display = "none";
}

function clearForm() {
    document.getElementById("movieSelect").value = "";
    document.getElementById("review").value = "";
    selectedRating = 0;
    currentSnowflakeIndex = -1; // Reset the index
    updateSnowflakeRating(selectedRating);
}
