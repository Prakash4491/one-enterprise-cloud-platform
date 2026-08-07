
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();

  const password = document.getElementById("password").value.trim();

  const message = document.getElementById("message");

  message.innerHTML = "";

  if (
    (username.toLowerCase() === "admin" ||
      username.toLowerCase() === "admin@gmail.com") &&
    password === "admin123"
  ) {

    localStorage.setItem("loggedInRole", "admin");
    localStorage.setItem("username", "Administrator");
    localStorage.removeItem("loggedInEmployee");
    window.location.href = "dashboard.html";
    return;
  }
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const employee = employees.find(function (emp) {
    const employeeId = String(emp.id).toLowerCase();

    const employeeEmail = String(emp.email).toLowerCase();

    const enteredUsername = username.toLowerCase();

    return (
      (employeeId === enteredUsername || employeeEmail === enteredUsername) &&
      emp.password === password
    );
  });
  if (!employee) {
    message.innerHTML = "❌ Invalid Employee ID/Email or Password";

    message.style.color = "red";

    return;
  }

  localStorage.setItem("loggedInEmployee", JSON.stringify(employee));

  localStorage.setItem("username", employee.name);

  if (String(employee.department).toLowerCase() === "hr") {

    localStorage.setItem("loggedInRole", "hr");

    window.location.href = "hr-dashboard.html";

    return;
  }
  localStorage.setItem("loggedInRole", "employee");
  window.location.href = "employee-profile.html";
});
