// Utility to show and hide sections
function goToSection(sectionId) {
  // Hide all sections
  document.querySelectorAll("section").forEach((sec) => {
    sec.classList.add("hidden");
  });

  // Show the requested section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove("hidden");

    // Update summary if going to payment section
    if (sectionId === "section-payment") {
      updatePaymentSummary();
    }
  }
}

// Show full form (Back button from Payment to Info)
// function showFullForm() {
//   goToSection("section-info");
// }
function showFullForm() {
  // First hide all sections
  document.querySelectorAll("section").forEach((sec) => {
    sec.classList.add("hidden");
  });

  // Show both the membership and info sections
  document.getElementById("membership-info").classList.remove("hidden");
  document.getElementById("section-info").classList.remove("hidden");
}


// Fill in summary details
function updatePaymentSummary() {
  const selectedOption = document.querySelector(
    ".checkbox-input:checked"
  );

  if (!selectedOption) return;

  const value = selectedOption.value;
  const labelText = selectedOption.parentElement.innerText.trim();
  const parentCard = selectedOption.closest(".card");
  const programType = parentCard.querySelector("h3").innerText.trim();

  // Basic logic to extract day/class info from the label
  let days = "-";
  if (value.includes("class")) {
    days = "Dance + Class";
  } else {
    days = "Dance Only";
  }

  // Update the summary values
  document.getElementById("summary-program").textContent = programType;
  document.getElementById("summary-days").textContent = days;

  const priceMatch = labelText.match(/\$[\d.]+/);
  if (priceMatch) {
    document.getElementById("summary-price").textContent = priceMatch[0];
  } else {
    document.getElementById("summary-price").textContent = "-";
  }
}

// Optional: Add simple validation before proceeding
document.getElementById("checkout-button").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent form submission or default behavior

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");
  const selectedMembership = document.querySelector(".checkbox-input:checked");

  if (!firstName.value.trim()) {
    alert("Please enter your first name.");
    firstName.focus();
    return;
  }

  if (!lastName.value.trim()) {
    alert("Please enter your last name.");
    lastName.focus();
    return;
  }

  if (!phone.value.trim()) {
    alert("Please enter your phone number.");
    phone.focus();
    return;
  }

  if (!email.value.trim()) {
    alert("Please enter your email.");
    email.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    alert("Please enter a valid email address.");
    email.focus();
    return;
  }

  if (!selectedMembership) {
    alert("Please select a membership option.");
    return;
  }

  // All validations passed, go to payment section
  goToSection("section-payment");
});



document.getElementById("payment-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Stop form from submitting by default

  const fields = [
    { id: "billing-first-name", name: "Billing First Name" },
    { id: "billing-last-name", name: "Billing Last Name" },
    { id: "billing-address", name: "Billing Address" },
    { id: "billing-city", name: "Billing City" },
    { id: "billing-state", name: "Billing State" },
    { id: "billing-postal", name: "Postal Code" },
    { id: "full-name", name: "Name on Card" },
    { id: "card-number", name: "Card Number" },
    { id: "expiry-date", name: "Expiry Date" },
    { id: "cvc", name: "CVC" },
  ];

  for (const field of fields) {
    const input = document.getElementById(field.id);
    if (!input.value.trim()) {
      alert(`Please fill out the ${field.name}.`);
      input.focus();
      return;
    }
  }

  // All fields are valid — proceed with payment (e.g. send to backend or show confirmation)
  alert("Payment submitted successfully!");
});