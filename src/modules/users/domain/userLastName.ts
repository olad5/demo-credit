import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

interface UserLastNameProps {
  name: string;
}

export class UserLastName extends ValueObject<UserLastNameProps> {
  public static maxLength = 150;
  public static minLength = 2;

  get value(): string {
    return this.props.name;
  }

  private constructor(props: UserLastNameProps) {
    super(props);
  }

  public static create(props: UserLastNameProps): Result<UserLastName> {
    const userLastResult = Guard.againstNullOrUndefined(props.name, "lastname");
    if (userLastResult.isFailure) {
      return Result.fail<UserLastName>(userLastResult.getErrorValue());
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      props.name,
      "lastName"
    );
    if (minLengthResult.isFailure) {
      return Result.fail<UserLastName>(minLengthResult.getErrorValue());
    }

    const maxLengthResult = Guard.againstAtMost(
      this.maxLength,
      props.name,
      "lastName"
    );
    if (maxLengthResult.isFailure) {
      return Result.fail<UserLastName>(minLengthResult.getErrorValue());
    }

    return Result.ok<UserLastName>(new UserLastName(props));
  }
}
