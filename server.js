const express = require('express');
const db = require('./db/connection');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.promise().connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
    });
    //prompt();
});

// Inquirer Prompts
const prompt = () => {
    inquirer
        .prompt ([{
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "view all departments", 
                "view all roles", 
                "view all employees", 
                "add a department", 
                "add a role", 
                "add an employee", 
                "update an employee role"
            ]
        }])
    .then(({action}) => {
        switch(action) {
            case "view all departments":
                return viewDepartments();
            case "view all roles":
                return viewRoles();
            case "view all employees":
                return viewEmployees();
            case "add a department":
                return addDepartment();
            case "add a role":
                return addRole();
            case "add an employee":
                return addEmployee();
            case "update an employee role":
                return updateEmployeeRole();
        }
    });
}

const viewDepartments = () => {
    const sql = `SELECT * FROM Department`

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        return prompt();
    });
};

const viewRoles = () => {
    const sql = `SELECT * FROM role`

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        return prompt();
    });
};

const viewEmployees = () => {
    const sql = `SELECT * FROM employee`

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res)
        return prompt();
    });
};

const addDepartment = () => {
    inquirer
        .prompt([{
            type: 'input',
            name: 'departmentName',
            message: "Please enter the new department name.",
            validate: departmentName => {
            if(!departmentName) {
            console.log("Please enter a name.");
            return false;
            }
            return true;
            }
        }])
        .then(({departmentName}) => {
            let sql = `INSERT INTO department (department_name) VALUES (?)`;
            db.query(sql, departmentName, (err, res) => {
                if (err) throw err;
                viewDepartments();
            })
        })
}

const createDeptArray = async () => {
    let departments = [];
    const sql = `SELECT department_name FROM department`
    db.query(sql, (err, res) => {
        if (err) throw err;
        res.forEach((row) => {
            departments.push(row.department_name)
        })
    })
    // console.log(departments + ' Create');
    return departments;
}

const getDeptId = async(dept) => {
    var sql = `SELECT id FROM department WHERE department_name = ?`;
    const results = await db.promise().query(sql, dept);
    return results[0][0].id;
}

const addRolePrompt = async() => {
    let departments = await createDeptArray();

    await inquirer
        .prompt([{
            type: 'input',
            name: 'roleName',
            message: 'Please enter the new role name.',
            validate: roleName => {
            if(!roleName) {
            console.log("Please enter a name.");
            return false;
            }
            return true;
            }
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Please enter a salary for the new role.',
            validate: roleSalary => {
            if(!roleSalary) {
            console.log("Please enter a salary.");
            return false;
            }
            return true;
            }
        },
        {
            type: 'list',
            name: 'roleDept',
            message: 'Please select the department for the new role.',
            choices: departments,
        }])
        .then(({roleName, roleSalary, roleDept}) => {
            name = roleName,
            salary = roleSalary,
            dept = roleDept;
        })
    // console.log(name, salary, dept);

    return { name, salary, dept };
}

const addRole = async() => {
    const role = await addRolePrompt();
    // console.log(role.dept + ' dept inside addRole')
    const id = await getDeptId(role.dept);
    // console.log(id + ' addRole')
    let values = [role.name, role.salary, id];
    let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

    db.query(sql, values, (err, res) => {
        if (err) throw err;
        return viewRoles();
    })

}

const addEmployeePrompt = async () => {
    let employees = await createEmployeeArray();
    employees.push('N/A');
    let roles = await createRoleArray();

    await inquirer
        .prompt([{
            type: 'input',
            name: 'firstName',
            message: "Please enter the new employee's first name.",
            validate: firstName => {
                if(!firstName) {
                console.log("Please enter a name.");
                return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Please enter the new employee's last name.",
            validate: lastName => {
            if(!lastName) {
            console.log("Please enter a name.");
            return false;
            }
            return true;
            }
        },
        {
            type: 'list',
            name: 'currentRole',
            message: "Please select the employee's role.",
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: "Please select the employee's manager.",
            choices: employees
        }])
        .then(({firstName, lastName, currentRole, manager}) => {
            first = firstName,
            last = lastName,
            role = currentRole,
            mngr = manager;
        })

    return {first, last, role, mngr};
}

const getManagerId = async(manager) => {
    if(manager === 'N/A') {
        return null;
    } else {
    const fullName = manager;
    const values = fullName.split(' ');
    var sql = `SELECT id FROM employee WHERE first_name = ? and last_name = ?`;
    const res = await db.promise().query(sql, values);
    console.log(res[0][0].id);
    return res[0][0].id;
    }
}

const getRoleId = async (role) => {
    var sql = `SELECT id FROM role WHERE title = ?`;
    const res = await db.promise().query(sql, role);
    console.log(res[0][0].id);
    return res[0][0].id
}

const createEmployeeArray = async () => {
    employees = [];
    const sql = `SELECT first_name, last_name FROM employee`
    const res = await db.promise().query(sql);
    for (i = 0; i < res[0].length; i++) {
        let name = res[0][i].first_name + ' ' + res[0][i].last_name;
        employees.push(name);
    }
    // console.log(employees);
    return employees;
}

const createRoleArray = async () => {
    roles = [];
    const sql = `SELECT id, title FROM role`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        res.forEach((row) => {
            roles.push(row.title);
            // console.log(roles)
        })
        // console.log(roles);
        return roles;
    }); 
    // console.log(roles);
    return roles;
}

const addEmployee = async () => {
    const employee = await addEmployeePrompt();
    const roleId = await getRoleId(employee.role);
    // console.log(roleId);
    const managerId = await getManagerId(employee.mngr);
    // console.log(managerId);
    let values = [employee.first, employee.last, roleId, managerId];
    let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    const res = await db.promise().query(sql, values);
    console.log(employee.first + ' ' + employee.last + ' added successfully.');
    return viewEmployees();
}

const updateEmployeePrompt = async () => {
    let employees = await createEmployeeArray();
    const roles = await createRoleArray();

    await inquirer
        .prompt([{
                type: 'list',
                name: 'name',
                message: 'Please select the employee to update.',
                choices: employees
            },
            {
                type: 'list',
                name: 'newRole',
                message: 'Please select the new role for this employee.',
                choices: roles
            }])
            .then(({name, newRole}) => {
                employee = name,
                role = newRole
            })

        return {employee, role}
}

const updateEmployeeRole = async () => {
    const update = await updateEmployeePrompt();
    const employeeId = await getManagerId(update.employee);
    const roleId = await getRoleId(update.role);
    const values = [roleId, employeeId];
    let sql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;

    const res = await db.promise().query(sql, values);
    console.log(update.employee + " updated successfully.");
    return viewEmployees();
}

// Initializes inquirer prompts
const init = async() => {
    await prompt();
}

init();