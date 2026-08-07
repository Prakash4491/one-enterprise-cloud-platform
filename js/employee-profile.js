// =====================================================
// EMPLOYEE PROFILE - COMPLETE JS
// =====================================================


// =====================================================
// ACCESS CHECK
// =====================================================

if (localStorage.getItem("loggedInRole") !== "employee") {

    alert("Employee access required.");

    window.location.href = "login.html";

}


// =====================================================
// GET LOGGED-IN EMPLOYEE
// =====================================================

const loggedInEmployee =
    JSON.parse(
        localStorage.getItem("loggedInEmployee")
    );


// =====================================================
// LOAD LATEST EMPLOYEE DATA
// =====================================================

const employees =
    JSON.parse(
        localStorage.getItem("employees")
    ) || [];


// IMPORTANT:
// Do NOT use the old loggedInEmployee object directly.
// Find the latest version from employees.

let employee = null;

if (loggedInEmployee) {

    employee = employees.find(function (emp) {

        return emp.id === loggedInEmployee.id;

    });

}


// =====================================================
// EMPLOYEE NOT FOUND
// =====================================================

if (!employee) {

    alert("Employee information not found.");

    localStorage.removeItem("loggedInEmployee");

    window.location.href = "login.html";

}


// =====================================================
// HTML ELEMENTS
// =====================================================

const employeeId =
    document.getElementById("employeeId");

const employeeName =
    document.getElementById("employeeName");

const employeeEmail =
    document.getElementById("employeeEmail");

const employeeMobile =
    document.getElementById("employeeMobile");

const employeeDepartment =
    document.getElementById("employeeDepartment");

const employeeDesignation =
    document.getElementById("employeeDesignation");

const employeeJoiningDate =
    document.getElementById("employeeJoiningDate");

const attendancePercentage =
    document.getElementById("attendancePercentage");

const leaveBalance =
    document.getElementById("leaveBalance");


// Reports

const totalWorkingDays =
    document.getElementById("totalWorkingDays");

const presentDays =
    document.getElementById("presentDays");

const leaveDays =
    document.getElementById("leaveDays");

const reportAttendancePercentage =
    document.getElementById(
        "reportAttendancePercentage"
    );


// Leave

const leaveForm =
    document.getElementById("leaveForm");

const leaveMessage =
    document.getElementById("leaveMessage");

const myLeaveTableBody =
    document.getElementById(
        "myLeaveTableBody"
    );


// Logout

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================================
// DISPLAY EMPLOYEE PROFILE
// =====================================================

function displayEmployeeProfile() {

    employeeId.innerText =
        employee.id || "-";

    employeeName.innerText =
        employee.name || "-";

    employeeEmail.innerText =
        employee.email || "-";

    employeeMobile.innerText =
        employee.mobile || "-";

    employeeDepartment.innerText =
        employee.department || "-";

    employeeDesignation.innerText =
        employee.designation || "-";

    employeeJoiningDate.innerText =
        employee.joiningDate || "-";

}


// =====================================================
// DATE HELPERS
// =====================================================

function getTodayDate() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// =====================================================
// CALCULATE WORKING DAYS
// FROM JOINING DATE TO TODAY
// EXCLUDING SATURDAY & SUNDAY
// =====================================================

function calculateWorkingDays() {

    if (!employee.joiningDate) {

        return 0;

    }


    const startDate =
        new Date(
            employee.joiningDate +
            "T00:00:00"
        );

    const today =
        new Date();


    // Remove time

    today.setHours(
        0,
        0,
        0,
        0
    );


    // If joining date is in future

    if (startDate > today) {

        return 0;

    }


    let workingDays = 0;

    const currentDate =
        new Date(startDate);


    while (
        currentDate <= today
    ) {

        const day =
            currentDate.getDay();


        // Sunday = 0
        // Saturday = 6

        if (
            day !== 0 &&
            day !== 6
        ) {

            workingDays++;

        }


        currentDate.setDate(
            currentDate.getDate() + 1
        );

    }


    return workingDays;

}


// =====================================================
// GET APPROVED LEAVE REQUESTS
// =====================================================

function getEmployeeLeaves() {

    const leaves =
        JSON.parse(
            localStorage.getItem("leaveRequests")
        ) || [];


    return leaves.filter(
        function (leave) {

            return (

                leave.employeeId ===
                employee.id

            );

        }
    );

}


// =====================================================
// CALCULATE CURRENT MONTH LEAVE DAYS
// =====================================================

function calculateCurrentMonthLeaveDays() {

    const leaves =
        getEmployeeLeaves();


    const today =
        new Date();


    const currentYear =
        today.getFullYear();

    const currentMonth =
        today.getMonth();


    let usedLeaveDays = 0;


    leaves.forEach(
        function (leave) {

            // Only approved leaves

            if (
                leave.status !==
                "Approved"
            ) {

                return;

            }


            const from =
                new Date(
                    leave.fromDate +
                    "T00:00:00"
                );

            const to =
                new Date(
                    leave.toDate +
                    "T00:00:00"
                );


            // Check whether the leave
            // belongs to current month

            if (
                from.getFullYear() !==
                currentYear
                ||
                from.getMonth() !==
                currentMonth
            ) {

                return;

            }


            let current =
                new Date(from);


            while (
                current <= to
            ) {

                const day =
                    current.getDay();


                // Count only weekdays

                if (
                    day !== 0 &&
                    day !== 6
                ) {

                    usedLeaveDays++;

                }


                current.setDate(
                    current.getDate() + 1
                );

            }

        }
    );


    return usedLeaveDays;

}


