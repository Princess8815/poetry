function playPoemAudio(titleSlug) {
        const audioPath = `../audio/${titleSlug}.wav`;

        // Check if the file exists first
        fetch(audioPath, { method: "HEAD" })
                .then(response => {
                        if (response.ok) {
                                // Only create audio if it exists
                                const audio = new Audio(audioPath);
                                audio.play().catch(() => {
                                        alert("Audio is not available for this story.");
                                });
                        } else {
                                alert("Audio is unavailable for this story.");
                        }
                })
                .catch(() => {
                        alert("Audio cannot be found for this story.");
                });
}

function resolvePoemDataPath() {
    const host = window.location.hostname;
    const isLocal = host === "127.0.0.1" || host === "localhost";

    // Local (VS Code Live Server)
    if (isLocal) {
        // When viewing pages like /poetry/poem.html, the data folder is one level up
        return "../data/poems.json";
    }

    // GitHub Pages (princess8815.github.io/poetry/...)
    return `${window.location.origin}/poetry/data/poems.json`;
}



function getSlugFromLocation() {
        const url = new URL(window.location.href);
        const paramSlug = url.searchParams.get("slug");
        if (paramSlug) {
                return paramSlug;
        }

        const pathMatch = window.location.pathname.match(/\/poetry\/(?:poetry\/)?([^/]+)\.html$/);
        return pathMatch ? pathMatch[1] : null;
}

function formatReleaseDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (Number.isNaN(date.valueOf())) return "";
        return date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
        });
}

async function loadPoemFromJson() {
        const container = document.querySelector(".poem-container");
        if (!container) return;

        const titleElement = container.querySelector(".poem-title");
        const contentElement = container.querySelector(".poem-content");
        const metaElement = container.querySelector(".poem-meta");
        const releaseElement = container.querySelector(".poem-release-date");
        const tagsElement = container.querySelector(".poem-tags");
        const errorElement = container.querySelector(".poem-error");
        const audioButton = document.getElementById("poem-audio-button");

        const slug = getSlugFromLocation();

        if (!slug) {
                if (errorElement) {
                        errorElement.hidden = false;
                        errorElement.textContent = "No poem specified. Please select a poem from the poetry list.";
                }
                if (contentElement) {
                        contentElement.textContent = "";
                }
                if (releaseElement) {
                        releaseElement.textContent = "";
                        releaseElement.hidden = true;
                }
                if (tagsElement) {
                        tagsElement.textContent = "";
                        tagsElement.hidden = true;
                }
                if (metaElement) {
                        metaElement.hidden = true;
                }
                if (audioButton) {
                        audioButton.disabled = true;
                        audioButton.setAttribute("aria-disabled", "true");
                        audioButton.onclick = null;
                }
                return;
        }

        try {
                const dataPath = resolvePoemDataPath();
                const response = await fetch(dataPath);
                if (!response.ok) {
                        throw new Error("Failed to load poems data.");
                }

                const data = await response.json();
                const poems = Array.isArray(data?.poems) ? data.poems : [];
                const poem = poems.find(entry => entry.slug === slug);

                if (!poem) {
                        if (errorElement) {
                                errorElement.hidden = false;
                                errorElement.textContent = "We couldn't find that poem. Please return to the poetry page and try again.";
                        }
                        if (contentElement) {
                                contentElement.textContent = "";
                        }
                        if (releaseElement) {
                                releaseElement.textContent = "";
                                releaseElement.hidden = true;
                        }
                        if (tagsElement) {
                                tagsElement.textContent = "";
                                tagsElement.hidden = true;
                        }
                        if (metaElement) {
                                metaElement.hidden = true;
                        }
                        if (audioButton) {
                                audioButton.disabled = true;
                                audioButton.setAttribute("aria-disabled", "true");
                                audioButton.onclick = null;
                        }
                        return;
                }

                if (titleElement) {
                        titleElement.textContent = poem.title || slug;
                }
                document.title = poem.title ? `${poem.title} | Kirstin's Poetry` : document.title;

                if (contentElement) {
                        contentElement.textContent = poem.content || "";
                }

                let hasRelease = false;
                if (releaseElement) {
                        const formattedDate = formatReleaseDate(poem.releaseDate);
                        releaseElement.textContent = formattedDate ? `Released ${formattedDate}` : "";
                        releaseElement.hidden = !formattedDate;
                        hasRelease = Boolean(formattedDate);
                }

                let hasTags = false;
                if (tagsElement) {
                        if (Array.isArray(poem.tags) && poem.tags.length > 0) {
                                tagsElement.textContent = `Tags: ${poem.tags.join(", ")}`;
                                tagsElement.hidden = false;
                                hasTags = true;
                        } else {
                                tagsElement.hidden = true;
                                tagsElement.textContent = "";
                        }
                }

                if (metaElement) {
                        metaElement.hidden = !hasRelease && !hasTags;
                }

                if (errorElement) {
                        errorElement.hidden = true;
                        errorElement.textContent = "";
                }

                if (audioButton) {
                        const audioSlug = poem.audioSlug || poem.slug || slug;
                        audioButton.disabled = false;
                        audioButton.setAttribute("aria-disabled", "false");
                        audioButton.onclick = () => playPoemAudio(audioSlug);
                }

                insertRatingElement();
        } catch (error) {
                console.error("Failed to load poem:", error);
                if (errorElement) {
                        errorElement.hidden = false;
                        errorElement.textContent = "Something went wrong while loading this poem. Please try again later.";
                }
                if (contentElement) {
                        contentElement.textContent = "";
                }
                if (releaseElement) {
                        releaseElement.textContent = "";
                        releaseElement.hidden = true;
                }
                if (tagsElement) {
                        tagsElement.textContent = "";
                        tagsElement.hidden = true;
                }
                if (metaElement) {
                        metaElement.hidden = true;
                }
                if (audioButton) {
                        audioButton.disabled = true;
                        audioButton.setAttribute("aria-disabled", "true");
                        audioButton.onclick = null;
                }
        }
}

