const mysql = require("mysql");
const inquirer = require("inquirer")


// "UPDATE quotes SET ? WHERE ?", [{author: kjldhfg, quote: elkfhjer}, {id: something.id}]

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

function validateNum(num) {
  var isValid = !isNaN(parseFloat(num));
  return isValid || "Entry should be a number!";
}

function employeeList(cb) {
  return connection.query("SELECT * FROM employee", cb)
}

function roleList(cb) {
  return connection.query("SELECT * FROM role", cb)
}

function departmentList(cb) {
  return connection.query("SELECT * FROM department", cb)
}

async function mainPrompt() {
  const mainPromptChoices = ["Employee", "Role", "Department", "Assign Manager", "ABORT"]
  const answers = await inquirer.prompt([
    {
      type: "list",
      message: "WELCOME TO EMPLOYOTRON 8000, WHAT DO YOU WISH TO EXECUTE?",
      name: "main",
      choices: mainPromptChoices
    }

  ])

  if (answers.main === "ABORT") {
    console.log("ABORTED SUCCESSFULLY")
  }

  if (answers.main.toLowerCase() === "employee") {
    employeePrompt();

  }

  if (answers.main.toLowerCase() === "role") {
    rolePrompt();

  }

  if (answers.main.toLowerCase() === "department") {
    departmentPrompt();

  }

  if (answers.main.toLowerCase() === "assign manager") {
    assignManager();

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
    viewAll();
  };

  if (answers.employeePrompt === "Add") {
    addEmployee();
  };

  if (answers.employeePrompt === "Delete") {
    deleteEmployee();
  };

}

async function rolePrompt() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      message: "What would like to do with roles?",
      name: "rolePrompt",
      choices: ["View All", "Add", "Edit", "Delete", "ABORT"]
    }

  ])

  if (answers.rolePrompt === "ABORT") {
    console.log("ABORTING!");
    continuePrompt()
  }

  if (answers.rolePrompt === "View All") {
    console.log("Generating Employee Table...");
    viewRoles();
  };

  if (answers.rolePrompt === "Add") {
    addRole();
  };

  if (answers.rolePrompt === "Delete") {
    deleteRole();
  };

}

async function departmentPrompt() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      message: "What would like to do with departments?",
      name: "rolePrompt",
      choices: ["View All", "Add", "Edit", "Delete", "ABORT"]
    }

  ])

  if (answers.rolePrompt === "ABORT") {
    console.log("ABORTING!");
    continuePrompt()
  }

  if (answers.rolePrompt === "View All") {
    console.log("Generating Employee Table...");
    viewDepartments();
  };

  if (answers.rolePrompt === "Add") {
    addDepartment();
  };

  if (answers.rolePrompt === "Delete") {
    deleteDepartment();
  };

}

async function addEmployee() {
  console.log("ADD AN EMPLOYEE")
  var role = roleList(async function (err1, res1) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "first_name",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "last_name",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "role_id",
        choices: res1.map(role => {
          return {
            name: role.title,
            value: role.id
          }
        })
      }
    ])
    console.log(answers);
    writeEmployee(answers)
  })
}

async function addRole() {
  console.log("ADD A ROLE")
  var role = departmentList(async function (err1, res1) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        message: "What is the title of the role?",
        name: "title",
      },
      {
        type: "input",
        message: "What is the annual salary?",
        name: "salary",
        validate: validateNum
      },
      {
        type: "list",
        message: "Which department?",
        name: "department_id",
        choices: res1.map(department => {
          return {
            name: department.name,
            value: department.id
          }
        })
      }
    ])
    console.log(answers);
    writeRole(answers)
  })

}

async function addDepartment() {
  console.log("ADD A DEPARTMENT")
  const answers = await inquirer.prompt([
    {
      type: "input",
      message: "What is the department name?",
      name: "name",
    }
  ])
  console.log(answers);
  writeDepartment(answers)
  mainPrompt()
}


