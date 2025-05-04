

document.addEventListener("DOMContentLoaded", async () => {
    const accountDiv = document.getElementById("accountInfo");

    

    try {
        const response = await fetch("https://backend-bzip.onrender.com/api/check-session", { // ✅ Correct URL
            method: "POST",
            credentials: "include",
        });

        const data = await response.json();

        if (data.loggedIn) {

            const roles = data.user.role

            let viewRoles = ""
            switch (roles)
            {
                case "owner":
                    viewRoles = "Owner";
                    break;
                case "user":
                    viewRoles = "Free Tier";
                    break;
                case "admin":
                    viewRoles = "Admin";
                    break;
                case "paid":
                    viewRoles = "Paid Tier";
                    break;
                default:
                    viewRoles = "Free Tier*";
                    break;
            }


            accountDiv.innerHTML = `
                <p><strong>Username:</strong> ${data.user.username}</p>
                <p><strong>Email:</strong> ${data.user.email}</p>
                <p><strong>Subscription:</strong> ${viewRoles}</p>

                <button class="btn btn-success my-2">Upgrade Plan (Coming Soon)</button><br>
                <button onclick="logout()" class="btn btn-danger mt-2">Log Out</button>
            `;
        } else {
            window.location.href = "../pages/login.html"; // 🔥 Redirect if not logged in
        }
    } catch (err) {
        console.error("Failed to load account info:", err);
        window.location.href = "../pages/login.html"; // 🔥 Redirect on error too
    }
});

async function logout() {
    try {
        await fetch("https://backend-bzip.onrender.com/api/logout", { // ✅ Correct URL
            method: "POST",
            credentials: "include",
        });
        window.location.href = "../pages/login.html"; // 🔥 After logout, go back to login page
    } catch (err) {
        console.error("Logout failed", err);
    }
}

  