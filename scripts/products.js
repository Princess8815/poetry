// scripts/support-form.js

const products = [
    {
      name: "digital custum poetry",
      price: 20.00,
      description: "Please use the text box to give the content theme length up to 20 lines and any details you want"
    },
    {
      name: "digital short story",
      price: 40.00,
      description: "Please use the text box to give the content theme length up to aproximately 1000 words and any details you want"
    },
    {
      name: "poem of the day 30 day subscription",
      price: 9.99,
      description: "comming soon"
    },
    {
      name: "Donate",
      price: 0,
      description: "Support Kirstin with any amount you choose!"
    }
  ];
  
  const productSelect = document.getElementById("product");
  const donationGroup = document.getElementById("donation-group");
  const donationInput = document.getElementById("donation");
  const priceDisplay = document.getElementById("price-display");
  const descriptionDisplay = document.getElementById("description-display");
  
  function updateProductDetails() {
    const selectedIndex = productSelect.selectedIndex - 1;
    if (selectedIndex < 0) {
      priceDisplay.textContent = "$0.00";
      descriptionDisplay.textContent = "Please select a product.";
      donationGroup.style.display = "none";
      return;
    }
  
    const selectedProduct = products[selectedIndex];
    descriptionDisplay.textContent = selectedProduct.description;
  
    if (selectedProduct.name === "Donate") {
      donationGroup.style.display = "block";
      const amount = parseFloat(donationInput.value) || 0;
      priceDisplay.textContent = `$${amount.toFixed(2)}`;
    } else {
      donationGroup.style.display = "none";
      priceDisplay.textContent = `$${selectedProduct.price.toFixed(2)}`;
    }
  }
  
  function populateProductDropdown() {
    products.forEach(product => {
      const option = document.createElement("option");
      option.value = product.name;
      option.textContent = product.name;
      productSelect.appendChild(option);
    });
  }
  
  productSelect.addEventListener("change", updateProductDetails);
  donationInput.addEventListener("input", updateProductDetails);
  
  document.addEventListener("DOMContentLoaded", () => {
    populateProductDropdown();
    updateProductDetails();
  });
  
  document.getElementById("support-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      product: productSelect.value,
      amount: productSelect.value === "Donate"
        ? parseFloat(donationInput.value).toFixed(2)
        : products.find(p => p.name === productSelect.value)?.price.toFixed(2) || "0.00",
      description: descriptionDisplay.textContent,
      specifications: document.getElementById("specifications").value.trim()
    };
  
    try {
        const response = await fetch("https://backend-bzip.onrender.com/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      const result = await response.json();
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert("An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again later.");
    }
  });
  
  