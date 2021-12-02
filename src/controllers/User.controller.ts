import { Request, Response } from "express";
import UserModel from "../models/User.model";
import User from "../classes/User.class";
import { RequestWithUser, ResponseData } from "../interfaces/Common.interface";
import md5 from "md5";
import { PasswordList } from "../interfaces/User.interface";
import Helper from "../classes/Helper.class";

/**
 * UserController class is used for /api/user route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class UserController {
  /**
   * Find all users
   */
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get users
      const users: User[] = await UserModel.findAll();

      /**
       * 2. map them to get the @toJson data
       */
      response = {
        data: users.map((u) => u.toJson()),
        status: { error: false, message: "Lista de todos os usuários" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados dos usuários",
        },
      };
    }

    res.json(response);
  }

  /**
   * Find user with the given id
   * id: user's id - 1 IN THE URL
   */
  public static async findById(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse id
    const id: number = parseInt(req.params.id, 10);

    try {
      //2. validate if user exists
      let user: User = await UserModel.findById(id);
      if (0 === user.id) throw new Error("Usuário não encontrado");
      /**
       * 3. get the @toJson data
       */
      response = { data: user.toJson(), status: { error: false, message: "Usuário encontrado" } };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados do usuário",
        },
      };
    }

    res.json(response);
  }

  /**
   * Create a User
   * name: name of the user - Bruno Fernando Bevilaqua
   * username: username of the user - bevilaqua
   * email: email of the user - bbbevilaqua@gmail.com
   * password: password for the user - 123
   * passwordConfirm: repeat the password - 123
   */
  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and create the user
      const user: User = new User(
        Helper.emptyforNull(req.body.name),
        Helper.emptyforNull(req.body.username),
        Helper.emptyforNull(req.body.email)
      );

      /**
       * 2. get password list with @PasswordList interface
       */
      const passwordList: PasswordList = {
        password: req.body?.password ?? "",
        passwordConfirm: req.body?.passwordConfirm ?? "",
      };

      //3. valida the given passwords
      if ("" === passwordList.password) throw new Error("Informe a senha");
      if ("" === passwordList.passwordConfirm)
        throw new Error("Repita a senha na confirmação da senha");
      if (md5(passwordList.password) !== md5(passwordList.passwordConfirm))
        throw new Error("As senhas não coincidem");

      //4. set the password for user, with md5
      user.password = md5(passwordList.password);

      //5. validate user data
      const resValidate: ResponseData = user.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let userValidate: User;
      //6. validate if username is unique
      userValidate = await UserModel.findByUsername(user.username);
      if (0 !== userValidate.id) throw new Error("Já existe um usuário com esse username");
      //7. validate if email is unique
      userValidate = await UserModel.findByEmail(user.email);
      if (0 !== userValidate.id) throw new Error("Já existe um usuário com esse email");

      //8. insert user
      const insertId: number = await UserModel.create(user);
      //9. validate insertion
      if (insertId !== 0) {
        user.id = insertId;
        response = { data: user.toJson(), status: { error: false, message: "Usuário cadastrado" } };
      } else throw new Error("Erro ao inserir usuário");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao criar usuário" },
      };
    }

    res.json(response);
  }

  /**
   * Create a User
   * name: name of the user - Bruno Fernando Bevilaqua
   * username: username of the user - bevilaqua
   * email: email of the user - bbbevilaqua@gmail.com
   * password: password for the user - 123
   * passwordConfirm: repeat the password - 123
   * id: user's id - 1 IN THE URL
   */
  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse id
      const id: number = parseInt(req.params.id);
      //2. get and create user with the given ata
      const user: User = new User(
        Helper.emptyforNull(req.body.name),
        Helper.emptyforNull(req.body.username),
        Helper.emptyforNull(req.body.email),
        id
      );

      //3. verify if user id exists
      const existingUser: User = await UserModel.findById(user.id);
      if (0 === existingUser.id) throw new Error("Usuário não encontrado");

      //4. validate user data
      const resValidate: ResponseData = user.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let userValidate: User;
      //5. validate if username is unique
      userValidate = await UserModel.findByUsername(user.username, user.id);
      if (0 !== userValidate.id) throw new Error("Já existe um usuário com esse username");
      //6. validate if email is unique
      userValidate = await UserModel.findByEmail(user.email, user.id);
      if (0 !== userValidate.id) throw new Error("Já existe um usuário com esse email");

      //7. update user
      const updatedUser: boolean = await UserModel.update(user);
      //8. validate update
      if (true === updatedUser)
        response = {
          data: user.toJson(),
          status: { error: false, message: "Usuário atualizado" },
        };
      else throw new Error("Erro ao atualizar usuário");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao alterar usuário" },
      };
    }

    res.json(response);
  }

  /**
   * Update password for the user
   * id: users's id - 1 IN THE URL
   * password: password for the user - 123
   * passwordConfirm: repeat the password - 123
   */
  public static async updatePassword(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse user id
      const id: number = parseInt(req.params.id);

      //2. validate if user exists
      const user: User = await UserModel.findById(id);
      if (0 === user.id) throw new Error("Usuário não encontrado");

      /**
       * 3. get password list with @PasswordList interface
       */
      const passwordList: PasswordList = {
        password: req.body?.password ?? "",
        passwordConfirm: req.body?.passwordConfirm ?? "",
      };

      //4. validate passwords
      if ("" === passwordList.password) throw new Error("Informe a senha");
      if ("" === passwordList.passwordConfirm)
        throw new Error("Repita a senha na confirmação da senha");
      if (md5(passwordList.password) !== md5(passwordList.passwordConfirm))
        throw new Error("As senhas não coincidem");

      //5. set password with md5
      user.password = md5(passwordList.password);

      //6. update user password
      const updatedPassword: boolean = await UserModel.updatePassword(user);

      //7. validate update
      if (true === updatedPassword)
        response = {
          data: user.toJson(),
          status: { error: false, message: "Senha do usuário atualizada" },
        };
      else throw new Error("Erro ao atualizar a senha do usuário");
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao alterar senha do usuário",
        },
      };
    }

    res.json(response);
  }

  /**
   * delete user
   * id: user's id - 1 IN THE URL
   */
  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse user id
      const id: number = parseInt(req.params.id, 10);

      //2. validate if user exists
      let user: User = await UserModel.findById(id);
      if (user.id === 0) throw new Error("Usuário não encontrado");
      /**
       * 3. validate if is not his own id
       * this uses @RequestWithUser interface
       */
      if (user.id === (req as RequestWithUser)?.user.id)
        throw new Error("Usuário não pode excluir o próprio cadastro");

      //4. delete user
      let result: boolean = await UserModel.delete(user);
      //5. validate deletion
      if (true === result)
        response = { data: {}, status: { error: false, message: "Usuário removido" } };
      else throw new Error("Erro ao deletar usuário");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao excluir usuário" },
      };
    }

    res.json(response);
  }
}
