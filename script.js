const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwvzMHDUFibfbISzNRWRNQRkqmhC2NVNOPua_idgNvzY6_cHdfGq0jOMGtLmj5cWmHgGg/exec';
let selectedRating = 0;

// Load movies when page loads
async function loadMovies() {
    try {
        const response = await fetch(googleScriptURL + '?action=getMovies');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const movies = await response.json();
        const movieSelect = document.getElementById("movieSelect");
        
        movieSelect.innerHTML = '<option value="">-- Select a movie --</option>' +
            movies.map(movie => `<option value="${movie.id}">${movie.title} (${movie.year})</option>`).join('');
    } catch (error) {
        console.error("Error loading movies:", error);
        alert("Failed to load movies. Please refresh the page.");
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    initializeSnowflakeRating();
});

// Snowflake rating system
function initializeSnowflakeRating() {
    const snowflakes = document.querySelectorAll("#snowflakeRating span");
    
    snowflakes.forEach(snowflake => {
        snowflake.addEventListener('mouseover', () => {
            const rating = parseInt(snowflake.getAttribute('data-value'));
            updateSnowflakeDisplay(rating, true);
        });

        snowflake.addEventListener('mouseout', () => {
            updateSnowflakeDisplay(selectedRating, false);
        });

        snowflake.addEventListener('click', () => {
            selectedRating = parseInt(snowflake.getAttribute('data-value'));
            updateSnowflakeDisplay(selectedRating, false);
        });
    });
}

function updateSnowflakeDisplay(rating, isHover) {
    const snowflakes = document.querySelectorAll("#snowflakeRating span");
    
    snowflakes.forEach((snowflake, index) => {
        const value = index + 1;
        if (value <= rating) {
            snowflake.style.color = isHover ? '#ffa500' : '#ffd700'; // Orange for hover, Gold for selected
            snowflake.style.transform = 'scale(1.2)';
            snowflake.classList.add('selected');
        } else {
            snowflake.style.color = '#ddd';
            snowflake.style.transform = 'scale(1)';
            snowflake.classList.remove('selected');
        }
    });
}

async function submitRating() {
    const movieSelect = document.getElementById("movieSelect");
    const review = document.getElementById("review");

    // Validation
    if (!movieSelect.value) {
        alert('Please select a movie');
        return;
    }
    if (selectedRating === 0) {
        alert('Please select a rating');
        return;
    }
    if (!review.value.trim()) {
        alert('Please write a review');
        return;
    }

    const formData = {
        MovieID: movieSelect.value,
        Title: movieSelect.selectedOptions[0].text.split(' (')[0],
        Rating: selectedRating,
        Comment: review.value.trim()
    };

    try {
        const response = await fetch(googleScriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        if (result.result === 'success') {
            showThankYouBox();
            clearForm();
        } else {
            throw new Error(result.error || 'Submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit rating. Please try again.');
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
    updateSnowflakeDisplay(0, false);
}

// Initialize loading of movies when page is ready
document.addEventListener('DOMContentLoaded', loadMovies);
