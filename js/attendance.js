
let employees = JSON.parse(localStorage.getItem("employees")) || [];

employees.forEach((employee) => {
  if (!employee.attendance) {
    employee.attendance = "";
  }

  if (employee.attendanceSaved === undefined) {
    employee.attendanceSaved = false;
  }
});

const attendanceTableBody = document.getElementById("attendanceTableBody");
const searchEmployee = document.getElementById("searchEmployee");
const departmentFilter = document.getElementById("departmentFilter");
const statusFilter = document.getElementById("statusFilter");

const currentDate = document.getElementById("currentDate");

const totalCount = document.getElementById("totalCount");
const presentCount = document.getElementById("presentCount");
const absentCount = document.getElementById("absentCount");
const halfDayCount = document.getElementById("halfDayCount");
const wfhCount = document.getElementById("wfhCount");

currentDate.innerText = "Date : " + new Date().toLocaleDateString();

function displayAttendance(employeeList) {
  attendanceTableBody.innerHTML = "";

  if (employeeList.length === 0) {
    attendanceTableBody.innerHTML = `

        <tr>

            <td colspan="5">

                No Employees Found

            </td>

        </tr>

        `;

    return;
  }

  employeeList.forEach((employee) => {
    attendanceTableBody.innerHTML += `

        <tr>

            <td>${employee.id}</td>

            <td>${employee.name}</td>

            <td>${employee.department}</td>

            <td>

                <select
                    class="attendance-select"
                    id="status-${employee.id}">

                    <option value="Present"
                    ${employee.attendance === "Present" ? "selected" : ""}>
                    Present
                    </option>

                    <option value="Absent"
                    ${employee.attendance === "Absent" ? "selected" : ""}>
                    Absent
                    </option>

                    <option value="Half Day"
                    ${employee.attendance === "Half Day" ? "selected" : ""}>
                    Half Day
                    </option>

                    <option value="WFH"
                    ${employee.attendance === "WFH" ? "selected" : ""}>
                    Work From Home
                    </option>

                </select>

            </td>

            <td>

                <button
                    class="${employee.attendanceSaved ? "update-btn" : "save-btn"}"
                    onclick="saveOrUpdateAttendance('${employee.id}')">

                    ${employee.attendanceSaved ? "Update" : "Save"}

                </button>

                <button
                    class="reset-btn"
                    onclick="resetAttendance('${employee.id}')">

                    Reset

                </button>

            </td>

        </tr>

        `;
  });

  updateSummary();
}

function saveOrUpdateAttendance(id) {
  const employee = employees.find((emp) => emp.id === id);

  employee.attendance = document.getElementById(`status-${id}`).value;

  employee.attendanceSaved = true;

  localStorage.setItem("employees", JSON.stringify(employees));

  displayAttendance(employees);
}

function resetAttendance(id) {
  if (!confirm("Reset attendance?")) {
    return;
  }

  const employee = employees.find((emp) => emp.id === id);

  employee.attendance = "";

  employee.attendanceSaved = false;

  localStorage.setItem("employees", JSON.stringify(employees));

  displayAttendance(employees);
}

function filterAttendance() {
  const searchValue = searchEmployee.value.toLowerCase();

  const departmentValue = departmentFilter.value;

  const statusValue = statusFilter.value;

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchValue) ||
      employee.id.toLowerCase().includes(searchValue);

    const matchesDepartment =
      departmentValue === "All" || employee.department === departmentValue;

    const matchesStatus =
      statusValue === "All" || employee.attendance === statusValue;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  displayAttendance(filteredEmployees);
}

function updateSummary() {
  totalCount.innerText = employees.length;

  presentCount.innerText = employees.filter(
    (emp) => emp.attendance === "Present",
  ).length;
  absentCount.innerText = employees.filter(
    (emp) => emp.attendance === "Absent",
  ).length;
  halfDayCount.innerText = employees.filter(
    (emp) => emp.attendance === "Half Day",
  ).length;
  wfhCount.innerText = employees.filter(
    (emp) => emp.attendance === "WFH",
  ).length;
}

searchEmployee.addEventListener("keyup", filterAttendance);

departmentFilter.addEventListener("change", filterAttendance);

statusFilter.addEventListener("change", filterAttendance);

displayAttendance(employees);
