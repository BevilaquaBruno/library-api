import { Request, Response } from "express";
import PersonModel from "../models/Person.model";
import Person from "../classes/Person.class";
import { ResponseData } from "../interfaces/Common.interface";
import Helper from "../classes/Helper.class";

export default class PersonController {
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const people: Person[] = await PersonModel.findAll();
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

  public static async findById(req: Request, res: Response) {
    let response: ResponseData;
    const id: number = parseInt(req.params.id, 10);

    try {
      const person: Person = await PersonModel.findById(id);
      if (0 === person.id_person) throw new Error("Pessoa não encontrada");
      response = { data: person.toJson(), status: { error: false, message: "Pessoa encontrada" } };
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao buscar dados da pessoa" },
      };
    }

    res.json(response);
  }

  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
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

      const resValidate: ResponseData = person.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let personValidate: Person;
      if("" != person.cpf){
        personValidate = await PersonModel.findByCpf(person.cpf);
        if (0 !== personValidate.id_person) throw new Error("Já existe uma pessoa com esse CPF");
      }else{
        if("" != person.birth_date){
          personValidate = await PersonModel.findByBirthDateAndName(person.birth_date, person.name);
          if (0 !== personValidate.id_person) throw new Error("Já existe uma pessoa com esse nome e data de nascimento");
        }
      }

      const insertId: number = await PersonModel.create(person);
      if (insertId !== 0) {
        person.id_person = insertId;
        response = { data: person.toJson(), status: { error: false, message: "Pessoa cadastrada" } };
      } else throw new Error("Erro ao inserir pessoa");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao criar pessoa" },
      };
    }

    res.json(response);
  }

  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const id: number = parseInt(req.params.id);
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

      const resValidate: ResponseData = person.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let personValidate: Person;
      //need to valid if person_id exists
      personValidate = await PersonModel.findById(person.id_person);
      if(0 === personValidate.id_person) throw new Error("Pessoa não encontrada");

      if("" != person.cpf){
        personValidate = await PersonModel.findByCpf(person.cpf, person.id_person);
        if (0 !== personValidate.id_person) throw new Error("Já existe uma pessoa com esse CPF");
      }

      const updatedPerson: boolean = await PersonModel.update(person);
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

  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const id: number = parseInt(req.params.id, 10);
      let person: Person = await PersonModel.findById(id);
      if (person.id_person === 0) throw new Error("Pessoa não encontrada");

      let result: boolean = await PersonModel.delete(person);
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