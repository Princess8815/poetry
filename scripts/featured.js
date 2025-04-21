const titleLinks = {
	// Short Stories (original 6)
	"Echoes in Stardust (coming may)": "short-stories/echoes-in-stardust/echoes-in-stardust.html",
	//"The Midnight Petal": "short-stories/the-midnight-petal.html",
	//"Threadbare Hearts": "short-stories/threadbare-hearts.html",
	//"Letters Never Sent": "short-stories/letters-never-sent.html",
	//"Of Fire and Ink": "short-stories/of-fire-and-ink.html",
	//"Whispers Beneath the Rain": "short-stories/whispers-beneath-the-rain.html",

	// Poetry (your 28)
	"Easter Poem 2025": "poetry/easter-poem-2025.html",
	"A Daughter’s Truth": "poetry/a-daughters-truth.html",
	"From Shadows to Light: A Journey of Truth": "poetry/from-shadows-to-light.html",
	"Language We Trust": "poetry/language-we-trust.html",
	"Rainbow's True Pride": "poetry/rainbows-true-pride.html",
	"Rise Above": "poetry/rise-above.html",
	"The Friend Who Saved Her Life": "poetry/the-friend-who-saved-her-life.html",
	"The Girl Inside": "poetry/the-girl-inside.html",
	"The Road We Walk": "poetry/the-road-we-walk.html",
	"The Silent Battle": "poetry/the-silent-battle.html",
	"Trans Poem": "poetry/trans-poem.html",
	"Morning poem": "poetry/morning-poem.html",
	"Unbreakable": "poetry/unbreakable.html",
	"Red round thing": "poetry/red-round-thing.html",
	"Marina the axolotl": "poetry/marina-the-axolotl.html",
	"Echoes of a Hidden Girl": "poetry/echoes-of-a-hidden-girl.html",
	"Reflections Reborn": "poetry/reflections-reborn.html",
	"A Journey Through Grief": "poetry/a-journey-through-grief.html",
	"Holiday of cheer": "poetry/holiday-of-cheer.html",
	"Animal parade": "poetry/animal-parade.html",
	"I Am Trans and Proud": "poetry/i-am-trans-and-proud.html",
	"5 piggies revised": "poetry/5-piggies-revised.html",
	"5 piggies adult": "poetry/5-piggies-adult.html",
	"When i am in need": "poetry/when-i-am-in-need.html",
	"Dream": "poetry/dream.html",
	"Shadow": "poetry/shadow.html",
	"I will not": "poetry/i-will-not.html",
	"Will you miss me when im gone": "poetry/will-you-miss-me-when-im-gone.html",

	//funnies
	"advertisements": "funnies/advertisements-landing.html",

	"Slimblaze": "advertisements/slimblaze.html"
};

function getRandomTitles(arr, n) {
	const shuffled = [...arr].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
}

function renderTitles(containerId, filterFn = () => true, count = null) {
	const container = document.getElementById(containerId);
	if (!container) return;

	let entries = Object.entries(titleLinks).filter(([_, path]) => filterFn(path));
	if (count && count > 0) {
		entries = getRandomTitles(entries, count);
	}

	entries.forEach(([title, path]) => {
		let adjustedPath = path;
		if (document.body.classList.contains("poetry-page") && path.startsWith("poetry/")) {
			adjustedPath = path.replace("poetry/", "");
		} else if (document.body.classList.contains("short-stories-page") && path.startsWith("short-stories/")) {
			adjustedPath = path.replace("short-stories/", "../short-stories/");
		} else if (document.body.classList.contains("books-page") && path.startsWith("books/")) {
			adjustedPath = path.replace("books/", "../books/");
		} else if (document.body.classList.contains("ad-page") && path.startsWith("advertisements/")) {
			adjustedPath = "./advertisements/" + path.split("/").pop();
		} else if (document.body.classList.contains("funnies-page") && path.startsWith("funnies/")) {
			adjustedPath = path.replace("funnies/", "../funnies/");
		}
		

		const card = document.createElement("div");
		card.className = "col-md-4 mb-4";
		card.innerHTML = `
			<div class="card text-center">
				<div class="card-body">
					<h5 class="card-title">${title}</h5>
					<a href="${adjustedPath}" class="btn btn-outline-primary">Read Now</a>
				</div>
			</div>
		`;
		container.appendChild(card);
	});
}

window.onload = () => {
	const featuredContainer = document.getElementById("featured-titles");
	const isPoetryPage = document.body.classList.contains("poetry-page");
	const isStoriesPage = document.body.classList.contains("short-stories-page");
	const isBooksPage = document.body.classList.contains("books-page");
	const isFunniesPage = document.body.classList.contains("funnies-page");

	const isAdPage = document.body.classList.contains("ad-page");

	if (featuredContainer && !isPoetryPage && !isStoriesPage && !isBooksPage && !isFunniesPage && !isAdPage) {
		renderTitles("featured-titles", () => true, 3);
	}

	if (featuredContainer && isPoetryPage) {
		renderTitles("featured-titles", path => path.includes("poetry/"));
	}

	if (featuredContainer && isStoriesPage) {
		renderTitles("featured-titles", path => path.includes("short-stories/"));
	}

	if (featuredContainer && isBooksPage) {
		renderTitles("featured-titles", path => path.includes("books/"));
	}

	if (featuredContainer && isFunniesPage) {
		renderTitles("featured-titles", path => /^funnies\/[^/]+\.html$/.test(path));
	}

	if (featuredContainer && isAdPage) {
		renderTitles("featured-titles", path => /^advertisements\/[^/]+\.html$/.test(path));
	}
};