async function writeEmployee(answers) {
  connection.query("INSERT INTO employee SET ?", answers, function (err, data) {
    if (err) {
      console.log("somethings up...")
      console.log(err);
    }
    console.log(answers.first_name + " added!");
  });
  mainPrompt()
}

async function writeRole(answers) {
  connection.query("INSERT INTO role SET ?", answers, function (err, data) {
    if (err) {
      console.log("somethings up...")
      console.log(err);
    }
    console.log(answers.title + " added!");
  });
  mainPrompt()
}

async function writeDepartment(answers) {
  connection.query("INSERT INTO department SET ?", answers, function (err, data) {
    if (err) {
      console.log("somethings up...")
      console.log(err);
    }
    console.log(answers.name + " added!");
  });
  mainPrompt()
}

async function deleteEmployee() {
  var emps = employeeList(async function (err1, res1) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        message: "Whose are you deleting?",
        name: "delete_employee",
        choices: res1.map(employee => {
          return {
            name: employee.first_name,
            value: employee.id
          }
        })
      }
    ])
    await connection.query("DELETE FROM employee WHERE id = ?", answers.delete_employee, function (err2, data2) {
      if (err2) {
        console.log("somethings up...")
        console.log(err2);
      }
      console.table(data2);
      console.log("deleted!");
    });
    mainPrompt()
  })
}

async function deleteRole() {
  var roles = roleList(async function (err1, res1) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        message: "Which role are you deleting?",
        name: "delete_role",
        choices: res1.map(role => {
          return {
            name: role.title,
            value: role.id
          }
        })
      }
    ])
    await connection.query("DELETE FROM role WHERE id = ?", answers.delete_role, function (err2, data2) {
      if (err2) {
        console.log("somethings up...")
        console.log(err2);
      }
      console.table(data2);
      console.log("deleted!");
    });
    mainPrompt()
  })
}

async function deleteDepartment() {
  var roles = departmentList(async function (err1, res1) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        message: "Which department are you deleting?",
        name: "delete_department",
        choices: res1.map(department => {
          return {
            name: department.name,
            value: department.id
          }
        })
      }
    ])
    await connection.query("DELETE FROM department WHERE id = ?", answers.delete_department, function (err2, data2) {
      if (err2) {
        console.log("somethings up...")
        console.log(err2);
      }
      console.log(answers.delete_department + " deleted!");
    });
    mainPrompt()
  })
}

async function viewEmployees() {
  connection.query("SELECT * FROM employee;", function (err, data) {
    if (err) {
      console.log("HELP EMPLOYOTRON");
    }

    console.table(data);
  })
  mainPrompt()
}

async function viewRoles() {
  connection.query("SELECT * FROM role;", function (err, data) {
    if (err) {
      console.log("HELP EMPLOYOTRON");
    }

    console.table(data);

  })
  mainPrompt()
}

async function viewDepartments() {
  connection.query("SELECT * FROM department;", function (err, data) {
    if (err) {
      console.log("HELP EMPLOYOTRON");
    }

    console.table(data);
  })
  mainPrompt();
}

async function viewAll() {
  connection.query("SELECT first_name, last_name, role.title FROM employee INNER JOIN role ON role_id = role.id", function (err, data) {
    if (err) {
      console.log("HELP EMPLOYOTRON");
    }

    console.table(data);
  })
  mainPrompt();
}

async function assignManager() {
  var emps = employeeList(async function (err1, res1) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        message: "Who are you assigning a manager to?",
        name: "managed",
        choices: res1.map(employee => {
          return {
            name: employee.first_name,
            value: employee.id
          }
        })
      },
      {
        type: "list",
        message: "Who is their manager?",
        name: "manager",
        choices: res1.map(employee => {
          return {
            name: employee.first_name,
            value: employee.id
          }
        })
      }
    ])
    await connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [answers.manager, answers.managed], function (err2, data2) {
      if (err2) {
        console.log("somethings up...")
        console.log(err2);
      }
      console.table(data2);
      console.log("updated!");
    });
    mainPrompt()
  })
}


mainPrompt()

