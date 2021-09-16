/* Create Database */
CREATE DATABASE IF NOT EXISTS bevilaqualibrary;
USE bevilaqualibrary;

/* Tables */
CREATE TABLE IF NOT EXISTS country (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  fullName VARCHAR(100),
  short CHAR(3) NOT NULL,
  flag VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS user (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  username varchar(20) NOT NULL UNIQUE,
  email varchar(50) NOT NULL,
  password varchar(100)
);


/* PRIMARY INSERTS*/
INSERT INTO country(name, fullname, short, flag, id) VALUES ("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1);

INSERT INTO user(name, username, email, password) VALUES ("Bruno Fernando Bevilaqua", "bevilaqua", "bbbevilaqua@gmail.com", MD5("123"));
