const inquirer = require("inquirer")

const employee_db = require('./lib/EmployeeDatabase');

const options = [
    "View all Deparments", 
    "View All Roles", 
    "View All Employees",
    "Add Department",
    "Add Role",
    "Add Employee",
    "Update Employee Role"
];


inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: options
    }
])
.then(answers => {

});