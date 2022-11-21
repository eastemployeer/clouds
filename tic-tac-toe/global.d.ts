namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      JWT_COOKIE_EXPIRES_IN: number;
      JWT_EXPIRES_IN: number;
      JWT_SECRET: string;
    }
}

declare namespace Express {
    export interface Request {
       user?: string
    }
 }
