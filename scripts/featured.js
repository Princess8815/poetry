
const titleLinks = {
	// Short Stories (original 6)
	"Echoes in Stardust (coming may 24th)": {
		path: "short-stories/echoes-in-stardust/echoes-in-stardust.html",
		releaseDate: "TBD"
	},

	//"The Midnight Petal": "short-stories/the-midnight-petal.html",
	//"Threadbare Hearts": "short-stories/threadbare-hearts.html",
	//"Letters Never Sent": "short-stories/letters-never-sent.html",
	//"Of Fire and Ink": "short-stories/of-fire-and-ink.html",
	//"Whispers Beneath the Rain": "short-stories/whispers-beneath-the-rain.html",

	// Poetry (your 31)
	"More Then a Word": {
		path: "poetry/more-then-a-word.html",
		releaseDate: "2025-04-26",
		tag: "inspirational"
	},
	"The Playful Pooch": {
		path: "poetry/the-playful-pooch.html",
		releaseDate: "2025-04-26",
		tag: "comedy"
	},
	"Endless Scream": {
		path: "poetry/endless-scream.html",
		releaseDate: "2025-04-26",
		tag: "inspirational"
	},
	"A Daughter’s Truth": {
		path: "poetry/a-daughters-truth.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"A Journey Through Grief": {
		path: "poetry/a-journey-through-grief.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"Animal parade": {
		path: "poetry/animal-parade.html",
		releaseDate: "2025-04-17",
		tag: "comedy"
	},
	"Dream": {
		path: "poetry/dream.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"Easter Poem 2025": {
		path: "poetry/easter-poem-2025.html",
		releaseDate: "2025-04-17",
		tag: "holiday"
	},
	"Echoes of a Hidden Girl": {
		path: "poetry/echoes-of-a-hidden-girl.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"From Shadows to Light: A Journey of Truth": {
		path: "poetry/from-shadows-to-light.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"Holiday of cheer": {
		path: "poetry/holiday-of-cheer.html",
		releaseDate: "2025-04-17",
		tag: "holiday"
	},
	"I Am Trans and Proud": {
		path: "poetry/i-am-trans-and-proud.html",
		releaseDate: "2025-04-17",
		tag: "pride"
	},
	"I will not": {
		path: "poetry/i-will-not.html",
		releaseDate: "2025-04-17",
		tags: ["pride", "inspirational"]
	},
	"Language We Trust": {
		path: "poetry/language-we-trust.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"Marina the axolotl": {
		path: "poetry/marina-the-axolotl.html",
		releaseDate: "2025-04-17",
		tag: "comedy"
	},
	"Morning poem": {
		path: "poetry/morning-poem.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"Rainbow's True Pride": {
		path: "poetry/rainbows-true-pride.html",
		releaseDate: "2025-04-17",
		tag: "pride"
	},
	"Red round thing": {
		path: "poetry/red-round-thing.html",
		releaseDate: "2025-04-17",
		tag: "comedy"
	},
	"Reflections Reborn": {
		path: "poetry/reflections-reborn.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"Rise Above": {
		path: "poetry/rise-above.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"Shadow": {
		path: "poetry/shadow.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"The Friend Who Saved Her Life": {
		path: "poetry/the-friend-who-saved-her-life.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"The Girl Inside": {
		path: "poetry/the-girl-inside.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"The Road We Walk": {
		path: "poetry/the-road-we-walk.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"The Silent Battle": {
		path: "poetry/the-silent-battle.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"Trans Poem": {
		path: "poetry/trans-poem.html",
		releaseDate: "2025-04-17",
		tag: "pride"
	},
	"Unbreakable": {
		path: "poetry/unbreakable.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"When i am in need": {
		path: "poetry/when-i-am-in-need.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"Will you miss me when im gone": {
		path: "poetry/will-you-miss-me-when-im-gone.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"5 piggies revised": {
		path: "poetry/5-piggies-revised.html",
		releaseDate: "2025-04-17",
		tag: "inspirational"
	},
	"5 piggies (adult)": {
		path: "poetry/5-piggies-adult.html",
		releaseDate: "2025-04-17",
		tag: "adult"
	}
};

let currentSearch = "";
let currentSort = "";
let currentFilter = "";


function getRandomTitles(arr, n) {
	const shuffled = [...arr].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
}

async function fetchAverageRating(poemTitle) {
	try {
		const response = await fetch("https://backend-bzip.onrender.com/api/average-rating", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ poemTitle }),
		});
		const data = await response.json();
		if (data.success && data.average !== null) {
			return parseFloat(data.average);
		}
	} catch (err) {
		console.warn("Failed to fetch rating for:", poemTitle, err);
	}
	return null;
}


