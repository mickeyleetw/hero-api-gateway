import chai, { expect } from 'chai';
import chaiSpies from 'chai-spies';
import { HeroRepository } from '../heros.js';
import { HerokuAPIAdapter } from '../../adapters/index.js';
import * as Models from '../../models/index.js';

chai.use(chaiSpies);


describe('Test Hero Repository Function', function () {

    const mockHeroRepository = new HeroRepository();
    const mockHerokuAPIAdapter = new HerokuAPIAdapter();
    mockHeroRepository._herokuAdapter = mockHerokuAPIAdapter;

    afterEach(function () {
        chai.spy.restore(mockHerokuAPIAdapter, 'getHeroes');
        chai.spy.restore(mockHerokuAPIAdapter, 'getSingleHero');
        chai.spy.restore(mockHerokuAPIAdapter, 'getSingleHeroProfile');
        chai.spy.restore(mockHerokuAPIAdapter, 'authUser');
    });

    it('Should Return Unauthorized Hero List ', async function () {
        const getHeroesSpy = chai.spy.on(mockHerokuAPIAdapter, 'getHeroes');
        const result = await mockHeroRepository.getHeroList();
        expect(getHeroesSpy).to.have.been.called.exactly(1);

        expect(result).to.be.an.instanceof(Models.RetrieveHeroListModel);
        const heroList = result.heroes;
        expect(heroList).to.be.an('array');
        const singleHero = heroList[0];
        expect(singleHero).to.be.an.instanceof(Models.RetrieveSingleHeroModel);
    });


});
