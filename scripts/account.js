document.addEventListener("DOMContentLoaded", async () => {
    const accountDiv = document.getElementById("accountInfo");
  
    try {
      const response = await fetch("https://your-backend.onrender.com/api/check-session", {
        method: "POST",
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (data.loggedIn) {
        accountDiv.innerHTML = `
          <p><strong>Username:</strong> ${data.user.username}</p>
          <p><strong>Email:</strong> ${data.user.email}</p>
          <p><strong>Subscription:</strong> Free Tier</p>
  
          <button class="btn btn-success my-2">Upgrade Plan (Coming Soon)</button><br>
          <button onclick="logout()" class="btn btn-danger">Log Out</button>
        `;
      } else {
        window.location.href = "../pages/login.html";
      }
    } catch (err) {
      console.error("Failed to load account info:", err);
      window.location.href = "../pages/login.html";
    }
  });
  
  async function logout() {
    try {
      await fetch("https://your-backend.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "../pages/login.html";
    } catch (err) {
      console.error("Logout failed", err);
    }
  }
  