const loginForm = document.getElementById("loginForm");
const messageDiv = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://backend-bzip.onrender.com/api/login", { // 🔥 updated backend URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // 🧠 Allow session cookie to be sent
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = "../pages/account.html"; // 🎯 Redirect after successful login
        } else {
            messageDiv.innerHTML = `<span style="color: red;">${data.error || "Login failed"}</span>`;
        }
    } catch (err) {
        console.error(err);
        messageDiv.innerHTML = `<span style="color: red;">Something went wrong. Try again later.</span>`;
    }
});

