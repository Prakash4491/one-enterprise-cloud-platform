if (localStorage.getItem("loggedInRole") !== "admin") {
  alert("Admin access required.");

  window.location.href = "login.html";
}

let employees = JSON.parse(localStorage.getItem("employees")) || [];

const employeeContainer = document.getElementById("employeeContainer");

const searchInput = document.getElementById("searchInput");

const departmentFilter = document.getElementById("departmentFilter");

const statusFilter = document.getElementById("statusFilter");

const designationFilter = document.getElementById("designationFilter");

const sortOption = document.getElementById("sortOption");

const resetBtn = document.getElementById("resetBtn");

function displayEmployees(employeeList) {
  employeeContainer.innerHTML = "";

  if (employeeList.length === 0) {
    employeeContainer.innerHTML = `

            <h2 class="no-data">

                No Employees Found

            </h2>

        `;

    return;
  }

  employeeList.forEach(function (employee) {
    const image = employee.image || "assets/images/employee.png";

    const status = employee.status || "Active";

    employeeContainer.innerHTML += `

                <div class="employee-card">

                    <img
                        src="${image}"
                        alt="${employee.name}"
                    >


                    <h3>
                        ${employee.name}
                    </h3>


                    <p>
                        <strong>ID :</strong>
                        ${employee.id}
                    </p>


                    <p>
                        <strong>Department :</strong>
                        ${employee.department}
                    </p>


                    <p>
                        <strong>Designation :</strong>
                        ${employee.designation}
                    </p>


                    <p>
                        <strong>Email :</strong>
                        ${employee.email}
                    </p>


                    <span
                        class="status ${status.toLowerCase()}"
                    >

                        ${status}

                    </span>

                </div>

            `;
  });
}

function filterEmployees() {
  let filteredEmployees = [...employees];

  const searchValue = searchInput.value.trim().toLowerCase();

  const departmentValue = departmentFilter.value;

  const designationValue = designationFilter.value;

  const statusValue = statusFilter.value;

  const sortValue = sortOption.value;

  filteredEmployees = filteredEmployees.filter(function (employee) {
    const employeeName = (employee.name || "").toLowerCase();

    const employeeId = (employee.id || "").toLowerCase();

    const matchesSearch =
      employeeName.includes(searchValue) || employeeId.includes(searchValue);

    const matchesDepartment =
      departmentValue === "All" || employee.department === departmentValue;

    const matchesDesignation =
      designationValue === "All" || employee.designation === designationValue;

    const matchesStatus =
      statusValue === "All" || (employee.status || "Active") === statusValue;

    return (
      matchesSearch && matchesDepartment && matchesDesignation && matchesStatus
    );
  });

  switch (sortValue) {
    case "nameAsc":
      filteredEmployees.sort(function (a, b) {
        return (a.name || "").localeCompare(b.name || "");
      });

      break;

    case "nameDesc":
      filteredEmployees.sort(function (a, b) {
        return (b.name || "").localeCompare(a.name || "");
      });

      break;

    case "idAsc":
      filteredEmployees.sort(function (a, b) {
        return (a.id || "").localeCompare(b.id || "");
      });

      break;

    case "idDesc":
      filteredEmployees.sort(function (a, b) {
        return (b.id || "").localeCompare(a.id || "");
      });

      break;
  }

  displayEmployees(filteredEmployees);
}

searchInput.addEventListener("keyup", filterEmployees);

departmentFilter.addEventListener("change", filterEmployees);

statusFilter.addEventListener("change", filterEmployees);

designationFilter.addEventListener("change", filterEmployees);

sortOption.addEventListener("change", filterEmployees);

resetBtn.addEventListener("click", function () {
  searchInput.value = "";

  departmentFilter.value = "All";

  designationFilter.value = "All";

  statusFilter.value = "All";

  sortOption.value = "";

  displayEmployees(employees);
});

displayEmployees(employees);
