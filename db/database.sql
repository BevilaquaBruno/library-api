/* Create Database */
CREATE DATABASE IF NOT EXISTS bevilaqualibrary;
USE bevilaqualibrary;

/* Tables */
CREATE TABLE IF NOT EXISTS person (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(30) NOT NULL,
  phone VARCHAR(20),
  birth_date DATE,
  cpf VARCHAR(14) UNIQUE,
  address VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS user (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username varchar(20) NOT NULL UNIQUE,
  password varchar(100),
  person_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS country (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  fullName VARCHAR(100),
  short CHAR(3) NOT NULL,
  flag VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS genre (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  description VARCHAR(50) NOT NULL
);

/* The name of this table must be type, but type is reserved in mysql, so i decide to use style */
CREATE TABLE IF NOT EXISTS style (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  description VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS idiom (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  description VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS publisher (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  country_id INT NOT NULL
);

/* Foreign Keys */
ALTER TABLE user ADD CONSTRAINT fk_user_person_id FOREIGN KEY (person_id) REFERENCES person(id);

ALTER TABLE publisher ADD CONSTRAINT fk_publisher_country_id FOREIGN KEY (country_id ) REFERENCES country(id);

/* PRIMARY INSERTS*/
INSERT INTO country(id, name, fullname, short, flag, id) VALUES (1, "Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1);

INSERT INTO person (id, name, phone, email, birth_date, cpf) VALUES (1, "Bruno Fernando Bevilaqua", "5549998320023", 2000-03-05, "103.411.729-79");

INSERT INTO user(id, id_pessoa, username, password) VALUES (1, 1, "bevilaqua", MD5("123"));

INSERT INTO genre(id, description) VALUES (1, "Action");

INSERT INTO style(id, description) VALUES (1, "Book");

INSERT INTO publisher (id, name, country_id) VALUES (1, "Companhia das Letras", 1);
