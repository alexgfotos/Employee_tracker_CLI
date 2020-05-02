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
  database: "employeeDB"
});

// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================

require("./routes/apiRoutes")(app, connection);
require("./routes/htmlRoutes")(app);

// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================


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
 
  if (answers.main === "View Employees") {
    // showEmployees();
    continuePrompt();

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
