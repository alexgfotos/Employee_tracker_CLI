const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer")

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Create a connection to the DB
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "burger12?",
  database: "employees"
});


require("./routes/apiRoutes")(app, connection);
require("./routes/htmlRoutes")(app);


// function getEmployees() = connection.query("SELECT first_name, last_name, role.title FROM employee INNER JOIN role ON role_id = role.id", function (err, res) {
//   console.table(res)
// })


async function mainPrompt() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      message: "WELCOME TO EMPLOYOTRON 8000, WHAT DO YOU WISH TO EXECUTE?",
      name: "main",
      choices: ["Employees", "Roles", "Managers", "ABORT"]
    }

  ])

  if (answers.main === "ABORT") {
    console.log("ABORTED SUCCESSFULLY")
  }
  console.log(answers)

  if (answers.main === "Employees") {
    // showEmployees();
    employeePrompt();

  }

}



async function continuePrompt() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      message: "ARE YOU DONE WITH EMPLOYOTRON?",
      name: "continue",
      choices: ["yes", "no"]
    }

  ])

  if (answers.continue === "yes") {
    console.log("FAREWELL MEATBAG")
  }
  else {
    mainPrompt()
  }
}

async function employeePrompt() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      message: "What would like to do with Employees?",
      name: "employeePrompt",
      choices: ["View All", "Add", "Edit", "Delete", "ABORT"]
    }

  ])

  if (answers.employeePrompt === "ABORT") {
    console.log("ABORTING!");
    continuePrompt()
  }

  if (answers.employeePrompt === "View All") {
    console.log("Generating Employee Table...");
    viewEmployees();
  };

  if (answers.employeePrompt === "Add") {
    addEmployee();
  };
}

async function addEmployee() {
  console.log("ADD AN EMPLOYEE")
  const answers = await inquirer.prompt([
    {
      type: "input",
      message: "What is the employee's first name?",
      name: "first_name",
      
    },
    {
      type: "input",
      message: "What is the employee's name?",
      name: "last_name",
      
    },
    {
      type: "list",
      message: "What is the employee's role?",
      name: "role",
      choices: ["Presidente", "Boss Man", "Tinkerer", "Grunt", "Punching Bag"]
    }

  ])
  if (answers.role === "Presidente"){
    answers.role = 1
  }
  if (answers.role === "Boss Man"){
    answers.role = 2
  }
  if (answers.role === "Tinkerer"){
    answers.role = 3
  }
  if (answers.role === "Grunt"){
    answers.role = 4
  }
  if (answers.role === "Punching Bag"){
    answers.role = 5
  }
  writeEmployee(answers)
}

async function writeEmployee(answers) {
  connection.query("INSERT INTO employees (employee) VALUES (?)", [answers.first_name, answers.last_name, answers.role, "NULL"], function(err, data) {
    if (err) {
      console.log("somethings up...");
    }

    console.log(answers.first_name + " added!");
  });
}

async function viewEmployees() {
  connection.query("SELECT * FROM employee;", function (err, data) {
    if (err) {
      console.log("HELP EMPLOYOTRON");
    }

    console.table(data);
  })
}

mainPrompt()


// Initiates the connection to the DB
// =============================================================
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);

  // Starts the server to begin listening
  // =============================================================
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});
