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

let employees =
    JSON.parse(
        localStorage.getItem("employees")
    ) || [];


// ===========================
// HTML ELEMENTS
// ===========================

const employeeContainer =
    document.getElementById(
        "employeeContainer"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const departmentFilter =
    document.getElementById(
        "departmentFilter"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

const designationFilter =
    document.getElementById(
        "designationFilter"
    );

const sortOption =
    document.getElementById(
        "sortOption"
    );

const resetBtn =
    document.getElementById(
        "resetBtn"
    );


// ===========================
// DISPLAY EMPLOYEES
// ===========================

function displayEmployees(employeeList) {

    employeeContainer.innerHTML = "";


    // ===========================
    // NO EMPLOYEES
    // ===========================

    if (employeeList.length === 0) {

        employeeContainer.innerHTML = `

            <h2 class="no-data">

                No Employees Found

            </h2>

        `;

        return;

    }


    // ===========================
    // DISPLAY CARDS
    // ===========================

    employeeList.forEach(
        function (employee) {

            const image =
                employee.image ||
                "assets/images/employee.png";


            const status =
                employee.status ||
                "Active";


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

        }
    );

}


// ===========================
// FILTER EMPLOYEES
// ===========================

function filterEmployees() {

    let filteredEmployees =
        [...employees];


    // ===========================
    // SEARCH
    // ===========================

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();


    // ===========================
    // FILTER VALUES
    // ===========================

    const departmentValue =
        departmentFilter.value;


    const designationValue =
        designationFilter.value;


    const statusValue =
        statusFilter.value;


    const sortValue =
        sortOption.value;


    // ===========================
    // FILTER
    // ===========================

    filteredEmployees =
        filteredEmployees.filter(
            function (employee) {


                const employeeName =
                    (employee.name || "")
                        .toLowerCase();


                const employeeId =
                    (employee.id || "")
                        .toLowerCase();


                const matchesSearch =

                    employeeName.includes(
                        searchValue
                    )

                    ||

                    employeeId.includes(
                        searchValue
                    );


                const matchesDepartment =

                    departmentValue === "All"

                    ||

                    employee.department ===
                    departmentValue;


                const matchesDesignation =

                    designationValue === "All"

                    ||

                    employee.designation ===
                    designationValue;


                const matchesStatus =

                    statusValue === "All"

                    ||

                    (employee.status || "Active") ===
                    statusValue;


                return (

                    matchesSearch &&

                    matchesDepartment &&

                    matchesDesignation &&

                    matchesStatus

                );

            }
        );


    // ===========================
    // SORT
    // ===========================

    switch (sortValue) {


        // ===========================
        // NAME A-Z
        // ===========================

        case "nameAsc":

            filteredEmployees.sort(
                function (a, b) {

                    return (
                        a.name || ""
                    ).localeCompare(
                        b.name || ""
                    );

                }
            );

            break;


        // ===========================
        // NAME Z-A
        // ===========================

        case "nameDesc":

            filteredEmployees.sort(
                function (a, b) {

                    return (
                        b.name || ""
                    ).localeCompare(
                        a.name || ""
                    );

                }
            );

            break;


        // ===========================
        // ID ASCENDING
        // ===========================

        case "idAsc":

            filteredEmployees.sort(
                function (a, b) {

                    return (
                        a.id || ""
                    ).localeCompare(
                        b.id || ""
                    );

                }
            );

            break;


        // ===========================
        // ID DESCENDING
        // ===========================

        case "idDesc":

            filteredEmployees.sort(
                function (a, b) {

                    return (
                        b.id || ""
                    ).localeCompare(
                        a.id || ""
                    );

                }
            );

            break;

    }


    // ===========================
    // DISPLAY RESULT
    // ===========================

    displayEmployees(
        filteredEmployees
    );

}


// ===========================
// SEARCH EVENT
// ===========================

searchInput.addEventListener(
    "keyup",
    filterEmployees
);


// ===========================
// DEPARTMENT EVENT
// ===========================

departmentFilter.addEventListener(
    "change",
    filterEmployees
);


// ===========================
// STATUS EVENT
// ===========================

statusFilter.addEventListener(
    "change",
    filterEmployees
);


// ===========================
// DESIGNATION EVENT
// ===========================

designationFilter.addEventListener(
    "change",
    filterEmployees
);


// ===========================
// SORT EVENT
// ===========================

sortOption.addEventListener(
    "change",
    filterEmployees
);


// ===========================
// RESET FILTERS
// ===========================

resetBtn.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        departmentFilter.value =
            "All";

        designationFilter.value =
            "All";

        statusFilter.value =
            "All";

        sortOption.value = "";

        displayEmployees(
            employees
        );

    }
);


// ===========================
// INITIAL DISPLAY
// ===========================

displayEmployees(
    employees
);