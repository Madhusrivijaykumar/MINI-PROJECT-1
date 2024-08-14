document.addEventListener('DOMContentLoaded', function() {
    const employeeForm = document.getElementById('employeeForm');
    const employeeTableBody = document.getElementById('employeeTableBody');

    // Fetch and display employees
    fetch('/api/employees')
        .then(response => response.json())
        .then(data => {
            data.forEach(employee => {
                addEmployeeToTable(employee);
            });
        });

    // Form submission handler
    employeeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const employeeId = document.getElementById('employeeId').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;

        const employee = {
            firstName: firstName,
            lastName: lastName,
            email: email
        };

        if (employeeId) {
            // Update employee
            fetch(`/api/employees/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            })
            .then(response => response.json())
            .then(updatedEmployee => {
                updateEmployeeInTable(updatedEmployee);
            });
        } else {
            // Create new employee
            fetch('/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            })
            .then(response => response.json())
            .then(newEmployee => {
                addEmployeeToTable(newEmployee);
            });
        }

        employeeForm.reset();
    });

    // Add employee to table
    function addEmployeeToTable(employee) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td>${employee.email}</td>
            <td>
                <button onclick="editEmployee(${employee.id})">Edit</button>
                <button onclick="deleteEmployee(${employee.id})">Delete</button>
            </td>
        `;
        employeeTableBody.appendChild(row);
    }

    // Update employee in table
    function updateEmployeeInTable(employee) {
        const rows = employeeTableBody.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.cells[0].textContent == employee.id) {
                row.cells[1].textContent = employee.firstName;
                row.cells[2].textContent = employee.lastName;
                row.cells[3].textContent = employee.email;
            }
        }
    }

    // Edit employee
    window.editEmployee = function(id) {
        fetch(`/api/employees/${id}`)
            .then(response => response.json())
            .then(employee => {
                document.getElementById('employeeId').value = employee.id;
                document.getElementById('firstName').value = employee.firstName;
                document.getElementById('lastName').value = employee.lastName;
                document.getElementById('email').value = employee.email;
            });
    };

    // Delete employee
    window.deleteEmployee = function(id) {
        fetch(`/api/employees/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            const rows = employeeTableBody.getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (row.cells[0].textContent == id) {
                    employeeTableBody.removeChild(row);
                }
            }
        });
    };
});
