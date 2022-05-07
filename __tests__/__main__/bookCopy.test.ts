import Author from "../../src/classes/Author.class";
import Book from "../../src/classes/Book.class";
import BookCopy from "../../src/classes/BookCopy.class";
import Country from "../../src/classes/Country.class";
import Genre from "../../src/classes/Genre.class";
import Idiom from "../../src/classes/Idiom.class";
import Person from "../../src/classes/Person.class";
import Publisher from "../../src/classes/Publisher.class";
import Style from "../../src/classes/Style.class";
import { AuthorDataInterfaces } from "../../src/interfaces/Author.interface";
import { BookDataInterfaces } from "../../src/interfaces/Book.interface";
import { BookCopyDataInterfaces } from "../../src/interfaces/BookCopy.interface";
import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import BookFetch from "../__fetches__/book.fetch";
import BookCopyFetch from "../__fetches__/bookCopy.fetch";

/**
 * Testing for all book routes
 */

var responseExpected: ResponseData;
// creating a temp book
var bookCopyTest = new BookCopy(
  "Edition description",
  "B",
  "2022-01-01",
  "obs obs obs",
  new Person(
    "Bruno Fernando Bevilaqua",
    "bbbevilaqua2@gmail.com",
    "5549998320023",
    "2000-03-05",
    "103.411.729-79",
    null, null, null,
    1
  ),
  new Book(
    "Dom Casmurro",
    1,
    213,
    7,
    2000,
    null,
    "Parte da Coleção A obra prima de cada autor - Nº 200",
    "8572322647",
    1
  ),
  "photo.png",
  2
);
bookCopyTest.book.genre = new Genre("Romance", 1);
bookCopyTest.book.style = new Style("Livro", 1);
bookCopyTest.book.idiom = new Idiom("Português Brasileiro", 1);
bookCopyTest.book.authors = [
  new Author(
    "Machado de Assis",
    "Joaquim Maria Machado de Assis",
    "1839-06-21",
    "1908-09-29",
    "Rio de Janeiro, Rio de Janeiro",
    "Rio de Janeiro, Rio de Janeiro",
    new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
    new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
    1
  ),
];
bookCopyTest.book.publisher = new Publisher(
  "Companhia das Letras",
  new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
  1
);

// the expected from Dom Casmurro book
var domCasmurroCopyExpected = new BookCopy(
  "Dom Casmurro - Machado de Assis - A obra prima de cada autor",
  "G",
  "2010-07-14",
  "Presente da Salete Bevilaqua com dedicatória na contra capa",
  new Person(
    "Bruno Fernando Bevilaqua",
    "bbbevilaqua2@gmail.com",
    "5549998320023",
    "2000-03-05",
    "103.411.729-79",
    null, null, null,
    1
  ),
  new Book(
    "Dom Casmurro",
    1,
    213,
    7,
    2000,
    null,
    "Parte da Coleção A obra prima de cada autor - Nº 200",
    "8572322647",
    1
  ),
  null,
  1
);
domCasmurroCopyExpected.book.genre = new Genre("Romance", 1);
domCasmurroCopyExpected.book.style = new Style("Livro", 1);
domCasmurroCopyExpected.book.idiom = new Idiom("Português Brasileiro", 1);
domCasmurroCopyExpected.book.authors = [
  new Author(
    "Machado de Assis",
    "Joaquim Maria Machado de Assis",
    "1839-06-21",
    "1908-09-29",
    "Rio de Janeiro, Rio de Janeiro",
    "Rio de Janeiro, Rio de Janeiro",
    new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
    new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
    1
  ),
];
domCasmurroCopyExpected.book.publisher = new Publisher(
  "Companhia das Letras",
  new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
  1
);

