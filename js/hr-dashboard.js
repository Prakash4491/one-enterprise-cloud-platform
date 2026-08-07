// ======================================================
// HR DASHBOARD
// ======================================================

// ======================================================
// HR ACCESS CHECK
// ======================================================

const loggedInRole = localStorage.getItem("loggedInRole");

if (loggedInRole !== "hr") {
    alert("HR access required.");
    window.location.href = "login.html";
}


// ======================================================
// LOAD DATA
// ======================================================

let employees =
    JSON.parse(localStorage.getItem("employees")) || [];

let leaveRequests =
    JSON.parse(localStorage.getItem("leaveRequests")) || [];

let activityLog =
    JSON.parse(localStorage.getItem("activityLog")) || [];


// ======================================================
// HTML ELEMENTS
// ======================================================

const totalEmployees =
    document.getElementById("totalEmployees");

const presentToday =
    document.getElementById("presentToday");

const employeesOnLeave =
    document.getElementById("employeesOnLeave");

const pendingLeaves =
    document.getElementById("pendingLeaves");

const departmentCount =
    document.getElementById("departmentCount");

const activeEmployees =
    document.getElementById("activeEmployees");

const activitiesTableBody =
    document.getElementById("activitiesTableBody");

const logoutBtn =
    document.getElementById("logoutBtn");


// ======================================================
// DATE HELPERS
// ======================================================

function getTodayString() {

    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function parseDate(dateString) {

    if (!dateString) {
        return null;
    }

    const parts = dateString.split("-");

    if (parts.length !== 3) {
        return new Date(dateString);
    }

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );
}


function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date = parseDate(dateString);

    if (!date || isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString();
}


// ======================================================
// CURRENT DATE
// ======================================================

const todayString = getTodayString();


// ======================================================
// TOTAL EMPLOYEES
// ======================================================

function updateTotalEmployees() {

    totalEmployees.innerText =
        employees.length;

}


// ======================================================
// PRESENT TODAY
// ======================================================

function updatePresentToday() {

    const count =
        employees.filter(function (employee) {

            return employee.attendance === "Present";

        }).length;

    presentToday.innerText = count;

}


// ======================================================
// EMPLOYEES ON LEAVE TODAY
// ======================================================

function updateEmployeesOnLeave() {

    const employeesCurrentlyOnLeave = [];


    leaveRequests.forEach(function (leave) {

        const status =
            String(leave.status || "").toLowerCase();

        // Only approved leave should count
        if (status !== "approved") {
            return;
        }


        const fromDate =
            leave.fromDate;

        const toDate =
            leave.toDate;


        if (!fromDate || !toDate) {
            return;
        }


        // Check whether TODAY falls between
        // From Date and To Date

        if (
            todayString >= fromDate &&
            todayString <= toDate
        ) {

            const employeeId =
                leave.employeeId ||
                leave.id ||
                leave.employeeID;


            // Prevent duplicate employees
            if (
                employeeId &&
                !employeesCurrentlyOnLeave.includes(employeeId)
            ) {

                employeesCurrentlyOnLeave.push(
                    employeeId
                );

            }

            // If employee ID is not available,
            // use employee name
            else if (
                !employeeId &&
                leave.employeeName
            ) {

                if (
                    !employeesCurrentlyOnLeave.includes(
                        leave.employeeName
                    )
                ) {

                    employeesCurrentlyOnLeave.push(
                        leave.employeeName
                    );

                }

            }

        }

    });


    employeesOnLeave.innerText =
        employeesCurrentlyOnLeave.length;

}


// ======================================================
// PENDING LEAVE REQUESTS
// ======================================================

function updatePendingLeaves() {

    const count =
        leaveRequests.filter(function (leave) {

            return String(
                leave.status || ""
            ).toLowerCase() === "pending";

        }).length;


    pendingLeaves.innerText = count;

}


// ======================================================
// DEPARTMENT COUNT
// ======================================================

function updateDepartmentCount() {

    const departments =
        new Set();


    employees.forEach(function (employee) {

        if (employee.department) {

            departments.add(
                employee.department
            );

        }

    });


    departmentCount.innerText =
        departments.size;

}


// ======================================================
// ACTIVE EMPLOYEES
// ======================================================

function updateActiveEmployees() {

    const count =
        employees.filter(function (employee) {

            // If status is not available,
            // consider the registered employee active.

            return (
                !employee.status ||
                String(employee.status).toLowerCase() !==
                "inactive"
            );

        }).length;


    activeEmployees.innerText =
        count;

}


// ======================================================
// FIND EMPLOYEE
// ======================================================

function findEmployee(employeeId, employeeName) {

    return employees.find(function (employee) {

        return (
            employee.id === employeeId ||
            employee.name === employeeName
        );

    });

}


// ======================================================
// BUILD RECENT ACTIVITIES
// ======================================================

