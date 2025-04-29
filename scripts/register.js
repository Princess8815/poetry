const registerForm = document.getElementById("registerForm");
const messageDiv = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://backend-bzip.onrender.com/api/register", { // 🔥 updated backend URL
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include", // 🛡️ Important for session cookies across different domains
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (data.success) {
            // ✅ Registered and auto-logged in, now immediately redirect
            window.location.href = "../pages/account.html"; // ⬅️ Change if you want another page
        } else {
            messageDiv.innerHTML = `<span style="color: red;">${data.error || "Registration failed"}</span>`;
        }
    } catch (err) {
        console.error(err);
        messageDiv.innerHTML = `<span style="color: red;">Something went wrong. Try again later.</span>`;
    }
});



