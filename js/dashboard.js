const role = localStorage.getItem("loggedInRole");
const username = localStorage.getItem("username");

// Only the admin can access the admin dashboard.
if (role !== "admin") {
  window.location.href = "login.html";
} else {
  document.getElementById("username").textContent = username || "Administrator";
}

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("loggedInRole");
  localStorage.removeItem("username");
  localStorage.removeItem("loggedInEmployee");

  window.location.href = "login.html";
});
