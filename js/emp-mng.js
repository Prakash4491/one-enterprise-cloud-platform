// ===========================
// ADMIN ACCESS CHECK
// ===========================

if (localStorage.getItem("loggedInRole") !== "admin") {
  alert("Admin access required.");

  window.location.href = "login.html";
}

// ===========================
// LOAD EMPLOYEES
// ===========================

let employees = JSON.parse(localStorage.getItem("employees")) || [];

// ===========================
// HTML ELEMENTS
// ===========================

const employeeTableBody = document.getElementById("employeeTableBody");

const totalEmployees = document.getElementById("totalEmployees");

// ===========================
// DISPLAY EMPLOYEES
// ===========================

function displayEmployees() {
  employeeTableBody.innerHTML = "";

  if (employees.length === 0) {
    employeeTableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;"
                >

                    No Employees Registered

                </td>

            </tr>

        `;

    totalEmployees.innerText = "Total Employees : 0";

    return;
  }

  employees.forEach(function (employee, index) {
    employeeTableBody.innerHTML += `

                <tr>

                    <td>
                        ${employee.id}
                    </td>

                    <td>
                        ${employee.name}
                    </td>

                    <td>
                        ${employee.department}
                    </td>

                    <td>
                        ${employee.designation}
                    </td>

                    <td>
                        ${employee.email}
                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editEmployee(${index})"
                        >
                            Edit
                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteEmployee(${index})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;
  });

  totalEmployees.innerText = "Total Employees : " + employees.length;
}

// ===========================
// EDIT EMPLOYEE
// ===========================

function editEmployee(index) {
  const employee = employees[index];

  const newName = prompt("Employee Name:", employee.name);

  if (newName === null) {
    return;
  }

  const newDepartment = prompt("Department:", employee.department);

  if (newDepartment === null) {
    return;
  }

  const newDesignation = prompt("Designation:", employee.designation);

  if (newDesignation === null) {
    return;
  }

  const newEmail = prompt("Email:", employee.email);

  if (newEmail === null) {
    return;
  }

  // ===========================
  // UPDATE
  // ===========================

  employee.name = newName.trim();

  employee.department = newDepartment.trim();

  employee.designation = newDesignation.trim();

  employee.email = newEmail.trim();

  // ===========================
  // SAVE
  // ===========================

  localStorage.setItem("employees", JSON.stringify(employees));

  displayEmployees();

  alert("Employee Updated Successfully.");
}

// ===========================
// DELETE EMPLOYEE
// ===========================

function deleteEmployee(index) {
  const employee = employees[index];

  const confirmDelete = confirm(
    "Are you sure you want to delete " + employee.name + "?",
  );

  if (!confirmDelete) {
    return;
  }

  employees.splice(index, 1);

  localStorage.setItem("employees", JSON.stringify(employees));

  displayEmployees();

  alert("Employee Deleted Successfully.");
}

// ===========================
// INITIAL LOAD
// ===========================

displayEmployees();
