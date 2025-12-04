import { validateUserCreation } from './userValidation';
import { Request, Response, NextFunction } from 'express';
import * as validation from './validation/validateUsername';
import * as passwordValidation from './validation/validatePassword';
import * as emailValidation from './validation/validateEmail';

// Mock the validation functions
jest.mock('./validation/validateUsername');
jest.mock('./validation/validatePassword');
jest.mock('./validation/validateEmail');

describe('validateUserCreation middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {
        username: 'rawUser',
        password: 'rawPass',
        email: 'raw@example.com',
      },
    };

    res = {};

    next = jest.fn();

    // Reset mocks before each test
    jest.resetAllMocks();
    (validation.default as jest.Mock).mockImplementation(
      (u: string) => `valid-${u}`,
    );
    (passwordValidation.default as jest.Mock).mockImplementation(
      (p: string) => `valid-${p}`,
    );
    (emailValidation.default as jest.Mock).mockImplementation(
      (e: string) => `valid-${e}`,
    );
  });

  it('should validate and transform the request body', () => {
    validateUserCreation(req as Request, res as Response, next);

    expect(validation.default).toHaveBeenCalledWith('rawUser');
    expect(passwordValidation.default).toHaveBeenCalledWith('rawPass');
    expect(emailValidation.default).toHaveBeenCalledWith('raw@example.com');

    expect(req.body.username).toBe('valid-rawUser');
    expect(req.body.password).toBe('valid-rawPass');
    expect(req.body.email).toBe('valid-raw@example.com');

    expect(next).toHaveBeenCalled();
  });
});
