/* Create Database */
CREATE DATABASE IF NOT EXISTS bevilaqualibrary;
USE bevilaqualibrary;

/* Tables */
CREATE TABLE country (
	id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    fullName VARCHAR(100),
    short CHAR(3) NOT NULL,
    flag VARCHAR(50)
);

/* Primary Keys */
ALTER TABLE country ADD CONSTRAINT pk_country PRIMARY KEY (id)
/* Foreign Keys */