// =====================================================
// LEAVE BALANCE
// MONTHLY ALLOWANCE = 2 DAYS
// =====================================================

function calculateLeaveBalance() {

    const monthlyLeaveAllowance = 2;


    const usedLeaveDays =
        calculateCurrentMonthLeaveDays();


    const balance =
        Math.max(
            0,
            monthlyLeaveAllowance -
            usedLeaveDays
        );


    return balance;

}


// =====================================================
// GET TODAY'S ATTENDANCE
// =====================================================

function getTodayAttendance() {

    const today =
        getTodayDate();


    // New attendance history format

    if (
        employee.attendanceHistory
        &&
        Array.isArray(
            employee.attendanceHistory
        )
    ) {

        const todayRecord =
            employee.attendanceHistory.find(
                function (record) {

                    return (
                        record.date ===
                        today
                    );

                }
            );


        if (todayRecord) {

            return todayRecord.status;

        }

    }


    // Current attendance format
    // Used by your existing admin attendance page

    if (
        employee.attendanceDate ===
        today
    ) {

        return employee.attendance;

    }


    return null;

}


// =====================================================
// CALCULATE PRESENT DAYS
// =====================================================

function calculatePresentDays() {

    let present = 0;


    // -------------------------------------------------
    // NEW FORMAT
    // -------------------------------------------------

    if (
        employee.attendanceHistory
        &&
        Array.isArray(
            employee.attendanceHistory
        )
    ) {

        employee.attendanceHistory.forEach(
            function (record) {

                if (
                    record.status ===
                    "Present"
                ) {

                    present++;

                }

            }
        );


        return present;

    }


    // -------------------------------------------------
    // EXISTING FORMAT
    // -------------------------------------------------

    const todayAttendance =
        getTodayAttendance();


    if (
        todayAttendance ===
        "Present"
    ) {

        present = 1;

    }


    return present;

}


// =====================================================
// CALCULATE LEAVE DAYS FOR REPORT
// =====================================================

function calculateLeaveDays() {

    const leaves =
        getEmployeeLeaves();


    let totalLeaveDays = 0;


    leaves.forEach(
        function (leave) {

            if (
                leave.status !==
                "Approved"
            ) {

                return;

            }


            const from =
                new Date(
                    leave.fromDate +
                    "T00:00:00"
                );

            const to =
                new Date(
                    leave.toDate +
                    "T00:00:00"
                );


            let current =
                new Date(from);


            while (
                current <= to
            ) {

                const day =
                    current.getDay();


                if (
                    day !== 0 &&
                    day !== 6
                ) {

                    totalLeaveDays++;

                }


                current.setDate(
                    current.getDate() + 1
                );

            }

        }
    );


    return totalLeaveDays;

}


// =====================================================
// DISPLAY ATTENDANCE & REPORTS
// =====================================================

function updateReports() {

    const workingDays =
        calculateWorkingDays();


    const present =
        calculatePresentDays();


    const leave =
        calculateLeaveDays();


    let percentage = 0;


    if (workingDays > 0) {

        percentage =
            Math.round(
                (
                    present /
                    workingDays
                ) * 100
            );

    }


    // ---------------------------------------------
    // PROFILE SECTION
    // ---------------------------------------------

    if (attendancePercentage) {

        attendancePercentage.innerText =
            percentage + "%";

    }


    if (leaveBalance) {

        leaveBalance.innerText =
            calculateLeaveBalance() +
            " Days";

    }


    // ---------------------------------------------
    // REPORT SECTION
    // ---------------------------------------------

    if (totalWorkingDays) {

        totalWorkingDays.innerText =
            workingDays;

    }


    if (presentDays) {

        presentDays.innerText =
            present;

    }


    if (leaveDays) {

        leaveDays.innerText =
            leave;

    }


    if (reportAttendancePercentage) {

        reportAttendancePercentage.innerText =
            percentage + "%";

    }

}


// =====================================================
// DISPLAY MY LEAVE REQUESTS
// =====================================================

