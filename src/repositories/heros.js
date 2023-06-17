import { HerokuAPIAdapter } from "../adapters/index.js";
import * as Models from "../models/index.js";

class HeroConverter {

    static convertSingleHerokuHeroResponseToModel(hero) {
        return new Models.RetrieveSingleHeroModel(hero.id, hero.name, hero.image);
    }

    static convertSingleHerokuHeroDetailResponseToModel(hero, hero_profile) {

        return new Models.RetrieveSingleHeroDetailModel(hero.id, hero.name, hero.image, hero_profile.str, hero_profile.int, hero_profile.agi, hero_profile.luk);
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
        this._heroku_adapter = new HerokuAPIAdapter();;
        this._converter = HeroConverter;
    }

    async isAuthUser(name, password) {
        try {
            const response = await this._heroku_adapter.authUser(name, password);

            if (response.status === 200 && response.data === "OK") {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log("HerokuApp " + error.msg);
            return false
        }
    }


    async getHeroList() {

    try {
        const heroku_heroes = await this._heroku_adapter.getHeroes();
        return this._converter.convertHerokuHeroListResponseToModel(heroku_heroes)
    } catch (error) {
        throw error;
    }
}

    async getSingleHero(heroId) {
    try {
        const heroku_hero = await this._heroku_adapter.getSingleHero(heroId);
        return this._converter.convertSingleHerokuHeroResponseToModel(heroku_hero)
    } catch (error) {
        throw error;
    }
}

    async getAuthenticatedHeroList() {

    try {
        const heroku_heroes = await this._heroku_adapter.getHeroes();
        const hero_ids = heroku_heroes.map((hero) => { return hero.id });
        const hero_detail_map = new Map()
        for (let i = 0; i < (hero_ids.length); i++) {
            const heroId = hero_ids[i]
            const hero_profile = await this._heroku_adapter.getSingleHeroProfile(heroId);
            await hero_detail_map.set(Number(heroId), hero_profile);
        }
        return this._converter.convertHerokuHeroDetailListResponseToModel(heroku_heroes, hero_detail_map)
    } catch (error) {
        throw error;
    }

}

    async getAuthenticatedHero(heroId) {
    try {
        const heroku_hero = await this._heroku_adapter.getSingleHero(heroId);
        const heroku_hero_profile = await this._heroku_adapter.getSingleHeroProfile(heroId);
        return this._converter.convertSingleHerokuHeroDetailResponseToModel(heroku_hero, heroku_hero_profile)
    } catch (error) {
        throw error;
    }
}
}