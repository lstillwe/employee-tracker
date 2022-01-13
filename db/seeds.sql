USE employee_db;

INSERT INTO department (name) 
    VALUES 
        ("Sales"),
        ("Development");


INSERT INTO role (title, salary, department_id)
    VALUES 
        ("Lead Sales", 50000.00, 1),
        ("Senior Software Developer", 70000.00, 2),
        ("Sales Manager", 85000.00, 1),
        ("Technical Manager", 87000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES
        ("Boss", "Topper", 3, NULL),
        ("Sally", "Smart", 4, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES
        ("Kim", "Turner", 1, 1),
        ("Jack", "Smith", 2, 2);