document.addEventListener("DOMContentLoaded", loadPoemFromJson);

async function insertRatingElement() {
	const poemContainer = document.querySelector(".poem-container");
	const poemTitleElement = document.querySelector(".poem-title");

	if (!poemContainer || !poemTitleElement) {
		console.error("⚠️ No .poem-container or .poem-title found.");
		return;
	}

        const poemTitle = poemTitleElement.textContent.trim();
        const poemTitleLower = poemTitle.toLowerCase();
        if (!poemTitle || poemTitleLower === "loading…" || poemTitleLower === "loading...") {
                return;
        }

        const existingWidget = poemContainer.querySelector(".rating-widget");
        if (existingWidget) {
                existingWidget.remove();
        }

        let userId = null;
        let currentRating = 0;

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
                        const response = await fetch(`https://backend-bzip.onrender.com/api/poem-rating?poemTitle=${encodeURIComponent(poemTitle)}`, {
                                method: "GET",
                                credentials: "include",
                        });
                        const data = await response.json();

                        if (data.success) {
                                if (data.average !== null) {
                                        avgRatingSpan.textContent = ` – ${Number(data.average).toFixed(1)} / 5 ⭐`;
                                } else {
                                        avgRatingSpan.textContent = " – No ratings yet";
                                }

                                if (data.userRating) {
                                        currentRating = data.userRating.rating;
                                        highlightStars(currentRating);
                                        commentInput.value = data.userRating.comment || "";
                                } else {
                                        currentRating = 0;
                                        highlightStars(currentRating);
                                        commentInput.value = "";
                                }
                        } else {
                                console.warn("Could not fetch average rating.");
                                avgRatingSpan.textContent = " – Ratings unavailable";
                        }
                } catch (err) {
                        console.error("Error fetching ratings:", err);
                        avgRatingSpan.textContent = " – Ratings unavailable";
                        currentRating = 0;
                        highlightStars(currentRating);
                }
        }
	  

	const title = document.createElement("h3");
	title.textContent = "Rate This Poem";

        const avgRatingSpan = document.createElement("span");
        avgRatingSpan.className = "average-rating";
        avgRatingSpan.textContent = "";
        title.appendChild(avgRatingSpan);

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
                  if (!userId) {
                        alert("You must be logged in to rate.");
                        return;
                  }

                  if (currentRating === 0) {
                        alert("Please choose a star rating before submitting.");
                        return;
                  }

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

	const viewReviewsButton = document.createElement("button");
	viewReviewsButton.className = "btn btn-outline-secondary mt-3";
	viewReviewsButton.textContent = "View All Reviews";

	viewReviewsButton.addEventListener("click", () => {
		// Redirect to a new page with query param
		window.location.href = `../pages/reviews.html?poem=${encodeURIComponent(poemTitle)}`;
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
        ratingDiv.appendChild(viewReviewsButton);
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

}

