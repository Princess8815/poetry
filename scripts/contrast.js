// scripts/contrast.js

const contrastButton = document.createElement("button");
contrastButton.innerText = "🌓 Contrast";
contrastButton.className = "contrast-button btn btn-dark btn-sm mt-2";

const brand = document.querySelector(".navbar .navbar-brand");
if (brand && brand.parentElement) {
	brand.insertAdjacentElement("afterend", contrastButton);
}

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

if (localStorage.getItem("contrastMode") === "high") {
	applyHighContrast();
}
