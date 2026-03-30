<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  console.log("in contact-form.php");
  $name    = htmlspecialchars($_POST["name"]);
  $email   = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
  $message = htmlspecialchars($_POST["message"]);

  $to = "a.searle@expitrans.com"; // <-- replace this with your actual email
  $subject = "New Message from Contact Form";
  $headers = "From: $email\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

  $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

  if (mail($to, $subject, $body, $headers)) {
    echo "Message sent successfully!";
  } else {
    echo "Failed to send message.";
  }
}
?>