async function renderTitles(containerId, count = null) {
	const container = document.getElementById(containerId);
	if (!container) return;

	let entries = Object.entries(titleLinks);

	// Filter for page type
	if (document.body.classList.contains("poetry-page")) {
		entries = entries.filter(([_, data]) => data.path && data.path.startsWith("poetry/"));
	} else if (document.body.classList.contains("short-stories-page")) {
		entries = entries.filter(([_, data]) => data.path && data.path.startsWith("short-stories/"));
	} else if (document.body.classList.contains("books-page")) {
		entries = entries.filter(([_, data]) => data.path && data.path.startsWith("books/"));
	}

	// Filter by tag
	if (currentFilter) {
		entries = entries.filter(([_, data]) => {
			if (typeof data.tag === "string") return data.tag === currentFilter;
			if (Array.isArray(data.tags)) return data.tags.includes(currentFilter);
			return false;
		});
	}

	// Search by title
	if (currentSearch.trim()) {
		const searchLower = currentSearch.trim().toLowerCase();
		entries = entries.filter(([title]) => title.toLowerCase().includes(searchLower));
	}

	// Fetch ratings in parallel
	const ratings = await Promise.all(entries.map(([title]) => fetchAverageRating(title)));
	entries = entries.map(([title, data], index) => {
		data.avgRating = ratings[index];
		return [title, data];
	});

	// Sort
	if (currentSort === "titleAsc") {
		entries.sort(([a], [b]) => a.localeCompare(b));
	} else if (currentSort === "titleDesc") {
		entries.sort(([a], [b]) => b.localeCompare(a));
	} else if (currentSort === "dateAsc") {
		entries.sort(([, a], [, b]) => new Date(a.releaseDate) - new Date(b.releaseDate));
	} else if (currentSort === "dateDesc") {
		entries.sort(([, a], [, b]) => new Date(b.releaseDate) - new Date(a.releaseDate));
	} else if (currentSort === "ratingAsc") {
		entries.sort(([, a], [, b]) => (a.avgRating ?? 0) - (b.avgRating ?? 0));
	} else if (currentSort === "ratingDesc") {
		entries.sort(([, a], [, b]) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
	}

	// Limit if needed
	if (count && count > 0) {
		entries = getRandomTitles(entries, count);
	}

	// Clear and rebuild
	container.innerHTML = "";
	entries.forEach(([title, data]) => {
		let adjustedPath = data.path;
		const releaseDate = data.releaseDate || "Unknown";
		const avgRating = data.avgRating != null ? `${data.avgRating.toFixed(1)} / 5 ⭐` : "No rating yet";

		if (document.body.classList.contains("poetry-page")) adjustedPath = adjustedPath.replace("poetry/", "");
		else if (document.body.classList.contains("short-stories-page")) adjustedPath = adjustedPath.replace("short-stories/", "../short-stories/");
		else if (document.body.classList.contains("books-page")) adjustedPath = adjustedPath.replace("books/", "../books/");

		const card = document.createElement("div");
		card.className = "col-md-4 mb-4";
		card.innerHTML = `
			<div class="card text-center">
				<div class="card-body">
					<h5 class="card-title">${title}</h5>
					<p class="card-text"><small>Release: ${releaseDate}</small></p>
					<p class="card-text text-muted">Average Rating: ${avgRating}</p>
					<a href="${adjustedPath}" class="btn btn-outline-primary">Read Now</a>
				</div>
			</div>
		`;
		container.appendChild(card);
	});
}




window.onload = () => {

	const sortSelect = document.getElementById("sortOptions"); // ← missing before
	const searchInput = document.getElementById("searchInput");
	const searchButton = document.getElementById("searchButton");
	const filterSelect = document.getElementById("filterOptions");


	const featuredContainer = document.getElementById("featured-titles");
	const isPoetryPage = document.body.classList.contains("poetry-page");
	const isStoriesPage = document.body.classList.contains("short-stories-page");
	const isBooksPage = document.body.classList.contains("books-page");

	// Render initial page
	if (featuredContainer) {
		if (isPoetryPage) {
			renderTitles("featured-titles");
		} else if (isStoriesPage) {
			renderTitles("featured-titles");
		} else if (isBooksPage) {
			renderTitles("featured-titles");
		} else {
			renderTitles("featured-titles", 3);
		}
	}

	// Setup Search

	if (searchInput && searchButton) {
		searchButton.addEventListener("click", () => {
			currentSearch = searchInput.value;
			currentFilter = ""; // ← Clear filter
			renderTitles("featured-titles");
		});
		searchInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				currentSearch = searchInput.value;
				currentFilter = ""; // ← Clear filter
				renderTitles("featured-titles");
			}
		});
	}

	// Setup Sort
	if (sortSelect) {
		sortSelect.addEventListener("change", () => {
			currentSort = sortSelect.value;
			renderTitles("featured-titles");
		});
	}

	// Setup Filter
	if (filterSelect) {
		filterSelect.addEventListener("change", () => {
			currentFilter = filterSelect.value;
			currentSearch = ""; // ← Clear search
			renderTitles("featured-titles");
		});
	}
};


