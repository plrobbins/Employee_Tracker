var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require('console.table');
require('dotenv').config();



//Establish the connection to sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.PASSWORD,
  database: "employee_DB"
});

connection.connect(function (err) {
  if (err) throw err
  console.log("The Employee Tracker")
  console.log("")
  start();
});

//Beginning prompt
function start() {
  inquirer.prompt({
    name: "userSelection",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all Employees",
      "View All Employees by Roles",
      "View All Employees by Departments",
      "View All Employees by Manager",
      "Add Employee",
      "Update Employee",
      "Add Role",
      "Exit"
    ]
  }).then(function (answer) {
    switch (answer.userSelection) {
      case "View all Employees":
        viewAllEmployees();
        break;

      case "View All Employees by Roles":
        viewAllRoles();
        break;

      case "View All Employees by Departments":
        viewAllDepartments();
        break;

      case "View All Employees by Manager":
        ViewByManager();
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "Update Employee":
        updateEmployee();
        break;

      case "Add Role":
        addRole();
        break; 
       
        case "Exit":
        connection.end();
        break;  


    }




  })

}

//View All Employees
function viewAllEmployees() {
  var query = "SELECT * FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(res.length + " employees found!");
    console.table('All Employees:', res);
    start()
  });
}

// //View All Roles
function viewAllRoles() {
  var query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table('All Roles:', res);
    start()
  });
}

// //All Employees by Departments
function viewAllDepartments() {
  let query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err
    console.table('All Departments:', res)
    start()
  });
}

// //All by Manager
function ViewByManager() {
  let query = "SELECT B.first_name AS manager_first, B.last_name AS manager_last from employee A, employee B where NOT A.manager_id<>B.id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table('All by Manager:', res);
    start()
  });
}

// //Add Employee
function addEmployee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    const managerList = res.map(employee => {
      return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
    })

    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the employee's first name?"
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the employee's last name?"
        },
        {
          name: "manager_id",
          type: "list",
          message: "Who is your employee's manager?",
          choices: managerList
        },
      ])
      .then(function (answer) {
        // when finished prompting, insert a new item into the db with that info
        //console.log(answer)
        connection.query(
          "INSERT INTO employee SET ?;",
          answer,
          // "ALTER TABLE employee DROP COLUMN manager VARCHAR;",
          // {
          //   first_name: answer.firstname,
          //   last_name: answer.lastname,
          //   manager: answer.manager

          // },
          function (err) {
            if (err) throw err;
            console.log("The employee record was created successfully!");
            start();
          }
        );
      });
  })

}
// //Update Employee
function updateEmployee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    const employeeList = res.map(employee => {
      return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
    })
    connection.query("SELECT * FROM role", (err, res) => {
      const roleList = res.map(role => { return { name: role.title, value: role.id } })

      inquirer.prompt([
        {
          name: "last_Name",
          type: "rawlist",
          message: "Which employee would you like to update?",
          choices: employeeList
        },
        {
          name: "role_id",
          type: "rawlist",
          message: "What is the Employees new title? ",
          choices: roleList
        },
      ]).then(function (answer) {
        //var roleId = roleList().indexOf(val.role) + 1
        connection.query("UPDATE employee SET role_id=? WHERE id=?;",
          [answer.role_id, answer.last_Name],
          function (err) {
            if (err) throw err;
            console.log("The employee record was created successfully!");
            start();
          });
      });
    })
  });

}

// //Add Role
function addRole() {
  let query = "SELECT * FROM department;"
  connection.query(query, function (err, res) {
    if (err) throw err;
    const departmentList = res.map(department => {
      return { name: department.name, value: department.id }
    })
    inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the new job Title??"
      },
      {
        name: "salary",
        type: "input",
        message: "What is the Salary?"
      },
      {
        name: "department_id",
        type: "list",
        message: "Select a department:",
        choices: departmentList
      }
    ]).then(function (answer) {
      connection.query(
        "INSERT INTO role SET ?", answer, function (error, results) {
          if (error) throw error;
          console.log("Successful insert!");
          start()
        });
     });
  })
    
  
}

