/* Create Database */
CREATE DATABASE IF NOT EXISTS bevilaqualibrary;
USE bevilaqualibrary;

/* Tables */
CREATE TABLE country (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    fullName VARCHAR(100),
    short CHAR(3) NOT NULL,
    flag VARCHAR(50)
);

/* Foreign Keys */

