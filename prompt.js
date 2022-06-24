var inquirer = require('inquirer');

const initPrompt = () => {
    inquirer.prompt ([
        {
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
        }
    ])
    .then(({action}) => {
        switch(action) {
            case "view all departments":
                return console.log('view all departments');
            case "view all roles":
                return console.log('view all roles');
            case "view all employees":
                return console.log('view all employees');
            case "add a department":
                return console.log('add a department');
            case "add a role":
                return console.log('add a role');
            case "add an employee":
                return console.log('add an employee');
            case "update an employee role":
                return console.log('update an employee role');
        }
    });
}

initPrompt();