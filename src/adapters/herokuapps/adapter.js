import axios, { AxiosError } from 'axios';

import { HEROKU_BASEURL } from '../../config.js';
import * as Models from './models/index.js';
import { HerokuAppError } from './errorHandle.js';


export class HerokuAPIAdapter {

    async getHeroes() {
        try {
            const resp = await axios.get(`${HEROKU_BASEURL}/heroes`);
            if (resp.status == 200 && resp.data.code == 1000) {
                throw new HerokuAppError(
                    'Heroku ' + resp.data.message,
                    '',
                    200,
                );
            }
            const heroList = resp.data;
            return heroList.map((hero) => Models.RetrieveHerokuHeroModel.fromJSON(hero));
        } catch (error) {
            if (error instanceof AxiosError) {
                const herokuError = new HerokuAppError(
                    error.message,
                    error.response.data,
                    error.response.status,
                );
                throw herokuError;
            } else {
                throw error;
            }
        }
    }

    async getSingleHero(heroId) {
        try {
            const resp = await axios.get(`${HEROKU_BASEURL}/heroes/${heroId}`);
            if (resp.status == 200 && resp.data.code == 1000) {
                throw new HerokuAppError(
                    'Heroku ' + resp.data.message,
                    '',
                    200,
                );
            }
            const singleHero = resp.data;
            return Models.RetrieveHerokuHeroModel.fromJSON(singleHero);
        } catch (error) {
            if (error instanceof AxiosError) {
                const herokuError = new HerokuAppError(
                    error.message,
                    error.response.data,
                    error.response.status,
                );
                throw herokuError;
            } else {
                throw error;
            }
        }
    }

    async getSingleHeroProfile(heroId) {
        try {
            const resp = await axios.get(`${HEROKU_BASEURL}/heroes/${heroId}/profile`);
            if (resp.status == 200 && resp.data.code == 1000) {
                throw new HerokuAppError(
                    'Heroku ' + resp.data.message,
                    '',
                    200,
                );
            }
            const heroProfile = resp.data;
            return Models.RetrieveHerokuHeroProfileModel.fromJSON(heroProfile);
        } catch (error) {
            if (error instanceof AxiosError) {
                const herokuError = new HerokuAppError(
                    error.message,
                    error.response.data,
                    error.response.status,
                );
                throw herokuError;
            } else {
                throw error;
            }
        }
    }

    async authUser(username, password) {

        const authData = new Models.CreateHerokuUserAuthModel(username, password);
        try {
            const resp = await axios.post(`${HEROKU_BASEURL}/auth`, authData);
            if (resp.status == 200 && resp.data.code == 1000) {
                throw new HerokuAppError(
                    'Heroku ' + resp.data.message,
                    '',
                    200,
                );
            }
            return resp
        } catch (error) {
            if (error instanceof AxiosError) {
                const herokuError = new HerokuAppError(
                    error.message,
                    error.response.data,
                    error.response.status,
                );
                throw herokuError;
            } else {
                throw error;
            }
        }
    }
}
