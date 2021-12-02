import { Request, Response } from "express";
import PersonModel from "../models/Person.model";
import Person from "../classes/Person.class";
import { ResponseData } from "../interfaces/Common.interface";
import Helper from "../classes/Helper.class";

/**
 * PersonController class is used for /api/person route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class PersonController {
  /**
   * List all people
   */
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get all people
      const people: Person[] = await PersonModel.findAll();

      /**
       * 2. map then to get the @toJson data
       */
      response = {
        data: people.map((ct) => ct.toJson()),
        status: { error: false, message: "Lista de todas as pessoas" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados das pessoas",
        },
      };
    }

    res.json(response);
  }

  /**
   * List a person with the given id
   * id: person's id - 1 IN THE URL
   */
  public static async findById(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse the given id in the url
    const id: number = parseInt(req.params.id, 10);

    try {
      //2. get person id database
      const person: Person = await PersonModel.findById(id);
      //3. validate if the person exists
      if (0 === person.id_person) throw new Error("Pessoa não encontrada");
      /**
       * 4. get the @toJson data
       */
      response = { data: person.toJson(), status: { error: false, message: "Pessoa encontrada" } };
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao buscar dados da pessoa" },
      };
    }

    res.json(response);
  }

  /**
   * Create a person
   * name: name of the person - Bruno Fernando Bevilaqua
   * email: valid email of the person - bbbevilaqua@gmail.com
   * phone: phone of the person: - +55 49 9 98320023
   * birth_date: birth_date of the person - 2000-03-05
   * cpf: cpf of the person - 063.343.253-96 https://theonegenerator.com/pt/geradores/documentos/gerador-de-cpf/
   * address - address of the person - Street João Suzin Marini, Number 15
   * city - city of the person - Concórdia
   * state - state of the person - SC
   */
  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and create a person with the given data
      const person: Person = new Person(
        Helper.emptyforNull(req.body.name),
        Helper.emptyforNull(req.body.email),
        Helper.emptyforNull(req.body.phone),
        Helper.emptyforNull(req.body.birth_date),
        Helper.emptyforNull(req.body.cpf),
        Helper.emptyforNull(req.body.address),
        Helper.emptyforNull(req.body.city),
        Helper.emptyforNull(req.body.state)
      );

      //2. validate person data
      const resValidate: ResponseData = person.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let personValidate: Person;
      //3. if cpf is not empty, then validate them, if it is then validate birth_date + name if is unique
      if ("" != person.cpf) {
        //3.1. validate if cpf is unique
        personValidate = await PersonModel.findByCpf(person.cpf);
        if (0 !== personValidate.id_person) throw new Error("Já existe uma pessoa com esse CPF");
      } else {
        if ("" != person.birth_date) {
          //3.1. validate if birth_date + name is unique
          personValidate = await PersonModel.findByBirthDateAndName(person.birth_date, person.name);
          if (0 !== personValidate.id_person)
            throw new Error("Já existe uma pessoa com esse nome e data de nascimento");
        }
      }

      //4. insert person
      const insertId: number = await PersonModel.create(person);

      //5 validate insertion
      if (insertId !== 0) {
        person.id_person = insertId;
        response = {
          data: person.toJson(),
          status: { error: false, message: "Pessoa cadastrada" },
        };
      } else throw new Error("Erro ao inserir pessoa");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao criar pessoa" },
      };
    }

    res.json(response);
  }

  /**
   * Create a person
   * id: id of the person - 1 IN URL
   * name: name of the person - Bruno Fernando Bevilaqua;
   * email: valid email of the person - bbbevilaqua@gmail.com
   * phone: phone of the person: - +55 49 9 98320023
   * birth_date: birth_date of the person - 2000-03-05
   * cpf: cpf of the person - 063.343.253-96 https://theonegenerator.com/pt/geradores/documentos/gerador-de-cpf/
   * address - address of the person - Street João Suzin Marini, Number 15
   * city - city of the person - Concórdia
   * state - state of the person - SC
   */
  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id
      const id: number = parseInt(req.params.id);
      //2. get and create person with the given data
      const person: Person = new Person(
        Helper.emptyforNull(req.body.name),
        Helper.emptyforNull(req.body.email),
        Helper.emptyforNull(req.body.phone),
        Helper.emptyforNull(req.body.birth_date),
        Helper.emptyforNull(req.body.cpf),
        Helper.emptyforNull(req.body.address),
        Helper.emptyforNull(req.body.city),
        Helper.emptyforNull(req.body.state),
        id
      );

      //3. validate person data
      const resValidate: ResponseData = person.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let personValidate: Person;
      //4. validate if person exists
      personValidate = await PersonModel.findById(person.id_person);
      if (0 === personValidate.id_person) throw new Error("Pessoa não encontrada");

      //5. validate if cpf is unique
      if ("" != person.cpf) {
        personValidate = await PersonModel.findByCpf(person.cpf, person.id_person);
        if (0 !== personValidate.id_person) throw new Error("Já existe uma pessoa com esse CPF");
      }

      //6. update person
      const updatedPerson: boolean = await PersonModel.update(person);
      // 7. validate update
      if (true === updatedPerson)
        response = {
          data: person.toJson(),
          status: { error: false, message: "Pessoa atualizada" },
        };
      else throw new Error("Erro ao atualizar pessoa");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro alterar pessoa" },
      };
    }

    res.json(response);
  }

  /**
   * delete a person with the given id
   * id: person's id - IN URL
   */
  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the id
      const id: number = parseInt(req.params.id, 10);

      //2. validate if person exists
      let person: Person = await PersonModel.findById(id);
      if (person.id_person === 0) throw new Error("Pessoa não encontrada");

      //3. delete person
      let result: boolean = await PersonModel.delete(person);

      //4. validate deletion
      if (true === result)
        response = { data: {}, status: { error: false, message: "Pessoa removida" } };
      else throw new Error("Erro ao deletar pessoa");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao excluir pessoa" },
      };
    }

    res.json(response);
  }
}
