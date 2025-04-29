document.addEventListener("DOMContentLoaded", async () => {
    // 1. Add ID to body if on poem-page
    const body = document.querySelector("body.poem-page");
    if (body) body.id = "1deep";

    // 2. Create <li id="auth-buttons"> dynamically
    const authButtons = document.createElement("div"); // Changed to <div> for body
    authButtons.className = "poem-account";
    authButtons.id = "auth-buttons";
    authButtons.innerHTML = `<!-- Will be filled -->`;

    // 3. Insert into top of body
    document.body.insertBefore(authButtons, document.body.firstChild);

    // 4. Determine file location
    let fileLoc = "";
    if (document.getElementById("root")) {
        fileLoc = "./";
    } else if (document.getElementById("1deep")) {
        fileLoc = "../";
    }

    // 5. Fill content after auth check
    try {
        const response = await fetch("https://backend-bzip.onrender.com/api/check-session", {
            method: "POST",
            credentials: "include",
        });

        const data = await response.json();
        if (data.loggedIn) {
            authButtons.innerHTML = `
                <a class="btn btn-outline-dark btn-sm m-2" href="${fileLoc}pages/account.html">
                    Account (${data.user.username})
                </a>
            `;
        } else {
            authButtons.innerHTML = `
                <div class="d-flex gap-2 m-2">
                    <a class="btn btn-primary btn-sm" href="${fileLoc}pages/login.html">Login</a>
                    <a class="btn btn-primary btn-sm" href="${fileLoc}pages/register.html">Register</a>
                </div>
            `;
        }
    } catch (err) {
        console.error("Session check failed:", err);
        authButtons.innerHTML = `
            <div class="d-flex gap-2 m-2">
                <a class="btn btn-primary btn-sm" href="${fileLoc}pages/login.html">Login</a>
                <a class="btn btn-primary btn-sm" href="${fileLoc}pages/register.html">Register</a>
            </div>
        `;
    }
});




  