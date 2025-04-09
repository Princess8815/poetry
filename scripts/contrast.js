// scripts/contrast.js

// Create the contrast toggle button
const contrastButton = document.createElement("button");
contrastButton.innerText = "🌓 Contrast";
contrastButton.className = "contrast-button btn btn-dark btn-sm";

// Try to add it to the contrast container if it exists
const contrastContainer = document.querySelector(".contrast-container");
if (contrastContainer) {
	contrastContainer.appendChild(contrastButton);
}

// Define contrast logic (always runs regardless of container presence)
const applyHighContrast = () => {
	document.body.classList.add("high-contrast");
	localStorage.setItem("contrastMode", "high");
};

const removeHighContrast = () => {
	document.body.classList.remove("high-contrast");
	localStorage.setItem("contrastMode", "normal");
};

contrastButton.addEventListener("click", () => {
	if (document.body.classList.contains("high-contrast")) {
		removeHighContrast();
	} else {
		applyHighContrast();
	}
});

// Load saved mode on page load
if (localStorage.getItem("contrastMode") === "high") {
	applyHighContrast();
}