describe("Testing Book", () => {
  /**
   * Testing book route
   */
  it("Create", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Edição do livro cadastrada",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;
    //2. executes url
    const response: ResponseData = (await BookCopyFetch.create(token, bookCopyTest)).data;

    //3. set the id to test publisher
    bookCopyTest.id = response.data.id;
    responseExpected.data = bookCopyTest.toJson();
    //4. validate expected result
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing update route
   */
  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "Edição do livro atualizada" },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. update publisher data
    bookCopyTest.description = "UPDATED DESCRIPTION HERE";
    bookCopyTest.buy_or_gift = "G";

    responseExpected.data = bookCopyTest.toJson();
    //3. execute url
    const response: ResponseData = (await BookCopyFetch.update(token, bookCopyTest)).data;

    //4. validate expected data
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing find one route
   */
  it("Find one", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Edição do livro encontrado",
      },
    };
    //1. executes url and create a new country
    const responseDomCasmurroCopy: ResponseData = (await BookCopyFetch.findById(domCasmurroCopyExpected.id))
      .data;
    let domCasmurroCopy: BookCopy = new BookCopy(
      responseDomCasmurroCopy.data.description,
      responseDomCasmurroCopy.data.buy_or_gift,
      responseDomCasmurroCopy.data.buy_or_gift_date,
      responseDomCasmurroCopy.data.obs,
      new Person(
        responseDomCasmurroCopy.data.receiver_person.name,
        responseDomCasmurroCopy.data.receiver_person.email,
        responseDomCasmurroCopy.data.receiver_person.phone,
        responseDomCasmurroCopy.data.receiver_person.birth_date,
        responseDomCasmurroCopy.data.receiver_person.cpf,
        responseDomCasmurroCopy.data.receiver_person.address,
        responseDomCasmurroCopy.data.receiver_person.city,
        responseDomCasmurroCopy.data.receiver_person.state,
        responseDomCasmurroCopy.data.receiver_person.id
      ),
      new Book(
        responseDomCasmurroCopy.data.book.name,
        responseDomCasmurroCopy.data.book.volumn,
        responseDomCasmurroCopy.data.book.number_pages,
        responseDomCasmurroCopy.data.book.edition,
        responseDomCasmurroCopy.data.book.release_year,
        responseDomCasmurroCopy.data.book.author_obs,
        responseDomCasmurroCopy.data.book.obs,
        responseDomCasmurroCopy.data.book.isbn,
        responseDomCasmurroCopy.data.book.id
      ),
      responseDomCasmurroCopy.data.photo,
      responseDomCasmurroCopy.data.id
    );

    domCasmurroCopy.book.genre = new Genre(
      responseDomCasmurroCopy.data.book.genre.description,
      responseDomCasmurroCopy.data.book.genre.id
    );
    domCasmurroCopy.book.idiom = new Idiom(
      responseDomCasmurroCopy.data.book.idiom.description,
      responseDomCasmurroCopy.data.book.idiom.id
    );
    domCasmurroCopy.book.style = new Style(
      responseDomCasmurroCopy.data.book.style.description,
      responseDomCasmurroCopy.data.book.style.id
    );
    domCasmurroCopy.book.publisher = new Publisher(
      responseDomCasmurroCopy.data.book.publisher.name,
      new Country(
        responseDomCasmurroCopy.data.book.publisher.country.name,
        responseDomCasmurroCopy.data.book.publisher.country.fullName,
        responseDomCasmurroCopy.data.book.publisher.country.short,
        responseDomCasmurroCopy.data.book.publisher.country.flag,
        responseDomCasmurroCopy.data.book.publisher.country.id
      ),
      responseDomCasmurroCopy.data.book.publisher.id
    );
    if (null !== responseDomCasmurroCopy.data.book.authors) {
      domCasmurroCopy.book.authors = [];
      responseDomCasmurroCopy.data.book.authors.forEach((author: AuthorDataInterfaces) => {
        domCasmurroCopy.book.authors?.push(
          new Author(
            author.name,
            author.fullName,
            author.birth_date,
            author.death_date,
            author.born_place,
            author.death_place,
            author.born_country === null
              ? null
              : new Country(
                  author.born_country.name,
                  author.born_country.fullName,
                  author.born_country.short,
                  author.born_country.flag
                ),
            author.death_country === null
              ? null
              : new Country(
                  author.death_country.name,
                  author.death_country.fullName,
                  author.death_country.short,
                  author.death_country.flag
                )
          )
        );
      });
    } else {
      domCasmurroCopy.book.authors = responseDomCasmurroCopy.data.book.authors;
    }

    //2. validate the expected data
    expect(responseDomCasmurroCopy.status).toEqual(responseExpected.status);
    expect(domCasmurroCopy).toEqual(domCasmurroCopy);
  });

  /**
   * Testing find all route
   */
  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos as edições de livros",
      },
    };
    //1. execute url
    const response: ResponseData = (await BookCopyFetch.findAll()).data;
    //2. validate status and number of countries
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

    //3. find Brasil in list and validate him
    response.data.forEach((currentBookCopy: BookCopyDataInterfaces) => {
      if (1 === currentBookCopy.id) {

        let domCasmurroCopy: BookCopy = new BookCopy(
          currentBookCopy.description,
          currentBookCopy.buy_or_gift,
          currentBookCopy.buy_or_gift_date,
          currentBookCopy.obs,
          new Person(
            currentBookCopy.receiver_person.name,
            currentBookCopy.receiver_person.email,
            currentBookCopy.receiver_person.phone,
            currentBookCopy.receiver_person.birth_date,
            currentBookCopy.receiver_person.cpf,
            currentBookCopy.receiver_person.address,
            currentBookCopy.receiver_person.city,
            currentBookCopy.receiver_person.state,
            currentBookCopy.receiver_person.id_person,
          ),
          new Book(
            currentBookCopy.book.name,
            currentBookCopy.book.volumn,
            currentBookCopy.book.number_pages,
            currentBookCopy.book.edition,
            currentBookCopy.book.release_year,
            currentBookCopy.book.author_obs,
            currentBookCopy.book.obs,
            currentBookCopy.book.isbn,
            currentBookCopy.book.id
          ),
          currentBookCopy.photo,
          currentBookCopy.id
        );

        domCasmurroCopy.book.genre = currentBookCopy.book.genre === null ? null : new Genre(currentBookCopy.book.genre.description, currentBookCopy.book.genre.id);
        domCasmurroCopy.book.idiom = currentBookCopy.book.idiom === null ? null : new Idiom(currentBookCopy.book.idiom.description, currentBookCopy.book.idiom.id);
        domCasmurroCopy.book.style = currentBookCopy.book.style === null ? null : new Style(currentBookCopy.book.style.description, currentBookCopy.book.style.id);
        domCasmurroCopy.book.publisher = currentBookCopy.book.publisher === null ? null : new Publisher(
          currentBookCopy.book.publisher.name,
          new Country(
            currentBookCopy.book.publisher.country.name,
            currentBookCopy.book.publisher.country.fullName,
            currentBookCopy.book.publisher.country.short,
            currentBookCopy.book.publisher.country.flag,
            currentBookCopy.book.publisher.country.id
          ),
          currentBookCopy.book.publisher.id
        );
        if (null !== currentBookCopy.book.authors) {
          let authors: Author[] = [];
          currentBookCopy.book.authors.forEach((author: AuthorDataInterfaces) => {
            authors.push(
              new Author(
                author.name,
                author.fullName,
                author.birth_date,
                author.death_date,
                author.born_place,
                author.death_place,
                author.born_country === null
                  ? null
                  : new Country(
                      author.born_country.name,
                      author.born_country.fullName,
                      author.born_country.short,
                      author.born_country.flag,
                      author.born_country.id
                    ),
                author.death_country === null
                  ? null
                  : new Country(
                      author.death_country.name,
                      author.death_country.fullName,
                      author.death_country.short,
                      author.death_country.flag,
                      author.death_country.id
                    ),
                author.id
              )
            );
          });
          domCasmurroCopy.book.authors = authors;
        } else {
          domCasmurroCopy.book.authors = currentBookCopy.book.authors;
        }
        expect(domCasmurroCopy).toEqual(domCasmurroCopyExpected);
      }
    });
  });

  /**
   * Testing delete route
   */
  it("Delete", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Edição do livro removida",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url
    const response: ResponseData = (await BookCopyFetch.delete(token, bookCopyTest.id)).data;
    //3. validate expetected response
    expect(response).toEqual(responseExpected);
  });
});
