export type GuardResponse = string;

import { Result } from "./Result";

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static combine(guardResults: Result<any>[]): Result<GuardResponse> {
    for (const result of guardResults) {
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }

  public static againstAtLeast(
    numChars: number,
    text: string,
    argumentName: string
  ): Result<GuardResponse> {
    return text.length >= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          `${argumentName} is not at least ${numChars} chars.`
        );
  }

  public static againstAtMost(
    numChars: number,
    text: string,
    argumentName: string
  ): Result<GuardResponse> {
    return text.length <= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          `${argumentName} is greater than ${numChars} chars.`
        );
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string
  ): Result<GuardResponse> {
    if (argument === null || argument === undefined) {
      return Result.fail<GuardResponse>(`${argumentName} is null or undefined`);
    } else {
      return Result.ok<GuardResponse>();
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection
  ): Result<GuardResponse> {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName
      );
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }
  public static isLower(
    num: number,
    min: number,
    argumentName: string
  ): Result<GuardResponse> {
    const isLowerThan = num >= min;
    if (!isLowerThan) {
      return Result.fail<GuardResponse>(`${argumentName} is less than ${min}`);
    } else {
      return Result.ok<GuardResponse>();
    }
  }
  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string
  ): Result<GuardResponse> {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return Result.fail<GuardResponse>(
        `${argumentName} is not within range ${min} to ${max}.`
      );
    } else {
      return Result.ok<GuardResponse>();
    }
  }
}
