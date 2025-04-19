const updateContainer = document.getElementById("latest-update");

fetch("pages/changes.html") // 🔁 RELATIVE path = works everywhere
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const updates = doc.querySelectorAll(".changelog-entry");

    if (updates.length > 0) {
      const latest = updates[0].cloneNode(true);
      updateContainer.appendChild(latest);

      const viewMore = document.createElement("p");
      viewMore.innerHTML = `<a href="https://princess8815.github.io/poetry/pages/changes.html" class="fw-bold">View all updates →</a>`;


      updateContainer.appendChild(viewMore);
    } else {
      updateContainer.innerHTML = "<p>No recent updates found.</p>";
    }
  })
  .catch(error => {
    console.error("Failed to load update:", error);
    updateContainer.innerHTML = "<p>Update info unavailable.</p>";
  });

