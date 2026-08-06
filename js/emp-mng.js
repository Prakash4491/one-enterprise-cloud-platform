
let employees = JSON.parse(localStorage.getItem("employees")) || [];

let editIndex = -1;

const employeeForm = document.getElementById("employeeForm");
const employeeTableBody = document.getElementById("employeeTableBody");
const totalEmployees = document.getElementById("totalEmployees");
const submitBtn = document.getElementById("submitBtn");

employeeForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const employee = {
    id: document.getElementById("employeeId").value.trim(),

    name: document.getElementById("employeeName").value.trim(),

    department: document.getElementById("department").value,

    designation: document.getElementById("designation").value.trim(),

    email: document.getElementById("email").value.trim(),

    status: "Active",

    image: "assets/images/employee.png",
  };

  if (editIndex === -1) {
    employees.push(employee);
  } else {
    employees[editIndex] = employee;

    editIndex = -1;

    submitBtn.innerText = "Add Employee";
  }

  localStorage.setItem("employees", JSON.stringify(employees));

  displayEmployees();

  employeeForm.reset();
});

function displayEmployees() {
  employeeTableBody.innerHTML = "";

  employees.forEach(function (employee, index) {
    employeeTableBody.innerHTML += `

        <tr>

            <td>${employee.id}</td>

            <td>${employee.name}</td>

            <td>${employee.department}</td>

            <td>${employee.designation}</td>

            <td>${employee.email}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editEmployee(${index})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteEmployee(${index})">

                    Delete

                </button>

            </td>

        </tr>

        `;
  });

  totalEmployees.innerText = "Total Employees : " + employees.length;
}

function editEmployee(index) {
  const employee = employees[index];

  document.getElementById("employeeId").value = employee.id;

  document.getElementById("employeeName").value = employee.name;

  document.getElementById("department").value = employee.department;

  document.getElementById("designation").value = employee.designation;

  document.getElementById("email").value = employee.email;

  editIndex = index;

  submitBtn.innerText = "Update Employee";
}

function deleteEmployee(index) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this employee?",
  );

  if (confirmDelete) {
    employees.splice(index, 1);

    localStorage.setItem("employees", JSON.stringify(employees));

    displayEmployees();
  }
}

displayEmployees();
