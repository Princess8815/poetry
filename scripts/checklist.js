const titleLinks = {
	// Short Stories (original 6)
	"The Midnight Petal": "short-stories/the-midnight-petal.html",
	"Echoes in Stardust": "short-stories/echoes-in-stardust.html",
	"Threadbare Hearts": "short-stories/threadbare-hearts.html",
	"Letters Never Sent": "short-stories/letters-never-sent.html",
	"Of Fire and Ink": "short-stories/of-fire-and-ink.html",
	"Whispers Beneath the Rain": "short-stories/whispers-beneath-the-rain.html",

	// Poetry (your 28)
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
	"Will you miss me when im gone": "poetry/will-you-miss-me-when-im-gone.html"
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
