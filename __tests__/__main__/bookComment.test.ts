import Author from "../../src/classes/Author.class";
import Book from "../../src/classes/Book.class";
import BookComment from "../../src/classes/BookComment.class";
import Country from "../../src/classes/Country.class";
import Genre from "../../src/classes/Genre.class";
import Idiom from "../../src/classes/Idiom.class";
import Person from "../../src/classes/Person.class";
import Publisher from "../../src/classes/Publisher.class";
import Style from "../../src/classes/Style.class";
import { AuthorDataInterfaces } from "../../src/interfaces/Author.interface";
import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import BookCommentFetch from "../__fetches__/bookComment.fetch";

/**
 * Testing for all book routes
 */

var responseExpected: ResponseData;
// creating a temp book comment
var bookCommentTest = new BookComment(
  "Descrição do comentário",
  false,
  true,
  1
);
bookCommentTest.person = new Person(
  "Bruno Fernando Bevilaqua",
  "bbbevilaqua2@gmail.com",
  "5549998320023",
  "2000-03-05",
  "103.411.729-79",
  null, null, null,
  1
);

bookCommentTest.book = new Book(
  "Dom Casmurro",
  1,
  213,
  7,
  2000,
  null,
  "Parte da Coleção A obra prima de cada autor - Nº 200",
  "8572322647",
  1
)
bookCommentTest.book.genre = new Genre("Romance", 1);
bookCommentTest.book.style = new Style("Livro", 1);
bookCommentTest.book.idiom = new Idiom("Português Brasileiro", 1);
bookCommentTest.book.authors = [
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
bookCommentTest.book.publisher = new Publisher(
  "Companhia das Letras",
  new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
  1
);


var firstCommentExpected = new BookComment(
  "Bom Livro",
  true,
  true,
  1
);
// the expected from Dom Casmurro book
firstCommentExpected.book = new Book(
  "Dom Casmurro",
  1,
  213,
  7,
  2000,
  null,
  "Parte da Coleção A obra prima de cada autor - Nº 200",
  "8572322647",
  1
)
firstCommentExpected.book.genre = new Genre("Romance", 1);
firstCommentExpected.book.style = new Style("Livro", 1);
firstCommentExpected.book.idiom = new Idiom("Português Brasileiro", 1);
firstCommentExpected.book.authors = [
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
firstCommentExpected.book.publisher = new Publisher(
  "Companhia das Letras",
  new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
  1
);

describe("Testing Book Comment", () => {
  /**
   * Testing book comment route
   */
  it("Create", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Comentário do livro inserido",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;
    //2. executes url
    const response: ResponseData = (await BookCommentFetch.create(token, bookCommentTest)).data;

    //3. set the id to test publisher
    bookCommentTest.id = response.data.id;
    responseExpected.data = bookCommentTest.toJson();
    //4. validate expected result
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing update route
   */
  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "Comentário do livro atualizado" },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. update publisher data
    bookCommentTest.description = "UPDATED DESCRIPTION HERE";
    bookCommentTest.visible = false;

    responseExpected.data = bookCommentTest.toJson();
    //3. execute url
    const response: ResponseData = (await BookCommentFetch.update(token, bookCommentTest)).data;

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
        message: "Comentário do livro encontrado",
      },
    };
    //1. executes url and create a new country
    const responseFirstCommentCopy: ResponseData = (await BookCommentFetch.findById(firstCommentExpected.id))
      .data;
    let firstCommentCopy = new BookComment(
      responseFirstCommentCopy.data.description,
      responseFirstCommentCopy.data.vote,
      responseFirstCommentCopy.data.visible,
      responseFirstCommentCopy.data.id,
    );

    if(responseFirstCommentCopy.data.person != null){
      firstCommentCopy.person = new Person(
        responseFirstCommentCopy.data.person.name,
        responseFirstCommentCopy.data.person.email,
        responseFirstCommentCopy.data.person.phone,
        responseFirstCommentCopy.data.person.birth_date,
        responseFirstCommentCopy.data.person.cpf,
        responseFirstCommentCopy.data.person.address,
        responseFirstCommentCopy.data.person.city,
        responseFirstCommentCopy.data.person.state,
        responseFirstCommentCopy.data.person.id
      )
    }
    firstCommentCopy.book = new Book(
      responseFirstCommentCopy.data.book.name,
      responseFirstCommentCopy.data.book.volumn,
      responseFirstCommentCopy.data.book.number_pages,
      responseFirstCommentCopy.data.book.edition,
      responseFirstCommentCopy.data.book.release_year,
      responseFirstCommentCopy.data.book.author_obs,
      responseFirstCommentCopy.data.book.obs,
      responseFirstCommentCopy.data.book.isbn,
      responseFirstCommentCopy.data.book.id
    );

    firstCommentCopy.book.genre = new Genre(
      responseFirstCommentCopy.data.book.genre.description,
      responseFirstCommentCopy.data.book.genre.id
    );
    firstCommentCopy.book.idiom = new Idiom(
      responseFirstCommentCopy.data.book.idiom.description,
      responseFirstCommentCopy.data.book.idiom.id
    );
    firstCommentCopy.book.style = new Style(
      responseFirstCommentCopy.data.book.style.description,
      responseFirstCommentCopy.data.book.style.id
    );
    firstCommentCopy.book.publisher = new Publisher(
      responseFirstCommentCopy.data.book.publisher.name,
      new Country(
        responseFirstCommentCopy.data.book.publisher.country.name,
        responseFirstCommentCopy.data.book.publisher.country.fullName,
        responseFirstCommentCopy.data.book.publisher.country.short,
        responseFirstCommentCopy.data.book.publisher.country.flag,
        responseFirstCommentCopy.data.book.publisher.country.id
      ),
      responseFirstCommentCopy.data.book.publisher.id
    );
    if (null !== responseFirstCommentCopy.data.book.authors) {
      firstCommentCopy.book.authors = [];
      responseFirstCommentCopy.data.book.authors.forEach((author: AuthorDataInterfaces) => {
        firstCommentCopy.book.authors?.push(
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
      firstCommentCopy.book.authors = responseFirstCommentCopy.data.book.authors;
    }

    //2. validate the expected data
    expect(responseFirstCommentCopy.status).toEqual(responseExpected.status);
    expect(firstCommentCopy).toEqual(firstCommentCopy);
  });

  /**
   * Testing find all route
   */
  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos os comentários do livro",
      },
    };
    //1. execute url
    const response: ResponseData = (await BookCommentFetch.findAll(1)).data;
    //2. validate status and number of countries
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);
  });

  /**
   * Testing delete route
   */
  it("Delete", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Comentário do livro removido",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url
    const response: ResponseData = (await BookCommentFetch.delete(token, bookCommentTest.id)).data;
    //3. validate expetected response
    expect(response).toEqual(responseExpected);
  });
});
