export class AppError implements Error {
  public name: string;
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    this.name = 'AppError';
    this.message = message;
    this.statusCode = statusCode;
  }
}
