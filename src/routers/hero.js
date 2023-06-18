import { Router } from 'express';
import HeroRepository from '../repositories/index.js';
import { HerokuAppError } from '../adapters/index.js';
import HeroAppError from './errorHandle.js';

const router = Router();
const heroRepository = new HeroRepository();

export const getHeroListHandler = (heroRepo) => async (req, res) => {
  try {
    const { name, password } = req.headers;
    if (!name || !password) {
      const heroListResponse = await heroRepo.getHeroList();
      res.json(heroListResponse);
      return;
    }
    const isAuth = await heroRepo.isAuthUser(name, password);
    if (!isAuth) {
      const heroError = new HeroAppError('User Unauthorized', '', 401);
      res.status(401).json(heroError);
      return;
    }
    const heroDetailListResponse = await heroRepo.getAuthenticatedHeroList();
    res.json(heroDetailListResponse);
    return;
  } catch (error) {
    if (error instanceof HerokuAppError) {
      res.status(error.statusCode).json(error);
    } else {
      const heroError = new HeroAppError('Internal Server Error', '', 500);
      res.status(heroError.statusCode).json(heroError);
    }
  }
};
router.get('/heroes', getHeroListHandler(heroRepository));

export const getSingleHeroHandler = (heroRepo) => async (req, res) => {
  const { heroId } = req.params;
  try {
    const { name, password } = req.headers;
    if (!name || !password) {
      const heroResponse = await heroRepo.getSingleHero(heroId);
      res.json(heroResponse);
      return;
    }
    const isAuth = await heroRepo.isAuthUser(name, password);
    if (!isAuth) {
      const heroError = new HeroAppError('User Unauthorized', '', 401);
      res.status(401).json(heroError);
      return;
    }
    const heroDetailResponse = await heroRepo.getAuthenticatedSingleHero(heroId);
    res.json(heroDetailResponse);
    return;
  } catch (error) {
    if (error instanceof HerokuAppError) {
      res.status(error.statusCode).json(error);
    } else {
      const heroError = new HeroAppError('Internal Server Error', '', 500);
      res.status(heroError.statusCode).json(heroError);
    }
  }
};
router.get('/heroes/:heroId', getSingleHeroHandler(heroRepository));
export default router;
