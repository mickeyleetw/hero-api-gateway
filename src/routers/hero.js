import { Router } from 'express';
import HeroRepository from '../repositories/index.js';
import { HerokuAppError } from '../adapters/index.js';
import HeroAppError from './errorHandle.js';

const router = Router();
const heroRepository = new HeroRepository();

router.get('/heroes', async (req, res) => {
  if (!req.headers.name || !req.headers.password) {
    try {
      const heroListResponse = await heroRepository.getHeroList();
      res.json(heroListResponse);
      return;
    } catch (error) {
      if (error instanceof HerokuAppError) {
        res.status(error.statusCode).json(error);
      } else {
        const heroError = new HeroAppError('Internal Server Error', '', 500);
        res.status(500).json(heroError);
      }
    }
  } else {
    const { name, password } = req.headers;

    const isAuth = await heroRepository.isAuthUser(name, password);
    if (isAuth) {
      try {
        const heroDetailListResponse = await heroRepository.getAuthenticatedHeroList();
        res.json(heroDetailListResponse);
        return;
      } catch (error) {
        if (error instanceof HerokuAppError) {
          res.status(error.statusCode).json(error);
        } else {
          const heroError = new HeroAppError('Internal Server Error', '', 500);
          res.status(500).json(heroError);
        }
      }
    } else {
      const heroError = new HeroAppError('User Unauthorized', '', 401);
      res.status(401).json(heroError);
    }
  }
});

router.get('/heroes/:heroId', async (req, res) => {
  const { heroId } = req.params;

  if (!req.headers.name || !req.headers.password) {
    try {
      const heroResponse = await heroRepository.getSingleHero(heroId);
      res.json(heroResponse);
      return;
    } catch (error) {
      if (error instanceof HerokuAppError) {
        res.status(error.statusCode).json(error);
      } else {
        const heroError = new HeroAppError('Internal Server Error', '', 500);
        res.status(500).json(heroError);
      }
    }
  } else {
    const { name, password } = req.headers;
    const isAuth = await heroRepository.isAuthUser(name, password);
    if (isAuth) {
      try {
        const heroDetailResponse = await heroRepository.getAuthenticatedSingleHero(heroId);
        res.json(heroDetailResponse);
        return;
      } catch (error) {
        if (error instanceof HerokuAppError) {
          res.status(error.statusCode).json(error);
        } else {
          const heroError = new HeroAppError('Internal Server Error', '', 500);
          res.status(500).json(heroError);
        }
      }
    } else {
      const heroError = new HeroAppError('User Unauthorized', '', 401);
      res.status(401).json(heroError);
    }
  }
});

export default router;