function getRecentActivities() {

    let activities = [];


    // ==================================================
    // EXISTING ACTIVITY LOG
    // ==================================================

    if (Array.isArray(activityLog)) {

        activityLog.forEach(function (activity) {

            activities.push({

                type:
                    activity.type ||
                    activity.activityType ||
                    "Activity",

                employee:
                    activity.employee ||
                    activity.employeeName ||
                    "-",

                details:
                    activity.details ||
                    activity.description ||
                    "-",

                date:
                    activity.date ||
                    activity.createdAt ||
                    todayString

            });

        });

    }


    // ==================================================
    // LEAVE ACTIVITIES
    // ==================================================

    leaveRequests.forEach(function (leave) {

        const employeeName =
            leave.employeeName ||
            leave.name ||
            findEmployee(
                leave.employeeId,
                leave.employeeName
            )?.name ||
            "-";


        let activityDate =
            leave.updatedAt ||
            leave.approvedDate ||
            leave.createdAt ||
            leave.date ||
            leave.fromDate ||
            todayString;


        let status =
            leave.status ||
            "Pending";


        activities.push({

            type: "Leave",

            employee: employeeName,

            details:
                `${leave.leaveType || "Leave"} - ${status}`,

            date: activityDate

        });

    });


    // ==================================================
    // ATTENDANCE ACTIVITIES
    // ==================================================

    employees.forEach(function (employee) {

        if (employee.attendance) {

            activities.push({

                type: "Attendance",

                employee: employee.name,

                details:
                    `Attendance marked as ${employee.attendance}`,

                date:
                    employee.attendanceDate ||
                    todayString

            });

        }

    });


    // ==================================================
    // EMPLOYEE REGISTRATION ACTIVITIES
    // ==================================================

    employees.forEach(function (employee) {

        if (
            employee.createdAt ||
            employee.registrationDate
        ) {

            activities.push({

                type: "Employee",

                employee: employee.name,

                details:
                    `Employee ${employee.id} added to ${employee.department}`,

                date:
                    employee.createdAt ||
                    employee.registrationDate

            });

        }

    });


    // ==================================================
    // REMOVE DUPLICATE ACTIVITIES
    // ==================================================

    const uniqueActivities = [];

    const activityKeys = new Set();


    activities.forEach(function (activity) {

        const key =
            `${activity.type}|` +
            `${activity.employee}|` +
            `${activity.details}|` +
            `${activity.date}`;


        if (!activityKeys.has(key)) {

            activityKeys.add(key);

            uniqueActivities.push(activity);

        }

    });


    // ==================================================
    // SORT BY MOST RECENT
    // ==================================================

    uniqueActivities.sort(function (a, b) {

        const dateA =
            parseDate(
                String(a.date).substring(0, 10)
            );

        const dateB =
            parseDate(
                String(b.date).substring(0, 10)
            );


        return dateB - dateA;

    });


    // Show latest 10 activities

    return uniqueActivities.slice(0, 10);

}


// ======================================================
// ACTIVITY TYPE CLASS
// ======================================================

function getActivityClass(type) {

    const activityType =
        String(type).toLowerCase();


    if (activityType === "leave") {
        return "leave";
    }


    if (activityType === "attendance") {
        return "attendance";
    }


    if (activityType === "employee") {
        return "employee";
    }


    return "activity";

}


// ======================================================
// DISPLAY RECENT ACTIVITIES
// ======================================================

function displayRecentActivities() {

    activitiesTableBody.innerHTML = "";


    const activities =
        getRecentActivities();


    if (activities.length === 0) {

        activitiesTableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;"
                >

                    No Recent Activities

                </td>

            </tr>

        `;

        return;

    }


    activities.forEach(function (activity) {

        const activityClass =
            getActivityClass(
                activity.type
            );


        activitiesTableBody.innerHTML += `

            <tr>

                <td>

                    <span class="activity-badge ${activityClass}">

                        ${activity.type}

                    </span>

                </td>


                <td>

                    ${activity.employee}

                </td>


                <td>

                    ${activity.details}

                </td>


                <td>

                    ${formatDate(
                        String(activity.date).substring(0, 10)
                    )}

                </td>

            </tr>

        `;

    });

}


// ======================================================
// UPDATE ENTIRE DASHBOARD
// ======================================================

function updateDashboard() {

    // Reload latest data from localStorage

    employees =
        JSON.parse(
            localStorage.getItem("employees")
        ) || [];


    leaveRequests =
        JSON.parse(
            localStorage.getItem("leaveRequests")
        ) || [];


    activityLog =
        JSON.parse(
            localStorage.getItem("activityLog")
        ) || [];


    updateTotalEmployees();

    updatePresentToday();

    updateEmployeesOnLeave();

    updatePendingLeaves();

    updateDepartmentCount();

    updateActiveEmployees();

    displayRecentActivities();

}


// ======================================================
// LOGOUT
// ======================================================

logoutBtn.addEventListener(
    "click",
    function () {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {
            return;
        }


        localStorage.removeItem(
            "loggedInRole"
        );


        localStorage.removeItem(
            "username"
        );


        localStorage.removeItem(
            "loggedInEmployee"
        );


        window.location.href =
            "login.html";

    }
);


// ======================================================
// INITIAL LOAD
// ======================================================

updateDashboard();


// ======================================================
// REFRESH DASHBOARD
// ======================================================

// This makes the dashboard reflect changes
// when data is changed in another page.

window.addEventListener(
    "storage",
    function () {

        updateDashboard();

    }
);