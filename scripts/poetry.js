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
