const employees = [
  {
    id: "EMP001",
    name: "Prakash",
    department: "Development",
    designation: "Full Stack Developer",
    status: "Active",
    image: "assets/images/Prakash.png",
  },

  {
    id: "EMP002",
    name: "Rahul",
    department: "HR",
    designation: "HR Executive",
    status: "Active",
    image: "assets/images/employee.png",
  },

  {
    id: "EMP003",
    name: "Anjali",
    department: "Finance",
    designation: "Accountant",
    status: "Inactive",
    image: "assets/images/employee.png",
  },

  {
    id: "EMP004",
    name: "Akhil",
    department: "CRM",
    designation: "CRM Executive",
    status: "Active",
    image: "assets/images/employee.png",
  },
];

const employeeContainer = document.getElementById("employeeContainer");

const searchInput = document.getElementById("searchInput");

const departmentFilter = document.getElementById("departmentFilter");

function displayEmployees(employeeList) {
  employeeContainer.innerHTML = "";

  employeeList.forEach((employee) => {
    employeeContainer.innerHTML += `

        <div class="employee-card">

            <img src="${employee.image}"
                 alt="${employee.name}">

            <h3>${employee.name}</h3>

            <p><strong>ID :</strong> ${employee.id}</p>

            <p><strong>Department :</strong> ${employee.department}</p>

            <p><strong>Designation :</strong> ${employee.designation}</p>

            <span class="status ${employee.status.toLowerCase()}">

                ${employee.status}

            </span>

        </div>

        `;
  });
}

displayEmployees(employees);

searchInput.addEventListener("keyup", filterEmployees);

departmentFilter.addEventListener("change", filterEmployees);

function filterEmployees() {
  const searchValue = searchInput.value.toLowerCase();

  const departmentValue = departmentFilter.value;

  const filteredEmployees = employees.filter((employee) => {
    const matchesName = employee.name.toLowerCase().includes(searchValue);

    const matchesDepartment =
      departmentValue === "All" || employee.department === departmentValue;

    return matchesName && matchesDepartment;
  });

  displayEmployees(filteredEmployees);
}
