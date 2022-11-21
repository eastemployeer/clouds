import * as express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/leaderboard', userController.getLeaderBoard);
router.patch('/wins', userController.incrementWins);
router.patch('/loses', userController.incrementLoses);

export default router;
