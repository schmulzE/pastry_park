class JsonLdError extends Error {
  status: number;
  code: string;
  details: object;

  constructor(message: string, options: {
    cause?: Error,
    status?: number,
    code?: string,
    details?: object
  }) {
    super(message, { cause: options.cause });
    this.status = options.status || 500;
    this.code = options.code || 'JSON_LD_ERROR';
    this.details = options.details || {};
    this.name = 'JsonLdError';
  }
}