import * as express from "express";
import debug from "debug";

const log = debug("app:BaseController");

export abstract class BaseController {
  protected abstract executeImpl(
    req: express.Request,
    res: express.Response
  ): Promise<void | any>;

  public async execute(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      await this.executeImpl(req, res);
    } catch (err) {
      log(`[BaseController]: Uncaught controller error`);
      log(err);
      this.fail(res, "An unexpected error occurred");
    }
  }

  public static jsonResponse(
    res: express.Response,
    code: number,
    message: string
  ) {
    return res.status(code).json({ message });
  }

  public ok<T>(res: express.Response, dto?: T) {
    if (dto) {
      res.type("application/json");
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created(res: express.Response) {
    return res.sendStatus(201);
  }

  public clientError(res: express.Response, message?: string) {
    return BaseController.jsonResponse(
      res,
      400,
      message ? message : "Unauthorized"
    );
  }

  public unauthorized(res: express.Response, message?: string) {
    return BaseController.jsonResponse(
      res,
      401,
      message ? message : "Unauthorized"
    );
  }

  public forbidden(res: express.Response, message?: string) {
    return BaseController.jsonResponse(
      res,
      403,
      message ? message : "Forbidden"
    );
  }

  public notFound(res: express.Response, message?: string) {
    return BaseController.jsonResponse(
      res,
      404,
      message ? message : "Not found"
    );
  }

  public conflict(res: express.Response, message?: string) {
    return BaseController.jsonResponse(
      res,
      409,
      message ? message : "Conflict"
    );
  }

  public fail(res: express.Response, error: Error | string) {
    log(error);
    return res.status(500).json({
      message: error.toString()
    });
  }
}
