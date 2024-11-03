const scriptURL = 'https://script.google.com/macros/s/AKfycbzIXHWRPtrAlIWFDzvWyUvjpUfXrm8EkQKY5bW4bv_G2bDnUceQdClWB_Ghd_75tZzZqQ/exec';
const movieSelect = document.getElementById('movieSelect');
const snowflakeRating = document.getElementById('snowflakeRating');
const reviewTextarea = document.getElementById('review');
const submitButton = document.getElementById('submitButton');
let selectedRating = 0;

// Populate movie titles in the dropdown
async function populateMovies() {
    try {
        const response = await fetch(scriptURL + '?action=getMovieTitles');
        const movieTitles = await response.json();

        movieTitles.forEach(title => {
            const option = document.createElement('option');
            option.value = title.ID;  // Ensure this matches your Google Sheet structure
            option.textContent = title.Title; // Assuming the title structure
            movieSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching movie titles:', error);
    }
}

// Handle snowflake click event
snowflakeRating.addEventListener('click', (event) => {
    if (event.target.dataset.value) {
        selectedRating = parseInt(event.target.dataset.value);
        updateSnowflakeColors(selectedRating);
    }
});

// Update snowflake colors based on rating
function updateSnowflakeColors(rating) {
    const snowflakes = snowflakeRating.querySelectorAll('span');
    snowflakes.forEach((snowflake, index) => {
        snowflake.style.color = index < rating ? 'gold' : 'black'; // Change color to gold if selected
    });
}

// Submit rating and review
submitButton.addEventListener('click', async () => {
    const movieID = movieSelect.value;
    const review = reviewTextarea.value;

    if (!movieID || selectedRating === 0 || !review) {
        alert('Please select a movie, rate it, and write a review before submitting.');
        return;
    }

    const formData = new FormData();
    formData.append('MovieID', movieID);
    formData.append('Rating', selectedRating);
    formData.append('Comment', review);

    try {
        const response = await fetch(scriptURL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.result === 'success') {
            openThankYouBox();
            resetForm();
        } else {
            alert('Error submitting rating: ' + result.error);
        }
    } catch (error) {
        console.error('Error submitting rating:', error);
    }
});

// Open thank you modal
function openThankYouBox() {
    document.getElementById('thankYouBox').style.display = 'block';
}

// Close thank you modal
function closeThankYouBox() {
    document.getElementById('thankYouBox').style.display = 'none';
}

// Reset form after submission
function resetForm() {
    movieSelect.selectedIndex = 0;
    selectedRating = 0;
    updateSnowflakeColors(0); // Reset snowflake colors
    reviewTextarea.value = '';
}

// Fetch movies when the page loads
document.addEventListener('DOMContentLoaded', populateMovies);
