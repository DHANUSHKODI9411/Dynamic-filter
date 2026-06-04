
CREATE DATABASE FilterDB;

create table cars(
    Id int primary key,
    Brand varchar(255),
    Model varchar(255),
    Year int,
    FuelType varchar(255),
    transmission varchar(255),
    price int,
    color varchar(255),
    mileage int,
    seating_capacity int,

)

select * from cars;
-- value for cars talbe
INSERT INTO Cars VALUES
(1, 'Toyota', 'Camry', 2022, 'Petrol', 'Automatic', 3500000, 'Black', 18, 5),
(2, 'Honda', 'Civic', 2023, 'Petrol', 'Manual', 3200000, 'White', 17, 5),
(3, 'Tesla', 'Model 3', 2023, 'Electric', 'Automatic', 6000000, 'Red', 0, 5),
(4, 'BMW', 'X5', 2021, 'Diesel', 'Automatic', 7500000, 'Blue', 12, 5),
(5, 'Audi', 'A6', 2022, 'Petrol', 'Automatic', 6800000, 'Grey', 14, 5),
(6, 'Hyundai', 'Creta', 2021, 'Diesel', 'Manual', 2800000, 'Silver', 19, 5),
(7, 'Kia', 'Sonet', 2022, 'Petrol', 'Automatic', 2600000, 'Red', 18, 5),
(8, 'Mahindra', 'XUV700', 2023, 'Diesel', 'Automatic', 3200000, 'White', 15, 7),
(9, 'Tata', 'Nexon', 2021, 'Electric', 'Automatic', 3000000, 'Blue', 0, 5),
(10, 'Skoda', 'Octavia', 2022, 'Petrol', 'Automatic', 4500000, 'Grey', 14, 5);

-- table for e-commerce products
CREATE TABLE Ecommerce (
    OrderId VARCHAR(20) PRIMARY KEY,
    Customer VARCHAR(50),
    Product VARCHAR(50),
    Quantity INT,
    Price INT,
    Status VARCHAR(50)
);
-- value for ecommerce table

INSERT INTO Ecommerce VALUES
('ORD1001', 'Rahul', 'Laptop', 1, 75000, 'Shipped'),
('ORD1002', 'Neha', 'Phone', 2, 40000, 'Delivered'),
('ORD1003', 'Amit', 'Headphones', 3, 6000, 'Pending'),
('ORD1004', 'Pooja', 'Tablet', 1, 30000, 'Delivered'),
('ORD1005', 'Kiran', 'Camera', 1, 50000, 'Shipped'),
('ORD1006', 'Lavanya', 'Watch', 2, 8000, 'Cancelled'),
('ORD1007', 'Manoj', 'Keyboard', 1, 2000, 'Delivered'),
('ORD1008', 'Deepa', 'Mouse', 2, 1500, 'Pending'),
('ORD1009', 'Arvind', 'Monitor', 1, 12000, 'Shipped'),
('ORD1010', 'Swathi', 'Printer', 1, 9000, 'Delivered');

select * from Ecommerce;

-- table for employee details
CREATE TABLE Employee (
    Id INT PRIMARY KEY,
    Name VARCHAR(50),
    Department VARCHAR(50),
    Salary INT
);
-- value for employee table
INSERT INTO Employee VALUES
(1, 'Arun', 'HR', 35000),
(2, 'Priya', 'Finance', 42000),
(3, 'Karthik', 'IT', 55000),
(4, 'Sneha', 'Admin', 30000),
(5, 'Vijay', 'IT', 60000),
(6, 'Divya', 'HR', 37000),
(7, 'Ravi', 'Finance', 48000),
(8, 'Meena', 'Admin', 32000),
(9, 'Suresh', 'IT', 65000),
(10, 'Anita', 'HR', 39000);
select * from Employee;

-- table for libray 
CREATE TABLE Library (
    BookID INT PRIMARY KEY,
    Title VARCHAR(255),
    Author VARCHAR(255),
    Availability VARCHAR(50)
);
-- value for library table
INSERT INTO Library VALUES
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Available'),
(2, 'To Kill a Mockingbird', 'Harper Lee', 'Checked Out'),
(3, '1984', 'George Orwell', 'Available'),
(4, 'Pride and Prejudice', 'Jane Austen', 'Available'),
(5, 'The Catcher in the Rye', 'J.D. Salinger', 'Checked Out'),
(6, 'Moby Dick', 'Herman Melville', 'Available'),
(7, 'War and Peace', 'Leo Tolstoy', 'Available'),
(8, 'The Hobbit', 'J.R.R. Tolkien', 'Checked Out'),
(9, 'Brave New World', 'Aldous Huxley', 'Available'),
(10, 'Crime and Punishment', 'Fyodor Dostoevsky', 'Available'),
(11, 'The Alchemist', 'Paulo Coelho', 'Checked Out'),
(12, 'The Lord of the Rings', 'J.R.R. Tolkien', 'Available'),
(13, 'Jane Eyre', 'Charlotte Brontë', 'Available'),
(14, 'The Chronicles of Narnia', 'C.S. Lewis', 'Checked Out'),
(15, 'Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Available');
SELECT * FROM Library;