document.addEventListener("DOMContentLoaded", async () => {
    const authContainer = document.getElementById("auth-buttons");
  
    try {
      const response = await fetch("https://your-backend.onrender.com/api/check-session", {
        method: "POST",
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (data.loggedIn) {
        // ✅ User is logged in
        authContainer.innerHTML = `
          <a class="nav-link" href="./pages/account.html">Account (${data.user.username})</a>
        `;
      } else {
        // ❌ Not logged in
        authContainer.innerHTML = `
          <a class="nav-link" href="./pages/login.html">Login</a> /
          <a class="nav-link" href="./pages/register.html">Register</a>
        `;
      }
    } catch (err) {
      console.error("Session check failed:", err);
      authContainer.innerHTML = `
        <a class="nav-link" href="./pages/login.html">Login</a> /
        <a class="nav-link" href="./pages/register.html">Register</a>
      `;
    }
  });
  