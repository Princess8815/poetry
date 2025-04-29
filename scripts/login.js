const loginForm = document.getElementById("loginForm");
const messageDiv = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const email = document.getElementById("email").value.trim();
	const password = document.getElementById("password").value;

	try {
		const response = await fetch("https://your-backend.onrender.com/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include", // 🧠 allow session cookie
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (data.success) {
			window.location.href = "../pages/account.html"; // 🎯 wherever you want after login
		} else {
			messageDiv.innerHTML = `<span style="color: red;">${data.error || "Login failed"}</span>`;
		}
	} catch (err) {
		console.error(err);
		messageDiv.innerHTML = `<span style="color: red;">Something went wrong. Try again later.</span>`;
	}
});
