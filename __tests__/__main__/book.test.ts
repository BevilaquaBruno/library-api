import Author from "../../src/classes/Author.class";
import Book from "../../src/classes/Book.class";
import Country from "../../src/classes/Country.class";
import Genre from "../../src/classes/Genre.class";
import Idiom from "../../src/classes/Idiom.class";
import Publisher from "../../src/classes/Publisher.class";
import Style from "../../src/classes/Style.class";
import { AuthorDataInterfaces } from "../../src/interfaces/Author.interface";
import { BookDataInterfaces } from "../../src/interfaces/Book.interface";
import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import BookFetch from "../__fetches__/book.fetch";

/**
 * Testing for all book routes
 */

var responseExpected: ResponseData;
// creating a temp book
var bookTest = new Book(
  "Book Test",
  1,
  100,
  1,
  2000,
  "Author obs",
  "Observação",
  "1234567891011",
  2
);
bookTest.genre = new Genre("Romance", 1);
bookTest.style = new Style("Livro", 1);
bookTest.idiom = new Idiom("Português Brasileiro", 1);
bookTest.authors = [
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
bookTest.publisher = new Publisher(
  "Companhia das Letras",
  new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
  1
);

// the expected from Dom Casmurro book
const domCasmurroExpected: Book = new Book(
  "Dom Casmurro",
  1,
  213,
  7,
  2000,
  "",
  "Parte da Coleção A obra prima de cada autor - Nº 200",
  "8572322647",
  1
);
domCasmurroExpected.genre = new Genre("Romance", 1);
domCasmurroExpected.style = new Style("Livro", 1);
domCasmurroExpected.idiom = new Idiom("Português Brasileiro", 1);
domCasmurroExpected.authors = [
  new Author(
    "Machado de Assis",
    "Joaquim Maria Machado de Assis",
    "1839-06-21",
    "1908-09-29",
    "Rio de Janeiro, Rio de Janeiro",
    "Rio de Janeiro, Rio de Janeiro",
    new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png"),
    new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png")
  ),
];
domCasmurroExpected.publisher = new Publisher(
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
        message: "Livro cadastrado",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;
    //2. executes url
    const response: ResponseData = (await BookFetch.create(token, bookTest)).data;

    //3. set the id to test publisher
    bookTest.id = response.data.id;
    responseExpected.data = bookTest.toJson();
    //4. validate expected result
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing update route
   */
  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "Livro atualizado" },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. update publisher data
    bookTest.name = "Book Test name updated";

    responseExpected.data = bookTest.toJson();
    //3. execute url
    const response: ResponseData = (await BookFetch.update(token, bookTest)).data;

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
        message: "Livro encontrado",
      },
    };
    //1. executes url and create a new country
    const responseDomCasmurro: ResponseData = (await BookFetch.findById(domCasmurroExpected.id))
      .data;
    let domCasmurro: Book = new Book(
      responseDomCasmurro.data.name,
      responseDomCasmurro.data.volumn,
      responseDomCasmurro.data.number_pages,
      responseDomCasmurro.data.edition,
      responseDomCasmurro.data.release_year,
      responseDomCasmurro.data.author_obs,
      responseDomCasmurro.data.obs,
      responseDomCasmurro.data.isbn,
      responseDomCasmurro.data.id
    );

    domCasmurro.genre = new Genre(
      responseDomCasmurro.data.genre.description,
      responseDomCasmurro.data.genre.id
    );
    domCasmurro.idiom = new Idiom(
      responseDomCasmurro.data.idiom.description,
      responseDomCasmurro.data.idiom.id
    );
    domCasmurro.style = new Style(
      responseDomCasmurro.data.style.description,
      responseDomCasmurro.data.style.id
    );
    domCasmurro.publisher = new Publisher(
      responseDomCasmurro.data.publisher.name,
      new Country(
        responseDomCasmurro.data.publisher.country.name,
        responseDomCasmurro.data.publisher.country.fullName,
        responseDomCasmurro.data.publisher.country.short,
        responseDomCasmurro.data.publisher.country.flag,
        responseDomCasmurro.data.publisher.country.id
      ),
      responseDomCasmurro.data.publisher.id
    );
    if (null !== responseDomCasmurro.data.authors) {
      domCasmurro.authors = [];
      responseDomCasmurro.data.authors.forEach((author: AuthorDataInterfaces) => {
        domCasmurro.authors?.push(
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
      domCasmurro.authors = responseDomCasmurro.data.authors;
    }

    //2. validate the expected companhia das letras
    expect(responseDomCasmurro.status).toEqual(responseExpected.status);
    expect(domCasmurro).toEqual(domCasmurro);
  });

  /**
   * Testing find all route
   */
  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos os livros",
      },
    };
    //1. execute url
    const response: ResponseData = (await BookFetch.findAll()).data;
    //2. validate status and number of countries
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

    //3. find Brasil in list and validate him
    response.data.forEach((currentBook: BookDataInterfaces) => {
      if (1 === currentBook.id) {
        let domCasmurro: Book = new Book(
          currentBook.name,
          currentBook.volumn,
          currentBook.number_pages,
          currentBook.edition,
          currentBook.release_year,
          currentBook.author_obs,
          currentBook.obs,
          currentBook.isbn,
          currentBook.id
        );

        domCasmurro.genre = currentBook.genre === null ? null : new Genre(currentBook.genre.description, currentBook.genre.id);
        domCasmurro.idiom = currentBook.idiom === null ? null : new Idiom(currentBook.idiom.description, currentBook.idiom.id);
        domCasmurro.style = currentBook.style === null ? null : new Style(currentBook.style.description, currentBook.style.id);
        domCasmurro.publisher = currentBook.publisher === null ? null : new Publisher(
          currentBook.publisher.name,
          new Country(
            currentBook.publisher.country.name,
            currentBook.publisher.country.fullName,
            currentBook.publisher.country.short,
            currentBook.publisher.country.flag,
            currentBook.publisher.country.id
          ),
          currentBook.publisher.id
        );
        if (null !== currentBook.authors) {
          let authors: Author[] = [];
          currentBook.authors.forEach((author: AuthorDataInterfaces) => {
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
          domCasmurro.authors = authors;
        } else {
          domCasmurro.authors = currentBook.authors;
        }
        expect(domCasmurro).toEqual(domCasmurroExpected);
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
        message: "Livro removido",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url
    const response: ResponseData = (await BookFetch.delete(token, bookTest.id)).data;
    //3. validate expetected response
    expect(response).toEqual(responseExpected);
  });
});
