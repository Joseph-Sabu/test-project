USE NetworkDiagramDB;  -- Switch to the database you created

-- Create table for Servers
CREATE TABLE Servers (
   id INT PRIMARY KEY IDENTITY(1,1),
   name NVARCHAR(100),
   ip_address NVARCHAR(15)
);

-- Create table for Firewalls
CREATE TABLE Firewalls (
   id INT PRIMARY KEY IDENTITY(1,1),
   name NVARCHAR(100),
   ip_address NVARCHAR(15)
);

-- Example of a dynamic connection table for devices
CREATE TABLE connection_table_example (
   id INT PRIMARY KEY IDENTITY(1,1),
   device1_name NVARCHAR(100),
   device1_ip NVARCHAR(15),
   device2_name NVARCHAR(100),
   device2_ip NVARCHAR(15)
);

SELECT * FROM Servers;
SELECT * FROM Firewalls;
SELECT * FROM connection_table_example;