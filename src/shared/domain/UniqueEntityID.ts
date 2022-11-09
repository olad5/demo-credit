import { nanoid } from "nanoid";
import { Identifier } from "./Identifier";

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : nanoid());
  }
}
