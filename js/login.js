const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();

  const password = document.getElementById("password").value.trim();

  const message = document.getElementById("message");

  if (username === "admin" || username === "admin@gmail.com" && password === "admin123") {
    localStorage.setItem("username", "Admin");

    window.location.href = "dashboard.html";
  } else {
    message.innerHTML = "❌ Invalid Credentials";

    message.style.color = "red";
  }
});
