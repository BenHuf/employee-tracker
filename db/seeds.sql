INSERT INTO department(department_name)
VALUES
    ("Sales"), 
    ("Engineering"), 
    ("Finance"), 
    ("Legal");

INSERT INTO role(title, salary, department_id)
VALUES
    ("Sales Lead", 95000, 1), 
    ("Salesperson", 80000, 1), 
    ("Lead Engineer", 150000, 2), 
    ("Software Engineer", 120000, 2), 
    ("Account Manager", 160000, 3), 
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ("Karl", "Dandleton", 1, null),
    ("Mike", "Truk", 2, 1),
    ("Rey", "McSriff", 3, null),
    ("Tim", "Sandaele", 4, 3),
    ("Sleve", "McDichael", 5, null),
    ("Scott", "Dourque", 6, 5),
    ("Willie", "Dustice", 7, null),
    ("Todd", "Bonzalez", 8, 7);