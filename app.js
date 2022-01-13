const inquirer = require("inquirer")
const cTable = require('console.table');
const EmployeeDatabase = require('./lib/EmployeeDatabase');

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

// create instance of the EmployeeDatabase class
const db = new EmployeeDatabase();

doMainPrompt();

// use inquirer to do the main prompt request
async function doMainPrompt() {

    answers = await inquirer.prompt([
        {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: options
        }
    ]);
        
    switch(answers.choice) {
        case options[0]:
            viewDepartments();
            break;

        case options[1]:
            viewRoles();
            break;
        
        case options[2]:
            viewEmployees();
            break;

        case options[3]:
            addDepartment();
            break;

        case options[4]:
            addRole();
            break;

        case options[5]:
            addEmployee();
            break;

        case options[6]:
            updateEmployeeRole();
            break;

        case options[7]:
            await db.close();
            process.exit();
        }
}

// view employee_db department table
async function viewDepartments() {
    const sql = "SELECT * FROM  department";
    res = await db.query(sql);
    console.log("\nDepartments");
    console.table(res);
    doMainPrompt();
}

// view employee_db role table
// join department table
async function viewRoles() {
    const sql = "SELECT role.id, role.title, role.salary, department.name AS department_name FROM role INNER JOIN department ON role.department_id=department.id";
    res = await db.query(sql);
    console.log("\nRoles");
    console.table(res);
    doMainPrompt();
}

// view employee_db employ table
// join role and department tables
async function viewEmployees() {
    const sql = "select emp.id, emp.first_name, emp.last_name, role.title as job_title, department.name as department_name, role.salary as salary, emp.manager_id from employee as emp inner join role on emp.role_id=role.id inner join department on role.department_id=department.id";
    res = await db.query(sql);
    console.log("\nEmployees");
    console.table(res);
    doMainPrompt();
}

// add a new department to the employee_db
async function addDepartment() {
    const answers = await inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "Enter Department name:",
          validate: (name) => { return name != "" }
        }
    ]);
    const sql = "INSERT INTO department SET ?";
    await db.query(sql,
        {
            name: answers.name
        }
    );
    console.log("\nAdded department " + answers.name + " to the database\n");
    doMainPrompt();
}

// add a new role to the employee_db
async function addRole() {

    const departments = await db.query(`SELECT id, name FROM department`);
    const dept_list = departments.map(function (el) { return el.name; });

    const answers = await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter Role name:",
            validate: (name) => { return name != "" }
        },
        {
            name: "salary",
            type: "input",
            message: "Enter salary:",
            validate(answer) {
                salaryRegex = /^[$]?\d[\d,]*$/
                if(!salaryRegex.test(answer)) {
                    return "Not a valid salary!";
                }
                return true;
            }   
        },
        {
            name: "choice",
            type: "list",
            message: "Enter a department for this role:",
            choices: dept_list
        }
    ]);
    const sql = "INSERT INTO role SET ?";
    await db.query(sql,
        {
            title: answers.name,
            salary: parseFloat(answers.salary),
            department_id : getRecordId(departments, "name", answers.choice)
        }
    );
    console.log("\nAdded role " + answers.name + " to the database\n");
    doMainPrompt();
}

// add a new employee to the employee_db
async function addEmployee() {

    const roles = await db.query(`SELECT id, title FROM role`);
    const role_list = roles.map(function (el) { return el.title; });

    const employees = await db.query(`SELECT id, concat(first_name, " ", last_name) as name FROM employee`)
    var employee_list = employees.map(function (el) { return el.name; });
    employee_list.push("None");
     
    const answers = await inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter the Employee's first name:",
            validate: (firstname) => { return firstname != "" }
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter the Employee's last name:",
            validate: (lastname) => { return lastname != "" }
        },
        {
            type: "list",
            message: "Select the Employee's role:",
            name: "role_choice",
            choices: role_list
        },
        {
            type: "list",
            message: "Select the Employee's manager:",
            name: "manager_choice",
            choices: employee_list
        }
    ]);
    
    const sql = "INSERT INTO employee SET ?";

    let manager_id = null;
    if (answers.manager_choice != "None") {
        manager_id = getRecordId(employees, "name", answers.manager_choice);
    }      
                
    await db.query(sql,
        {
            first_name: answers.firstname,
            last_name: answers.lastname,
            role_id : getRecordId(roles, "title", answers.role_choice),
            manager_id : manager_id
        }
    );
    console.log("\nAdded Employee " + answers.first_name +  " " + answers.last_name + " to the database\n");
    doMainPrompt();
}

// update an employee's role in the employee_db
async function updateEmployeeRole() {

    const roles = await db.query(`SELECT id, title FROM role`);
    const role_list = roles.map(function (el) { return el.title; });

    const employees = await db.query(`SELECT id, concat(first_name, " ", last_name) as name FROM employee`);
    const employee_list = employees.map(function (el) { return el.name; });
     
    const answers = await inquirer.prompt([
        {
            type: "list",
            message: "Select the Employee's to update:",
            name: "employee_choice",
            choices: employee_list
        },
        {
            type: "list",
            message: "Select the Employee's new role:",
            name: "role_choice",
            choices: role_list
        }
    ]);

    const sql = "UPDATE employee SET role_id=? WHERE id=?";
          
    await db.query(sql,
        [
            getRecordId(roles, "title", answers.role_choice),
            getRecordId(employees, "name", answers.employee_choice)
        ]
    );
    console.log("\nUpdated Employee " + answers.employee_choice +  " with Role " + answers.role_choice + "\n");
    doMainPrompt();
}

// given an array of objects, find the id key value of the object
// by provided key (search_key) and the value of that key to search for (search_val)
// THE OBJECTS IN THE object_array MUST CONTAIN an id key:value pair
function getRecordId(object_array, search_key, search_val) {

    record_id = null;

    for(let i=0; i<object_array.length; i++) {
        if (object_array[i][search_key] === search_val) {
            record_id = object_array[i].id;
            break;
        }
    }

    return record_id;
}