function displayMyLeaves() {

    if (!myLeaveTableBody) {

        return;

    }


    const leaves =
        getEmployeeLeaves();


    myLeaveTableBody.innerHTML = "";


    if (leaves.length === 0) {

        myLeaveTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;"
                >

                    No Leave Requests Found

                </td>

            </tr>

        `;

        return;

    }


    leaves.forEach(
        function (leave) {

            let statusClass =
                "";


            if (
                leave.status ===
                "Approved"
            ) {

                statusClass =
                    "approved";

            }
            else if (
                leave.status ===
                "Rejected"
            ) {

                statusClass =
                    "rejected";

            }
            else {

                statusClass =
                    "pending";

            }


            myLeaveTableBody.innerHTML += `

                <tr>

                    <td>
                        ${leave.leaveType}
                    </td>

                    <td>
                        ${leave.fromDate}
                    </td>

                    <td>
                        ${leave.toDate}
                    </td>

                    <td>
                        ${leave.reason}
                    </td>

                    <td>

                        <span
                            class="leave-status ${statusClass}"
                        >
                            ${leave.status}
                        </span>

                    </td>

                </tr>

            `;

        }
    );

}


// =====================================================
// APPLY LEAVE
// =====================================================

if (leaveForm) {

    leaveForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const leaveType =
                document.getElementById(
                    "leaveType"
                ).value;


            const fromDate =
                document.getElementById(
                    "fromDate"
                ).value;


            const toDate =
                document.getElementById(
                    "toDate"
                ).value;


            const reason =
                document.getElementById(
                    "leaveReason"
                ).value.trim();


            // -----------------------------------------
            // DATE VALIDATION
            // -----------------------------------------

            if (
                new Date(
                    toDate
                ) <
                new Date(
                    fromDate
                )
            ) {

                leaveMessage.innerText =
                    "❌ To Date cannot be before From Date.";

                leaveMessage.style.color =
                    "red";

                return;

            }


            // -----------------------------------------
            // CHECK LEAVE BALANCE
            // -----------------------------------------

            let current =
                new Date(
                    fromDate +
                    "T00:00:00"
                );

            const end =
                new Date(
                    toDate +
                    "T00:00:00"
                );


            let requestedDays = 0;


            while (
                current <= end
            ) {

                const day =
                    current.getDay();


                if (
                    day !== 0 &&
                    day !== 6
                ) {

                    requestedDays++;

                }


                current.setDate(
                    current.getDate() + 1
                );

            }


            const availableLeave =
                calculateLeaveBalance();


            if (
                requestedDays >
                availableLeave
            ) {

                leaveMessage.innerText =
                    "❌ Leave request exceeds your available monthly leave balance of " +
                    availableLeave +
                    " days.";

                leaveMessage.style.color =
                    "red";

                return;

            }


            // -----------------------------------------
            // LOAD LEAVE REQUESTS
            // -----------------------------------------

            const leaveRequests =
                JSON.parse(
                    localStorage.getItem(
                        "leaveRequests"
                    )
                ) || [];


            // -----------------------------------------
            // CREATE REQUEST
            // -----------------------------------------

            const leaveRequest = {

                id:
                    Date.now(),

                employeeId:
                    employee.id,

                employeeName:
                    employee.name,

                department:
                    employee.department,

                leaveType:
                    leaveType,

                fromDate:
                    fromDate,

                toDate:
                    toDate,

                reason:
                    reason,

                status:
                    "Pending",

                appliedDate:
                    getTodayDate()

            };


            leaveRequests.push(
                leaveRequest
            );


            // -----------------------------------------
            // SAVE
            // -----------------------------------------

            localStorage.setItem(
                "leaveRequests",
                JSON.stringify(
                    leaveRequests
                )
            );


            leaveMessage.innerText =
                "✅ Leave request submitted successfully.";

            leaveMessage.style.color =
                "green";


            leaveForm.reset();


            displayMyLeaves();

            updateReports();

        }
    );

}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "loggedInRole"
            );

            localStorage.removeItem(
                "loggedInEmployee"
            );

            localStorage.removeItem(
                "username"
            );


            window.location.href =
                "login.html";

        }
    );

}


// =====================================================
// PRINT PROFILE
// =====================================================

const printBtn =
    document.getElementById(
        "printProfileBtn"
    );


if (printBtn) {

    printBtn.addEventListener(
        "click",
        function () {

            window.print();

        }
    );

}


// =====================================================
// DOWNLOAD PROFILE
// =====================================================

const downloadBtn =
    document.getElementById(
        "downloadProfileBtn"
    );


if (downloadBtn) {

    downloadBtn.addEventListener(
        "click",
        function () {

            const profileText = `

EMPLOYEE PROFILE
==============================

Employee ID       : ${employee.id}
Name              : ${employee.name}
Email             : ${employee.email}
Mobile            : ${employee.mobile}
Department        : ${employee.department}
Designation       : ${employee.designation}
Date of Joining   : ${employee.joiningDate}

ATTENDANCE
==============================

Working Days      : ${calculateWorkingDays()}
Present Days      : ${calculatePresentDays()}
Leave Days        : ${calculateLeaveDays()}
Attendance        : ${
    calculateWorkingDays() > 0
        ? Math.round(
            (
                calculatePresentDays() /
                calculateWorkingDays()
            ) * 100
        )
        : 0
}%


Leave Balance
==============================

Remaining Leave  : ${calculateLeaveBalance()} Days

            `;


            const blob =
                new Blob(
                    [profileText],
                    {
                        type:
                            "text/plain"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;

            link.download =
                employee.id +
                "-profile.txt";


            link.click();


            URL.revokeObjectURL(
                url
            );

        }
    );

}


// =====================================================
// INITIAL LOAD
// =====================================================

displayEmployeeProfile();

updateReports();

displayMyLeaves();