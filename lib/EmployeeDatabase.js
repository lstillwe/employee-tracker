const mysql = require("mysql2")
const cTable = require('console.table');

class EmployeeDatabase {

    constructor() {

        // get db connect credentials from .env file
        // and save as member variables

        // auto connect
        this.connection = mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "password",
            database: "employee_trackerDB"
          });
    }


    getAllDepartment() {

    }

    getAllRoles() {

    }

    getAllEmployees() {

    }

    addDepartment(name) {

    }

    addRole(title, salary, department_id) {

    }

    addEmployee(first_name, last_name, role_id, manager_id) {

    }

    updateEmployeeRole(employee_id, role_id) {
        
    }

}