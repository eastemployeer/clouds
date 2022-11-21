interface AppErrorI {
    statusCode: number;
    status: string;
    isOperational: boolean;
}

class AppError extends Error implements AppErrorI {
    statusCode;
    status;
    isOperational;
    constructor(message: string, statusCode?: number) {
      super(message);
      this.statusCode = statusCode ? statusCode : 400;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; //czyli wynikajace nie z bledow w kodzie
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
export default AppError;