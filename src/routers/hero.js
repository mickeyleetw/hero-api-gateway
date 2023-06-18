import { Router } from 'express';
import HeroRepository from '../repositories/index.js';
import { HerokuAppError } from '../adapters/index.js';
import HeroAppError from './errorHandle.js';

const router = Router();
const heroRepository = new HeroRepository();

router.get('/heroes', async (req, res) => {
    try {
        const { name, password } = req.headers;
        if (!name || !password) {
            const heroListResponse = await heroRepository.getHeroList();
            res.json(heroListResponse);
            return;
        } else {
            const isAuth = await heroRepository.isAuthUser(name, password);
            if (!isAuth) {
                const heroError = new HeroAppError('User Unauthorized', '', 401);
                res.status(401).json(heroError);
                return;
            }
            const heroDetailListResponse = await heroRepository.getAuthenticatedHeroList();
            res.json(heroDetailListResponse);
            return;
        }
    } catch (error) {
        if (error instanceof HerokuAppError) {
            res.status(error.statusCode).json(error);
        } else {
            const heroError = new HeroAppError('Internal Server Error', '', 500);
            res.status(heroError.statusCode).json(heroError);
        }
    }
});

router.get('/heroes/:heroId', async (req, res) => {
    const { heroId } = req.params;

    try {
        const { name, password } = req.headers;
        if (!name || !password) {
            const heroResponse = await heroRepository.getSingleHero(heroId);
            res.json(heroResponse);
            return;
        } else {
            const isAuth = await heroRepository.isAuthUser(name, password);
            if (!isAuth) {
                const heroError = new HeroAppError('User Unauthorized', '', 401);
                res.status(401).json(heroError);
                return;
            }
            const heroDetailResponse = await heroRepository.getAuthenticatedSingleHero(heroId);
            res.json(heroDetailResponse);
            return;


        }
    } catch (error) {
        if (error instanceof HerokuAppError) {
            res.status(error.statusCode).json(error);
        } else {
            const heroError = new HeroAppError('Internal Server Error', '', 500);
            res.status(heroError.statusCode).json(heroError);
        }
    }
 
});

export default router;
