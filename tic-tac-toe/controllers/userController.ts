import jwt from 'jsonwebtoken';
import {Request, Response, CookieOptions, NextFunction} from 'express';
import AppError from '../helpers/AppError';
import Database from '../Database';
import * as encrypter from '../helpers/encrypter';
import { User } from '../Database';
import {v4 as uuid} from 'uuid';

export const getLeaderBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const leaderBoard = await Database.raw("SELECT email, wins, loses FROM users ORDER BY wins desc");
        console.log(leaderBoard);
        res.status(200).json({
            data: leaderBoard.rows
        })
    } catch(e: any) {
        next(new AppError("Something went wrong while retrieving leaderboard", 400));
    }
}

export const incrementWins = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Database.raw("UPDATE users SET wins = wins + 1 WHERE id = ?;", [req.body.id]);
        res.status(200).json({
            status: 'success'
        })
    } catch(e: any) {
        next(new AppError("Something went wrong while updating wins", 400));
    }
}

export const incrementLoses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Database.raw("UPDATE users SET loses = loses + 1 WHERE id = ?;", [req.body.id]);
        res.status(200).json({
            status: 'success'
        })
    } catch(e: any) {
        next(new AppError("Something went wrong while updating loses", 400));
    }
}