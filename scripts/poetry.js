function playPoemAudio(titleSlug) {
	const audioPath = `../audio/${titleSlug}.mp3`;

	// Check if the file exists first
	fetch(audioPath, { method: "HEAD" })
		.then(response => {
			if (response.ok) {
				// Only create audio if it exists
				const audio = new Audio(audioPath);
				audio.play().catch(() => {
					alert("Audio is unavailable for this story.");
				});
			} else {
				alert("Audio is unavailable for this story.");
			}
		})
		.catch(() => {
			alert("Audio is unavailable for this story.");
		});
}

function insertRatingElement() {
	const poemContainer = document.querySelector(".poem-container");
	const poemTitleElement = document.querySelector(".poem-title");

	if (!poemContainer || !poemTitleElement) {
		console.error("⚠️ No .poem-container or .poem-title found on page.");
		return;
	}

	const poemTitle = poemTitleElement.textContent.trim(); // 🧠 Grab the title text

	const ratingDiv = document.createElement("div");
	ratingDiv.className = "rating-widget";

	const title = document.createElement("h3");
	title.textContent = "Rate This Poem";

	const starsContainer = document.createElement("div");
	starsContainer.className = "stars";

	for (let i = 1; i <= 5; i++) {
		const star = document.createElement("span");
		star.className = "star";
		star.innerHTML = "&#9733;";
		star.dataset.value = i;

		star.addEventListener("mouseover", () => {
			highlightStars(i);
		});
		star.addEventListener("mouseout", () => {
			highlightStars(currentRating);
		});
		star.addEventListener("click", () => {
			currentRating = i;
		});

		starsContainer.appendChild(star);
	}

	const commentInput = document.createElement("textarea");
	commentInput.className = "comment-box";
	commentInput.placeholder = "Leave a comment (optional)...";

	const submitButton = document.createElement("button");
	submitButton.className = "btn btn-primary mt-2";
	submitButton.textContent = "Submit Rating";

	submitButton.addEventListener("click", () => {
		alert(`You rated "${poemTitle}" with ${currentRating} stars!\nComment: ${commentInput.value}`);
		// Later when backend is ready, we send this to your API endpoint
	});

	let currentRating = 0;

	function highlightStars(rating) {
		const stars = starsContainer.querySelectorAll(".star");
		stars.forEach((star, index) => {
			if (index < rating) {
				star.classList.add("highlighted");
			} else {
				star.classList.remove("highlighted");
			}
		});
	}

	ratingDiv.appendChild(title);
	ratingDiv.appendChild(starsContainer);
	ratingDiv.appendChild(commentInput);
	ratingDiv.appendChild(submitButton);

	poemContainer.appendChild(ratingDiv); // ⬅️ Add widget to every poem page automatically
}

insertRatingElement();