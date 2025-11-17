import { BaseException } from './auth.exceptions';

export class ProblemNotFoundException extends BaseException {
  constructor(message: string) {
    super(message, 404, 'PROBLEM_NOT_FOUND');
    this.name = 'ProblemNotFoundException';
  }
}

export class ValidationException extends BaseException {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationException';
  }
}

export class ProblemAlreadyExistsException extends BaseException {
  constructor(message: string) {
    super(message, 409, 'PROBLEM_ALREADY_EXISTS');
    this.name = 'ProblemAlreadyExistsException';
  }
}
export class ProblemDetailNotFoundException extends BaseException {
  constructor(message: string) {
    super(message, 404, 'PROBLEM_DETAIL_NOT_FOUND');
    this.name = 'ProblemDetailNotFoundException';
  }
}
