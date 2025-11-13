const titleLinks = {
	// Short Stories (original 6)
	"The Midnight Petal": "short-stories/the-midnight-petal.html",
	"Echoes in Stardust": "short-stories/echoes-in-stardust.html",
	"Threadbare Hearts": "short-stories/threadbare-hearts.html",
	"Letters Never Sent": "short-stories/letters-never-sent.html",
	"Of Fire and Ink": "short-stories/of-fire-and-ink.html",
	"Whispers Beneath the Rain": "short-stories/whispers-beneath-the-rain.html",

	// Poetry (your 28)
        "A Daughter’s Truth": "poetry/poem.html?slug=a-daughters-truth",
        "From Shadows to Light: A Journey of Truth": "poetry/poem.html?slug=from-shadows-to-light",
        "Language We Trust": "poetry/poem.html?slug=language-we-trust",
        "Rainbow's True Pride": "poetry/poem.html?slug=rainbows-true-pride",
        "Rise Above": "poetry/poem.html?slug=rise-above",
        "The Friend Who Saved Her Life": "poetry/poem.html?slug=the-friend-who-saved-her-life",
        "The Girl Inside": "poetry/poem.html?slug=the-girl-inside",
        "The Road We Walk": "poetry/poem.html?slug=the-road-we-walk",
        "The Silent Battle": "poetry/poem.html?slug=the-silent-battle",
        "Trans Poem": "poetry/poem.html?slug=trans-poem",
        "Morning poem": "poetry/poem.html?slug=morning-poem",
        "Unbreakable": "poetry/poem.html?slug=unbreakable",
        "Red round thing": "poetry/poem.html?slug=red-round-thing",
        "Marina the axolotl": "poetry/poem.html?slug=marina-the-axolotl",
        "Echoes of a Hidden Girl": "poetry/poem.html?slug=echoes-of-a-hidden-girl",
        "Reflections Reborn": "poetry/poem.html?slug=reflections-reborn",
        "A Journey Through Grief": "poetry/poem.html?slug=a-journey-through-grief",
        "Holiday of cheer": "poetry/poem.html?slug=holiday-of-cheer",
        "Animal parade": "poetry/poem.html?slug=animal-parade",
        "I Am Trans and Proud": "poetry/poem.html?slug=i-am-trans-and-proud",
        "5 piggies revised": "poetry/poem.html?slug=5-piggies-revised",
        "5 piggies adult": "poetry/poem.html?slug=5-piggies-adult",
        "When i am in need": "poetry/poem.html?slug=when-i-am-in-need",
        "Dream": "poetry/poem.html?slug=dream",
        "Shadow": "poetry/poem.html?slug=shadow",
        "I will not": "poetry/poem.html?slug=i-will-not",
        "Will you miss me when im gone": "poetry/poem.html?slug=will-you-miss-me-when-im-gone"
};

const checklistContainer = document.getElementById("checklist");

Object.entries(titleLinks).forEach(([title, path]) => {
	fetch(`../${path}`, { method: "HEAD" })
		.then(response => {
			if (!response.ok) {
				const li = document.createElement("li");
				li.textContent = `${title} → ${path}`;
				checklistContainer.appendChild(li);
			}
		})
		.catch(() => {
			const li = document.createElement("li");
			li.textContent = `${title} → ${path}`;
			checklistContainer.appendChild(li);
		});
});
