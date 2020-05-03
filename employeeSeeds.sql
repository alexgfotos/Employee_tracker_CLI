DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;
CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);
CREATE TABLE role (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);
CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id),
  manager_id INT UNSIGNED,
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
VALUES ("Management"), ("Engineers"), ("Workers");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 100000, 1), ("Manager", 70000, 1), ("Engineer", 75000, 2), ("Associate", 35000, 3), ("Intern", 5, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alex", "Gee", 5, NULL);




