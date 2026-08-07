// ===========================
// REGISTRATION FORM
// ===========================

const registrationForm = document.getElementById("registrationForm");

// ===========================
// REGISTER EMPLOYEE
// ===========================

registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // ===========================
  // LOAD EXISTING EMPLOYEES
  // ===========================

  let employees = JSON.parse(localStorage.getItem("employees")) || [];

  // ===========================
  // GET FORM VALUES
  // ===========================

  const employeeId = document.getElementById("employeeId").value.trim();

  const fullName = document.getElementById("fullName").value.trim();

  const email = document.getElementById("email").value.trim();

  const mobile = document.getElementById("mobile").value.trim();

  const department = document.getElementById("department").value;

  const designation = document.getElementById("designation").value.trim();

  const joiningDate = document.getElementById("joiningDate").value;

  const password = document.getElementById("password").value;

  const confirmPassword = document.getElementById("confirmPassword").value;

  // ===========================
  // PASSWORD VALIDATION
  // ===========================

  if (password !== confirmPassword) {
    alert("Passwords do not match.");

    return;
  }

  // ===========================
  // DUPLICATE EMPLOYEE ID
  // ===========================

  const existingEmployee = employees.find(function (employee) {
    return employee.id.toLowerCase() === employeeId.toLowerCase();
  });

  if (existingEmployee) {
    alert("Employee ID already exists.");

    return;
  }

  // ===========================
  // DUPLICATE EMAIL
  // ===========================

  const existingEmail = employees.find(function (employee) {
    return employee.email.toLowerCase() === email.toLowerCase();
  });

  if (existingEmail) {
    alert("Email already registered.");

    return;
  }

  // ===========================
  // CREATE EMPLOYEE OBJECT
  // ===========================

  const employee = {
    id: employeeId,

    name: fullName,

    email: email,

    mobile: mobile,

    department: department,

    designation: designation,

    joiningDate: joiningDate,

    password: password,

    status: "Active",

    attendance: "",

    image: "assets/images/employee.png",
  };

  // ===========================
  // ADD EMPLOYEE
  // ===========================

  employees.push(employee);

  // ===========================
  // SAVE
  // ===========================

  localStorage.setItem("employees", JSON.stringify(employees));

  // ===========================
  // SUCCESS MESSAGE
  // ===========================

  alert("Employee Registered Successfully!");

  // ===========================
  // RESET FORM
  // ===========================

  registrationForm.reset();
});
