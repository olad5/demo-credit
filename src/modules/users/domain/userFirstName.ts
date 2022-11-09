import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

interface UserFirstNameProps {
  name: string;
}

export class UserFirstName extends ValueObject<UserFirstNameProps> {
  public static maxLength = 150;
  public static minLength = 2;

  get value(): string {
    return this.props.name;
  }

  private constructor(props: UserFirstNameProps) {
    super(props);
  }

  public static create(props: UserFirstNameProps): Result<UserFirstName> {
    const userFirstResult = Guard.againstNullOrUndefined(
      props.name,
      "firstname"
    );
    if (userFirstResult.isFailure) {
      return Result.fail<UserFirstName>(userFirstResult.getErrorValue());
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      props.name,
      "firstName"
    );
    if (minLengthResult.isFailure) {
      return Result.fail<UserFirstName>(minLengthResult.getErrorValue());
    }

    const maxLengthResult = Guard.againstAtMost(
      this.maxLength,
      props.name,
      "firstName"
    );
    if (maxLengthResult.isFailure) {
      return Result.fail<UserFirstName>(minLengthResult.getErrorValue());
    }

    return Result.ok<UserFirstName>(new UserFirstName(props));
  }
}
