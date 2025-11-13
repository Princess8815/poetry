// Poetry titles are loaded dynamically from data/poems.json.
// Only non-poetry entries are defined here.
const staticTitleLinks = {
        "Echoes in Stardust (new)": {
                path: "short-stories/echoes-in-stardust/echoes-in-stardust.html",
                releaseDate: "2025-05-24"
        },
        "Funny Advertisements": {
                path: "funnies/advertisements-landing.html",
                releaseDate: "2025-05-24",
                tag: "adult"
        },
        "slimblaze": {
                path: "advertisements/slimblaze.html",
                releaseDate: "2025-05-24",
                tag: "adult"
        },
};

const titleLinks = { ...staticTitleLinks };

let poemsLoaded = false;
let poemsLoadPromise = null;

function resolvePoemDataPath() {
        const segments = window.location.pathname.split("/").filter(Boolean);
        const depth = segments.length > 0 ? segments.length - 1 : 0;
        return `${"../".repeat(depth)}data/poems.json`;
}

async function ensurePoemsLoaded() {
        if (poemsLoaded) return;
        if (!poemsLoadPromise) {
                const dataPath = resolvePoemDataPath();
                poemsLoadPromise = fetch(dataPath)
                        .then(response => {
                                if (!response.ok) {
                                        throw new Error("Failed to load poems data");
                                }
                                return response.json();
                        })
                        .then(data => {
                                if (!data || !Array.isArray(data.poems)) {
                                        console.warn("Poems data is empty or malformed.");
                                        return;
                                }
                                const sortedPoems = [...data.poems].sort((a, b) => {
                                        const aDate = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
                                        const bDate = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
                                        return bDate - aDate;
                                });
                                sortedPoems.forEach(poem => {
                                        titleLinks[poem.title] = {
                                                path: `poetry/poem.html?slug=${encodeURIComponent(poem.slug)}`,
                                                releaseDate: poem.releaseDate,
                                                tags: poem.tags,
                                        };
                                });
                        })
                        .catch(err => {
                                console.error("Failed to load poems from JSON:", err);
                        })
                        .finally(() => {
                                poemsLoaded = true;
                        });
        }
        return poemsLoadPromise;
}

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

async function renderTitles(containerId, limitOrFilter = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        await ensurePoemsLoaded();

        let limit = null;
        let customFilter = null;

        if (typeof limitOrFilter === "number") {
                limit = limitOrFilter;
        } else if (typeof limitOrFilter === "function") {
                customFilter = limitOrFilter;
        } else if (limitOrFilter && typeof limitOrFilter === "object") {
                ({ limit = null, filter: customFilter = null } = limitOrFilter);
        }

        let entries = Object.entries(titleLinks);

        if (document.body.classList.contains("poetry-page")) {
                entries = entries.filter(([_, data]) => data.path && data.path.startsWith("poetry/"));
        } else if (document.body.classList.contains("short-stories-page")) {
                entries = entries.filter(([_, data]) => data.path && data.path.startsWith("short-stories/"));
        } else if (document.body.classList.contains("books-page")) {
                entries = entries.filter(([_, data]) => data.path && data.path.startsWith("books/"));
        } else if (document.body.classList.contains("funnies-page")) {
                entries = entries.filter(([_, data]) => data.path && data.path.startsWith("funnies/"));
        } else if (document.body.classList.contains("ad-page")) {
                entries = entries.filter(([_, data]) => data.path && data.path.startsWith("advertisements/"));
        }

        if (customFilter) {
                entries = entries.filter(([_, data]) => customFilter(data.path, data));
        }

        if (currentFilter) {
                entries = entries.filter(([_, data]) => {
                        if (typeof data.tag === "string") return data.tag === currentFilter;
                        if (Array.isArray(data.tags)) return data.tags.includes(currentFilter);
                        return false;
                });
        }

        if (currentSearch.trim()) {
                const searchLower = currentSearch.trim().toLowerCase();
                entries = entries.filter(([title]) => title.toLowerCase().includes(searchLower));
        }

        const ratings = await Promise.all(entries.map(([title]) => fetchAverageRating(title)));
        entries = entries.map(([title, data], index) => {
                data.avgRating = ratings[index];
                return [title, data];
        });

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

        if (limit && limit > 0) {
                entries = getRandomTitles(entries, limit);
        }

        container.innerHTML = "";
        entries.forEach(([title, data]) => {
                let adjustedPath = data.path;
                const releaseDate = data.releaseDate || "Unknown";
                const avgRating = data.avgRating != null ? `${data.avgRating.toFixed(1)} / 5 ⭐` : "No rating yet";

                if (document.body.classList.contains("poetry-page")) adjustedPath = adjustedPath.replace("poetry/", "");
                else if (document.body.classList.contains("short-stories-page")) adjustedPath = adjustedPath.replace("short-stories/", "../short-stories/");
                else if (document.body.classList.contains("books-page")) adjustedPath = adjustedPath.replace("books/", "../books/");
                else if (document.body.classList.contains("funnies-page")) adjustedPath = adjustedPath.replace("funnies/", "../funnies/");
                else if (document.body.classList.contains("ad-page")) adjustedPath = adjustedPath.replace("advertisements/", "./advertisements/");

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
        const sortSelect = document.getElementById("sortOptions");
        const searchInput = document.getElementById("searchInput");
        const searchButton = document.getElementById("searchButton");
        const filterSelect = document.getElementById("filterOptions");

        const featuredContainer = document.getElementById("featured-titles");
        const isPoetryPage = document.body.classList.contains("poetry-page");
        const isStoriesPage = document.body.classList.contains("short-stories-page");
        const isBooksPage = document.body.classList.contains("books-page");
        const isFunniesPage = document.body.classList.contains("funnies-page");
        const isAdPage = document.body.classList.contains("ad-page");

        if (featuredContainer && isFunniesPage) {
                renderTitles("featured-titles", (path) => /^advertisements\/[^/]+\.html$/.test(path));
                return;
        }

        if (featuredContainer && isAdPage) {
                renderTitles("featured-titles", (path) => /^advertisements\/[^/]+\.html$/.test(path));
                return;
        }

        if (featuredContainer) {
                if (isPoetryPage || isStoriesPage || isBooksPage) {
                        renderTitles("featured-titles");
                } else {
                        renderTitles("featured-titles", 3);
                }
        }

        if (searchInput && searchButton) {
                searchButton.addEventListener("click", () => {
                        currentSearch = searchInput.value;
                        currentFilter = "";
                        renderTitles("featured-titles");
                });
                searchInput.addEventListener("keypress", (e) => {
                        if (e.key === "Enter") {
                                currentSearch = searchInput.value;
                                currentFilter = "";
                                renderTitles("featured-titles");
                        }
                });
        }

        if (sortSelect) {
                sortSelect.addEventListener("change", () => {
                        currentSort = sortSelect.value;
                        renderTitles("featured-titles");
                });
        }

        if (filterSelect) {
                filterSelect.addEventListener("change", () => {
                        currentFilter = filterSelect.value;
                        currentSearch = "";
                        renderTitles("featured-titles");
                });
        }
};
