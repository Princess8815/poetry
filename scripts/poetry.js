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

async function insertRatingElement() {
	const poemContainer = document.querySelector(".poem-container");
	const poemTitleElement = document.querySelector(".poem-title");

	if (!poemContainer || !poemTitleElement) {
		console.error("⚠️ No .poem-container or .poem-title found.");
		return;
	}

	const poemTitle = poemTitleElement.textContent.trim();
	let userId = null;
	let currentRating = 0;
	let currentComment = "";

	// Step 1: Check session
	try {
		const sessionRes = await fetch("https://backend-bzip.onrender.com/api/check-session", {
			method: "POST",
			credentials: "include",
		});
		const sessionData = await sessionRes.json();

		if (sessionData.loggedIn) {
			userId = sessionData.user.id;
		}
	} catch (err) {
		console.warn("⚠️ Could not confirm session.");
	}

	// Step 2: Create rating div
	const ratingDiv = document.createElement("div");
	ratingDiv.className = "rating-widget";

	async function fetchAndDisplayRatings(poemTitle) {
		try {

			const existingAvg = ratingDiv.querySelector(".average-rating");
			if (existingAvg) {
				existingAvg.remove();
			}

		  const response = await fetch(`https://backend-bzip.onrender.com/api/poem-rating?poemTitle=${encodeURIComponent(poemTitle)}`, {
			method: "GET",
			credentials: "include",
		  });
		  const data = await response.json();
	  
		  if (data.success) {
			if (data.average !== null) {
			  const averageDisplay = document.createElement("p");
			  averageDisplay.className = "average-rating";
			  averageDisplay.textContent = `Average Rating: ${data.average} / 5`;
			  ratingDiv.insertBefore(averageDisplay, ratingDiv.firstChild);
			}
	  
			if (data.userRating) {
			  currentRating = data.userRating.rating;
			  highlightStars(currentRating);
			  commentInput.value = data.userRating.comment || "";
			}
		  } else {
			console.warn("Could not fetch average rating.");
		  }
		} catch (err) {
		  console.error("Error fetching ratings:", err);
		}
	  }
	  

	const title = document.createElement("h3");
	title.textContent = "Rate This Poem";

	const avgRatingSpan = document.createElement("span");
	avgRatingSpan.className = "average-rating";
	title.appendChild(avgRatingSpan); // Will be updated later

	const starsContainer = document.createElement("div");
	starsContainer.className = "stars";

	for (let i = 1; i <= 5; i++) {
		const star = document.createElement("span");
		star.className = "star";
		star.innerHTML = "&#9733;";
		star.dataset.value = i;

		star.addEventListener("mouseover", () => highlightStars(i));
		star.addEventListener("mouseout", () => highlightStars(currentRating));
		star.addEventListener("click", () => {
			if (!userId) {
				alert("You must be logged in to rate.");
				return;
			}
			currentRating = i;
			highlightStars(currentRating);
		});

		starsContainer.appendChild(star);
	}

	const commentInput = document.createElement("textarea");
	commentInput.className = "comment-box";
	commentInput.placeholder = "Leave a comment (optional)...";

	const submitButton = document.createElement("button");
	submitButton.className = "btn btn-primary mt-2";
	submitButton.textContent = "Submit Rating";

	submitButton.addEventListener("click", async () => {
		try {
		  const response = await fetch("https://backend-bzip.onrender.com/api/rate-poem", {
			method: "POST",
			credentials: "include",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  poemTitle,
			  rating: currentRating,
			  comment: commentInput.value,
			}),
		  });
	  
		  const result = await response.json();
		  if (result.success) {
			alert("Your rating has been submitted.");
			fetchAndDisplayRatings(poemTitle); // Refresh average rating
		  } else {
			alert("Failed to submit rating: " + result.error);
		  }
		} catch (err) {
		  console.error("Error submitting rating:", err);
		  alert("An error occurred while submitting your rating.");
		}
	  });
	  

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
	poemContainer.appendChild(ratingDiv);
	fetchAndDisplayRatings(poemTitle);

	// Step 3: Fetch user rating if logged in
	if (userId) {
		try {
			const res = await fetch("https://backend-bzip.onrender.com/api/user-rating", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ poemTitle }),
			});
			const data = await res.json();
			if (data.success && data.rating) {
				currentRating = data.rating.rating;
				commentInput.value = data.rating.comment || "";
				highlightStars(currentRating);
			}
		} catch (err) {
			console.warn("⚠️ Failed to load user rating.");
		}
	}

	// Step 4: Show average rating
	async function updateAverageRating() {
		try {
			const res = await fetch("https://backend-bzip.onrender.com/api/average-rating", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ poemTitle }),
			});
			const data = await res.json();
			if (data.success && data.average !== null) {
				avgRatingSpan.textContent = ` – ${data.average.toFixed(1)} / 5 ⭐`;
			}
		} catch (err) {
			console.warn("⚠️ Could not fetch average rating.");
		}
	}

	updateAverageRating(); // Call it initially
}


insertRatingElement();