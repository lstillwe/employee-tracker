const inquirer = require("inquirer")
require('dotenv').config()
const mysql = require("mysql2")
const cTable = require('console.table');

const options = [
    "View all Deparments", 
    "View All Roles", 
    "View All Employees",
    "Add Department",
    "Add Role",
    "Add Employee",
    "Update Employee Role",
    "Quit",
];

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
});

doMainPrompt();

function doMainPrompt() {
inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: options
    }
])
.then(answers => {
    switch(answers.choice) {
        case options[0]:
            viewAll("Department");
            break;

        case options[1]:
            viewAll("Role");
            break;
        
        case options[2]:
            viewAll("Employee");
            break;

        case options[3]:
            addDepartment();
            break;

        case options[4]:
            addRole();
            break;

        case options[5]:
            addEmployees();
            break;

        case options[6]:
            updateEmployeeRole();
            break;

        case options[7]:
            process.exit();
    }
});
}

function viewAll(tableName) {
    const query = "SELECT * FROM " + tableName;
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("\n" + tableName + "s");
        console.table(res);
        doMainPrompt();
    });
}

function addDepartment() {

}

function addRole() {

}

function addEmployees() {

}

function updateEmployeeRole() {

}
