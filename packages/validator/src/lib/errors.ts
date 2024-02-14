export class JsonParseError extends Error {
  constructor() {
    super('JsonParseError');
    this.name = 'JsonParseError';
  }
}

export class NotSupportedError extends Error {
  constructor(reason: string) {
    super('NotSupportedError: ' + reason);
    this.name = 'NotSupportedError';
  }
}

export class HttpError extends Error {
  constructor(reason: string) {
    super('HttpError: ' + reason);
    this.name = 'HttpError';
  }
}

export class SchemaError extends Error {
  constructor(reason: string) {
    super('SchemaError: ' + reason);
    this.name = 'SchemaError';
  }
}

export class ValidationError extends Error {
  errors: string[] = [];

  constructor(errors: string[]) {
    super('ValidationError');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}
