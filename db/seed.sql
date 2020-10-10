USE employeeDB;

INSERT INTO department (name)
VALUES (1, 'Sales'), (2, 'Engineering'), (3, 'Finance'), (4, 'Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1), ('Salesperson', 80000, 1), ('Lead Engineer', 150000, 2), ('Software Engineer', 120000, 2), ('Accountant', 125000, 3), ('Legal Team Lead', 250000, 4), ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Lauren', 'Meekison', 1, null), ('Paul', 'Bernard-Hall', 3, null), ('Chris', 'Nguyen', 4, 2), ('Chris', 'Pong', 6, null), ('Johnny', 'Bodenbach', 2, 1), ('Leonard', 'Walter', 2, 1);