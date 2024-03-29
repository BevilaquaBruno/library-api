/* Create Database */
CREATE DATABASE IF NOT EXISTS bevilaqualibrary;
USE bevilaqualibrary;

/* Tables */
CREATE TABLE IF NOT EXISTS person (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  birth_date DATE,
  cpf VARCHAR(14),
  address VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS user (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(100)
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

CREATE TABLE IF NOT EXISTS author (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  fullName VARCHAR(150),
  birth_date DATE,
  death_date DATE,
  born_place VARCHAR(100),
  death_place VARCHAR(100),
  born_country_id INT,
  death_country_id INT
);

CREATE TABLE IF NOT EXISTS book (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  volumn INT,
  number_pages INT,
  edition INT,
  release_year INT,
  author_obs VARCHAR(200),
  obs VARCHAR(200),
  isbn VARCHAR(13),
  publisher_id INT,
  style_id INT,
  genre_id INT,
  idiom_id INT
);

CREATE TABLE IF NOT EXISTS book_copy (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  description VARCHAR(200) NOT NULL,
  buy_or_gift CHAR(1) NOT NULL DEFAULT "B",
  buy_or_gift_date DATE,
  obs VARCHAR(200),
  photo VARCHAR(30),
  receiver_person_id INT NOT NULL,
  book_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS book_author (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	author_id INT,
	book_id INT
);

CREATE TABLE IF NOT EXISTS book_comment (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	description TEXT,
	vote BOOLEAN,
	visible BOOLEAN,
	book_id INT NOT NULL,
	person_id INT
);

CREATE TABLE IF NOT EXISTS loan (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	description VARCHAR(100),
	loan_code VARCHAR(50),
	loan_date DATE DEFAULT NOW(),
	return_date DATE,
	must_return_date DATE,
	user_id INT NOT NULL,
	book_copy_id INT NOT NULL,
	person_id INT NOT NULL
);

/* Foreign Keys */
ALTER TABLE publisher ADD CONSTRAINT fk_publisher_country_id FOREIGN KEY (country_id ) REFERENCES country(id);

ALTER TABLE author ADD CONSTRAINT fk_author_born_country_id FOREIGN KEY (born_country_id) REFERENCES country(id);
ALTER TABLE author ADD CONSTRAINT fk_author_death_country_id FOREIGN KEY (death_country_id) REFERENCES country(id);

ALTER TABLE book ADD CONSTRAINT fk_book_publisher_id FOREIGN KEY (publisher_id) REFERENCES publisher(id);
ALTER TABLE book ADD CONSTRAINT fk_book_style_id FOREIGN KEY (style_id) REFERENCES style(id);
ALTER TABLE book ADD CONSTRAINT fk_book_genre_id FOREIGN KEY (genre_id) REFERENCES genre(id);
ALTER TABLE book ADD CONSTRAINT fk_book_idiom_id FOREIGN KEY (idiom_id) REFERENCES idiom(id);

ALTER TABLE book_copy ADD CONSTRAINT fk_book_copy_receiver_person_id FOREIGN KEY (receiver_person_id) REFERENCES person(id);
ALTER TABLE book_copy ADD CONSTRAINT fk_book_copy_book_id FOREIGN KEY (book_id) REFERENCES person(id) ON DELETE CASCADE;

ALTER TABLE book_author ADD CONSTRAINT fk_book_author_author FOREIGN KEY (author_id) REFERENCES author(id);
ALTER TABLE book_author ADD CONSTRAINT fk_book_author_book FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE;

ALTER TABLE book_comment ADD CONSTRAINT fk_book_comment_book FOREIGN KEY (book_id) REFERENCES book(id);
ALTER TABLE book_comment ADD CONSTRAINT fk_book_comment_person FOREIGN KEY (person_id) REFERENCES person(id);

ALTER TABLE loan ADD CONSTRAINT fk_loan_user FOREIGN KEY (user_id) REFERENCES user(id);
ALTER TABLE loan ADD CONSTRAINT fk_loan_book_copy FOREIGN KEY (book_copy_id) REFERENCES book_copy(id);
ALTER TABLE loan ADD CONSTRAINT fk_loan_person FOREIGN KEY (person_id) REFERENCES person(id);

/* PRIMARY INSERTS*/
INSERT INTO person(id, name, email, phone, birth_date, cpf) VALUES (1, "Bruno Fernando Bevilaqua", "bbbevilaqua2@gmail.com", "5549998320023", "2000-03-05", "103.411.729-79");

INSERT INTO user(id, name, username, email, password) VALUES (1, "Bruno Fernando Bevilaqua", "bevilaqua", "bbbevilaqua@gmail.com", MD5("123"));

INSERT INTO country(id, name, fullname, short, flag) VALUES (1, "Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png");

INSERT INTO genre(id, description) VALUES (1, "Romance");

INSERT INTO style(id, description) VALUES (1, "Livro");

INSERT INTO idiom(id, description) VALUES (1, "Português Brasileiro");

INSERT INTO publisher (id, name, country_id) VALUES (1, "Companhia das Letras", 1);

INSERT INTO author (id, name, fullName, birth_date, death_date, born_place, death_place, born_country_id, death_country_id) VALUES (
  1, "Machado de Assis", "Joaquim Maria Machado de Assis", "1839-06-21", "1908-09-29", "Rio de Janeiro, Rio de Janeiro",
  "Rio de Janeiro, Rio de Janeiro", 1, 1);

INSERT INTO book(id, name, volumn, number_pages, edition, release_year, author_obs, obs, isbn, publisher_id, style_id, genre_id, idiom_id) VALUES (
  1, "Dom Casmurro", 1, 213, 7, 2000, "", "Parte da Coleção A obra prima de cada autor - Nº 200", "8572322647", 1, 1, 1, 1);

INSERT INTO book_author(id, author_id, book_id) VALUES (1, 1, 1);

INSERT INTO book_copy (id, description, buy_or_gift, buy_or_gift_date, obs, photo, receiver_person_id, book_id) VALUES (
  1, "Dom Casmurro - Machado de Assis - A obra prima de cada autor", "G", "2010-07-14",
  "Presente da Salete Bevilaqua com dedicatória na contra capa", null, 1, 1);

INSERT INTO book_comment(id, description, vote, visible, book_id, person_id)
	VALUES(1, 'Bom livro', TRUE, TRUE, 1, 1);

INSERT INTO loan(id, description, loan_code, loan_date, return_date, must_return_date, user_id, book_copy_id, person_id)
	VALUES(1, 'Emprestado para mostrar para o filho', 'empfilho1', '2022-05-05', NULL, '2022-05-20', 1, 1, 1);
