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
  username varchar(20) NOT NULL UNIQUE,
  password varchar(100),
  person_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS person (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(30) NOT NULL,
  birth_date DATETIME,
  death_date DATETIME,
  spouse VARCHAR(100),
  pseudonym_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS pseudonym (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  description VARCHAR(50)
);

/* Foreign Keys */
ALTER TABLE user ADD CONSTRAINT fk_user_person_id FOREIGN KEY (person_id) REFERENCES person(id);

ALTER TABLE person ADD CONSTRAINT fk_person_pseudonym_id FOREIGN KEY (pseudonym_id) REFERENCES pseudonym(id);

/* PRIMARY INSERTS*/
INSERT INTO country(name, fullname, short, flag, id) VALUES ("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1);

INSERT INTO person (name, phone, email, birth_date) VALUES ("Bruno Fernando Bevilaqua", "5549998320023", 2000-03-05);

INSERT INTO user(id_pessoa, username, password) VALUES (1, "bevilaqua", MD5("123"));
