// EmailJS account under a.searle@expitrans.com

// Initialize EmailJS
(function () {
  emailjs.init("gGvKhIGKwsbODR3js"); // Replace with your actual public key
})();

document.getElementById("contactForm").addEventListener("submit", function (e) {
  console.log("submitting contact form");
  e.preventDefault();

  const form = e.target;
  const statusEl = document.getElementById("form-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  // Show loading state
  statusEl.textContent = "Sending message...";
  statusEl.style.color = "#EA580C";
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  // Send email using EmailJS
  emailjs
    .sendForm(
      "service_lj7fjdi", // Replace with your service ID
      "template_xrwn31i", // Replace with your template ID
      form
    )
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
        statusEl.textContent = "Message sent successfully! We'll get back to you soon.";
        statusEl.style.color = "green";
        form.reset();
      },
      function (error) {
        console.log("FAILED...", error);
        statusEl.textContent = "Failed to send message. Please try again or email us directly.";
        statusEl.style.color = "red";
      }
    )
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    });
});