import jwt from 'jsonwebtoken';
import {Request, Response, CookieOptions, NextFunction} from 'express';
import AppError from '../helpers/AppError';
import Database from '../Database';
import * as encrypter from '../helpers/encrypter';
import { User } from '../Database';
import {v4 as uuid} from 'uuid';

interface Token extends jwt.JwtPayload {
    id: string;
}

const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    // secure: true, //only send when using HTTPS
    httpOnly: true, //cannot be accessed by the browser
  };
  
  const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };
  const createSendToken = (user: User, statusCode: number, req: Request, res: Response) => {
    const token = signToken(user.id);
  
    if (req.secure || req.headers['x-forwarded-proto'] === 'https')
      cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    //not displaying password - in response
    user.password = '';
  
    res.status(statusCode).json({
      status: 'success',
      token, //for Postman, reading jwt token from response
      data: {
        user,
      },
    });
  };

  export const register = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    const email: string = req.body.email;
    const password: string = req.body.password;
  
    try {
      const user = await Database.raw("SELECT * FROM users WHERE email = ?;", [email]);
      if (user.rowCount > 0) next(new AppError("User with this email already exists", 400));
      
      const salt = await encrypter.genSalt();
      const hashedPassword = await encrypter.hash(password, salt);
      const id = uuid();
      await Database.raw('INSERT INTO users(id, email, password) VALUES(?,?,?);', [id, email, hashedPassword]);
    
      res.status(201).send({id});
    } catch (error) {
      console.log(error)
      res.status(400).end();
    }
  }

  export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    const data = await Database.raw("SELECT * FROM users WHERE email = ?;", [email]);
    console.log(data)

    if (!data || data.rows.length === 0) {
      return next(new AppError('Incorrect email or password', 400));
    }
     
    if (!(await encrypter.compare(password, data.rows[0].password))) {
      return next(new AppError('Incorrect email or password', 400));
    }

    createSendToken(data.rows[0], 200, req, res);
  };
  
  export const protect = async (req: Request, res: Response, next: NextFunction) => {
    //1) Getting token and check of it's there
    let token;
    if (
      //adding authorization header to the GET request header
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]; //string looks like: Bearer jwska23343dks
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  
    if (!token) {
      return next(new AppError('You are not logged in!', 401)); //401- not authenticated
    }
    //2)Verification of token
    //throws error if token not valid or token expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as Token;
  
    //3) Check if user still exists - user got deleted in meantime
    const currentUser = await Database.raw("SELECT * FROM `users` WHERE `id` = ?;", [decoded.id]);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to the token no longer exists')
      );
    }
    //4) Check if user changed password after the JWT was issued/granted
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      ///issued/granted at
      return next(
        new AppError('User recently changed password! Please log in again', 401)
      );
    }
    //access granted
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  };
  
  //Only for rendered pages, no errors
  export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    //check token
    if (req.cookies.jwt) {
      try {
        //catching errors locally because we dont want jwt.verify to throw errors (przy wylogowywaniu się token zostaje zamieniony na stringa i ta funckja wywali błąd bo nie moze rozkodowac)
        //verify the token
        const decoded = jwt.verify(
          req.cookies.jwt,
          process.env.JWT_SECRET
        ) as Token;
        const currentUser = await Database.raw("SELECT * FROM `users` WHERE `id` = ?;", [decoded.id]);
        if (!currentUser) {
          return next();
        }
        //4) Check if user changed password after the JWT was issued/granted
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          ///issued/granted at
          return next();
        }
        //access granted
        //every pug template has access to res.locals - as a variable
        res.locals.user = currentUser;
      } catch (err) {
        return next();
      }
    }
    next();
  };