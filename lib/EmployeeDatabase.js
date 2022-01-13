const mysql = require("mysql2");
require('dotenv').config()

// class to create emploee_db connection and handle sql queries
class EmployeeDatabase {

    constructor() {
        // create db connection
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB
        });
    }

    // send db query as a promise
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err ) {
                    console.log(err.sql);
                    return reject( err );
                }
                resolve( rows );
          } );
        } );
    }

    // close employee_db connection
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end( err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

module.exports = EmployeeDatabase 