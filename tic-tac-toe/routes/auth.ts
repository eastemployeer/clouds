import * as express from 'express';
import Database from '../Database';
import * as encrypter from '../helpers/encrypter';
import * as authController from '../controllers/authController';
import {v4 as uuid} from 'uuid';

const router = express.Router();

router.post('/login', authController.login);

router.post('/register', authController.register);

export default router;
