// ==========================================
// LOGIN FORM
// ==========================================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // ==========================================
    // GET LOGIN DETAILS
    // ==========================================

    const username =
        document.getElementById("username")
        .value
        .trim();

    const password =
        document.getElementById("password")
        .value
        .trim();

    const message =
        document.getElementById("message");


    // Clear previous message

    message.innerHTML = "";


    // ==========================================
    // ADMIN LOGIN
    // ==========================================

    if (
        (
            username.toLowerCase() === "admin" ||

            username.toLowerCase() ===
            "admin@gmail.com"
        )

        &&

        password === "admin123"
    ) {

        // Store admin role

        localStorage.setItem(
            "loggedInRole",
            "admin"
        );


        // Store admin name

        localStorage.setItem(
            "username",
            "Administrator"
        );


        // Remove previous employee

        localStorage.removeItem(
            "loggedInEmployee"
        );


        // Go to Admin Dashboard

        window.location.href =
            "dashboard.html";


        return;
    }


    // ==========================================
    // LOAD REGISTERED EMPLOYEES
    // ==========================================

    const employees =
        JSON.parse(
            localStorage.getItem("employees")
        ) || [];


    // ==========================================
    // FIND EMPLOYEE
    // ==========================================

    const employee =
        employees.find(function (emp) {

            const employeeId =
                String(emp.id)
                .toLowerCase();

            const employeeEmail =
                String(emp.email)
                .toLowerCase();

            const enteredUsername =
                username.toLowerCase();


            return (

                (
                    employeeId ===
                    enteredUsername

                    ||

                    employeeEmail ===
                    enteredUsername
                )

                &&

                emp.password === password

            );

        });


    // ==========================================
    // INVALID CREDENTIALS
    // ==========================================

    if (!employee) {

        message.innerHTML =
            "❌ Invalid Employee ID/Email or Password";

        message.style.color = "red";

        return;
    }


    // ==========================================
    // STORE LOGGED-IN EMPLOYEE
    // ==========================================

    localStorage.setItem(
        "loggedInEmployee",
        JSON.stringify(employee)
    );


    // Store employee name

    localStorage.setItem(
        "username",
        employee.name
    );


    // ==========================================
    // CHECK DEPARTMENT
    // ==========================================

    if (
        String(employee.department)
        .toLowerCase() === "hr"
    ) {

        // ======================================
        // HR LOGIN
        // ======================================

        localStorage.setItem(
            "loggedInRole",
            "hr"
        );


        // Go to HR Dashboard

        window.location.href =
            "hr-dashboard.html";


        return;
    }


    // ==========================================
    // NORMAL EMPLOYEE LOGIN
    // ==========================================

    localStorage.setItem(
        "loggedInRole",
        "employee"
    );


    // Go to Employee Profile

    window.location.href =
        "employee-profile.html";

});