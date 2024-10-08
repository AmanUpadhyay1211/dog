export class ApiError extends Error {
  constructor(
    message = "Something went wrong",
    data,
    statusCode,
    errors = [],
    stack = ""
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errors = errors;
    this.success=false;
    this.data = data;
  
    if(stack){
        this.stack=stack
    }else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}


