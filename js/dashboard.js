const username = localStorage.getItem("username");

if (!username) {
  window.location.href = "login.html";
}

document.getElementById("username").textContent = username;

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("username");

  window.location.href = "login.html";
});
