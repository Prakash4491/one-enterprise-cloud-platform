// ==========================================
// HR ACCESS CHECK
// ==========================================

if (
    localStorage.getItem("loggedInRole") !== "hr"
) {

    alert("HR access required.");

    window.location.href =
        "login.html";

}


// ==========================================
// LOAD LEAVE REQUESTS
// ==========================================

let leaveRequests =
    JSON.parse(
        localStorage.getItem("leaveRequests")
    ) || [];


// ==========================================
// HTML ELEMENTS
// ==========================================

const leaveTableBody =
    document.getElementById(
        "leaveTableBody"
    );


const searchLeave =
    document.getElementById(
        "searchLeave"
    );


const departmentFilter =
    document.getElementById(
        "departmentFilter"
    );


const statusFilter =
    document.getElementById(
        "statusFilter"
    );


const totalRequests =
    document.getElementById(
        "totalRequests"
    );


const pendingRequests =
    document.getElementById(
        "pendingRequests"
    );


const approvedRequests =
    document.getElementById(
        "approvedRequests"
    );


const rejectedRequests =
    document.getElementById(
        "rejectedRequests"
    );


// ==========================================
// CALCULATE TOTAL DAYS
// ==========================================

function calculateDays(
    fromDate,
    toDate
) {

    const start =
        new Date(fromDate);

    const end =
        new Date(toDate);


    const difference =
        end - start;


    return (
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        ) + 1
    );

}


// ==========================================
// DISPLAY LEAVE REQUESTS
// ==========================================

function displayLeaveRequests(
    requestList
) {

    leaveTableBody.innerHTML = "";


    if (
        requestList.length === 0
    ) {

        leaveTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    class="no-data"
                >

                    No Leave Requests Found

                </td>

            </tr>

        `;

        return;

    }


    requestList.forEach(
        function (leave) {

            const days =
                leave.totalDays ||
                calculateDays(
                    leave.fromDate,
                    leave.toDate
                );


            const status =
                leave.status ||
                "Pending";


            const statusClass =
                status
                    .toLowerCase()
                    .replace(
                        " ",
                        "-"
                    );


            leaveTableBody.innerHTML += `

                <tr>

                    <td>
                        ${leave.employeeId}
                    </td>

                    <td>
                        ${leave.employeeName}
                    </td>

                    <td>
                        ${leave.department}
                    </td>

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
                        ${days}
                    </td>

                    <td>
                        ${leave.reason}
                    </td>

                    <td>

                        <span
                            class="status ${statusClass}"
                        >

                            ${status}

                        </span>

                    </td>

                    <td>

                        <div
                            class="action-buttons"
                        >

                            ${
                                status ===
                                "Pending"
                                    ? `

                                <button
                                    class="approve-btn"
                                    onclick="approveLeave('${leave.id}')"
                                >
                                    Approve
                                </button>

                                <button
                                    class="reject-btn"
                                    onclick="rejectLeave('${leave.id}')"
                                >
                                    Reject
                                </button>

                            `
                                    : ""
                            }


                            ${
                                status !==
                                    "Cancelled"
                                    ? `

                                <button
                                    class="cancel-btn"
                                    onclick="cancelLeave('${leave.id}')"
                                >
                                    Cancel
                                </button>

                            `
                                    : ""
                            }

                        </div>

                    </td>

                </tr>

            `;

        }
    );

}


// ==========================================
// SAVE LEAVE REQUESTS
// ==========================================

function saveLeaveRequests() {

    localStorage.setItem(
        "leaveRequests",
        JSON.stringify(
            leaveRequests
        )
    );

}


// ==========================================
// APPROVE LEAVE
// ==========================================

function approveLeave(id) {

const leave = leaveRequests.find(function (request) {
    return String(request.id) === String(id);
});


    if (!leave) {

        return;

    }


    if (
        !confirm(
            "Approve this leave request?"
        )
    ) {

        return;

    }


    leave.status =
        "Approved";


    leave.approvedDate =
        new Date()
            .toLocaleDateString();


    saveLeaveRequests();

    filterLeaveRequests();

    alert(
        "Leave Approved Successfully."
    );

}


// ==========================================
// REJECT LEAVE
// ==========================================

function rejectLeave(id) {

const leave = leaveRequests.find(function (request) {
    return String(request.id) === String(id);
});


    if (!leave) {

        return;

    }


    if (
        !confirm(
            "Reject this leave request?"
        )
    ) {

        return;

    }


    leave.status =
        "Rejected";


    leave.rejectedDate =
        new Date()
            .toLocaleDateString();


    saveLeaveRequests();

    filterLeaveRequests();

    alert(
        "Leave Rejected."
    );

}


// ==========================================
// CANCEL LEAVE
// ==========================================

function cancelLeave(id) {

const leave = leaveRequests.find(function (request) {
    return String(request.id) === String(id);
});


    if (!leave) {

        return;

    }


    if (
        !confirm(
            "Cancel this leave request?"
        )
    ) {

        return;

    }


    leave.status =
        "Cancelled";


    leave.cancelledDate =
        new Date()
            .toLocaleDateString();


    saveLeaveRequests();

    filterLeaveRequests();

    alert(
        "Leave Cancelled."
    );

}


// ==========================================
// FILTER
// ==========================================

function filterLeaveRequests() {

    const searchValue =
        searchLeave.value
            .trim()
            .toLowerCase();


    const departmentValue =
        departmentFilter.value;


    const statusValue =
        statusFilter.value;


    const filtered =
        leaveRequests.filter(
            function (leave) {

                const employeeId =
                    (
                        leave.employeeId ||
                        ""
                    ).toLowerCase();


                const employeeName =
                    (
                        leave.employeeName ||
                        ""
                    ).toLowerCase();


                const matchesSearch =

                    employeeId.includes(
                        searchValue
                    )

                    ||

                    employeeName.includes(
                        searchValue
                    );


                const matchesDepartment =

                    departmentValue ===
                        "All"

                    ||

                    leave.department ===
                        departmentValue;


                const matchesStatus =

                    statusValue ===
                        "All"

                    ||

                    (
                        leave.status ||
                        "Pending"
                    ) ===
                        statusValue;


                return (

                    matchesSearch &&

                    matchesDepartment &&

                    matchesStatus

                );

            }
        );


    displayLeaveRequests(
        filtered
    );

    updateSummary();

}


// ==========================================
// SUMMARY
// ==========================================

function updateSummary() {

    totalRequests.innerText =
        leaveRequests.length;


    pendingRequests.innerText =
        leaveRequests.filter(
            function (leave) {

                return (
                    (
                        leave.status ||
                        "Pending"
                    ) === "Pending"
                );

            }
        ).length;


    approvedRequests.innerText =
        leaveRequests.filter(
            function (leave) {

                return (
                    leave.status ===
                    "Approved"
                );

            }
        ).length;


    rejectedRequests.innerText =
        leaveRequests.filter(
            function (leave) {

                return (
                    leave.status ===
                    "Rejected"
                );

            }
        ).length;

}


// ==========================================
// EVENTS
// ==========================================

searchLeave.addEventListener(
    "keyup",
    filterLeaveRequests
);


departmentFilter.addEventListener(
    "change",
    filterLeaveRequests
);


statusFilter.addEventListener(
    "change",
    filterLeaveRequests
);


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener(
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


// ==========================================
// INITIAL LOAD
// ==========================================

updateSummary();

displayLeaveRequests(
    leaveRequests
);