import express from "express";
import { userRouter } from "../../../../modules/users/infra/http/routes";

const v1Router = express.Router();

v1Router.get("/v1", (req, res) => {
  return res.json({ message: "Demo Credit API v1 running...." });
});

v1Router.use("/v1/users", userRouter);

export { v1Router };
