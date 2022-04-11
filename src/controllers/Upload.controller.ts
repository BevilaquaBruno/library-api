import { RequestWithFile, ResponseData } from "../interfaces/Common.interface";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

/**
 * UploadController class is used for /api/upload route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class UploadController {
  /**
   * Upload a file
   */
   public static async upload(req: Request, res: Response) {
    let response: ResponseData;

    try {
      /**
       * 1. Get the uploaded file from req
       */
      const fileToSave: UploadedFile = (req as unknown as RequestWithFile).files.fileToSave;
      /**
       * 2. Create a file name and generate the upload path
       */
      const fileName: String = uuidv4()+'.'+fileToSave.mimetype.split("/")[1];
      const uploadPath: string = __dirname+"/../../public/" + fileName;

      /**
       * 3. Assynchronously save the file
       */
      await fileToSave.mv(uploadPath);

      /**
       * 4. If the path does not exists return error
       */
      if(!fs.existsSync(uploadPath)){
        throw new Error("Erro no upload da imagem");
      }


      /**
       * 5. Upload finalized
       */
      response = {
        data: fileName,
        status: { error: false, message: "Upload concluído" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro grave no upload da imagem",
        },
      };
    }

    res.json(response);
  }
}