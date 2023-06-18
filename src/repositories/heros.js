import { HerokuAPIAdapter } from '../adapters/index.js';
import * as Models from '../models/index.js';

class HeroConverter {

    static convertSingleHerokuHeroResponseToModel(hero) {
        return new Models.RetrieveSingleHeroModel(hero.id, hero.name, hero.image);
    }

    static convertSingleHerokuHeroDetailResponseToModel(hero, heroProfile) {

        return new Models.RetrieveSingleHeroDetailModel(hero.id, hero.name, hero.image, heroProfile.str, heroProfile.int, heroProfile.agi, heroProfile.luk);
    }

    static convertHerokuHeroListResponseToModel(heroes) {
        const newHeroes = heroes.map((hero) => { return new Models.RetrieveSingleHeroModel(hero.id, hero.name, hero.image) });
        return new Models.RetrieveHeroListModel(newHeroes);

    }

    static convertHerokuHeroDetailListResponseToModel(heroes, heroProfileMap) {
        const heroDetails = new Array();
        for (let i = 0; i < (heroes.length); i++) {
            const hero = heroes[i];
            const heroProfile = heroProfileMap.get(Number(hero.id));
            heroDetails.push(new Models.RetrieveSingleHeroDetailModel(hero.id, hero.name, hero.image, heroProfile.str, heroProfile.int, heroProfile.agi, heroProfile.luk));
        }
        return new Models.RetrieveHeroDetailListModel(heroDetails);
    }
}

export class HeroRepository {

    constructor() {
        this._herokuAdapter = new HerokuAPIAdapter();
        this._converter = HeroConverter;
    }

    async isAuthUser(name, password) {
        try {
            const response = await this._herokuAdapter.authUser(name, password);

            if (response.status === 200 && response.data === 'OK') {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log('HerokuApp ' + error.msg);
            return false
        }
    }


    async getHeroList() {

        try {
            const herokuHeroes = await this._herokuAdapter.getHeroes();
            return this._converter.convertHerokuHeroListResponseToModel(herokuHeroes)
        } catch (error) {
            throw error;
        }
    }

    async getSingleHero(heroId) {
        try {
            const herokuHeroes = await this._herokuAdapter.getSingleHero(heroId);
            return this._converter.convertSingleHerokuHeroResponseToModel(herokuHeroes)
        } catch (error) {
            throw error;
        }
    }

    async getAuthenticatedHeroList() {

        try {
            const herokuHeroes = await this._herokuAdapter.getHeroes();
            const heroIds = herokuHeroes.map((hero) => hero.id);
            const heroDetailMap = new Map()
            for (let i = 0; i < (heroIds.length); i++) {
                const heroId = heroIds[i]
                const heroProfile = await this._herokuAdapter.getSingleHeroProfile(heroId);
                heroDetailMap.set(Number(heroId), heroProfile);
            }
            return this._converter.convertHerokuHeroDetailListResponseToModel(herokuHeroes, heroDetailMap)
        } catch (error) {
            throw error;
        }

    }

    async getAuthenticatedHero(heroId) {
        try {
            const [herokuHeroes, herokuHeroProfile] = await Promise.all([
                this._herokuAdapter.getSingleHero(heroId), 
                this._herokuAdapter.getSingleHeroProfile(heroId)
            ]);

            return this._converter.convertSingleHerokuHeroDetailResponseToModel(herokuHeroes, herokuHeroProfile)
        } catch (error) {
            throw error;
        }
    }
}