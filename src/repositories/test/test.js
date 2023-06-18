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

    beforeEach(function () {

    })

    afterEach(function () {
        chai.spy.restore(mockHerokuAPIAdapter, 'getHeroes');
        chai.spy.restore(mockHerokuAPIAdapter, 'getSingleHero');
        chai.spy.restore(mockHerokuAPIAdapter, 'getSingleHeroProfile');
        chai.spy.restore(mockHerokuAPIAdapter, 'authUser');
    });

    // it('Should Return Unauthorized Hero List ', async function () {
    //     const getHeroesSpy = chai.spy.on(mockHerokuAPIAdapter, 'getHeroes');
    //     const result = await mockHeroRepository.getHeroList();
    //     expect(getHeroesSpy).to.have.been.called.exactly(1);

    //     expect(result).to.be.an.instanceof(Models.RetrieveHeroListModel);
    //     const heroList = result.heroes;
    //     expect(heroList).to.be.an('array');
    //     const singleHero = heroList[0];
    //     expect(singleHero).to.be.an.instanceof(Models.RetrieveSingleHeroModel);
    // });

    it('Should Return Unauthorized Single Hero ', async function () {
        const mockHeroId = 1;
        const getSingleHeroSpy = chai.spy.on(mockHerokuAPIAdapter, 'getSingleHero');
        const result = await mockHeroRepository.getSingleHero(mockHeroId);
        expect(getSingleHeroSpy).to.have.been.called.exactly(1);

        expect(result).to.be.an.instanceof(Models.RetrieveHeroListModel);
        const heroList = result.heroes;
        expect(heroList).to.be.an('array');
        const singleHero = heroList[0];
        expect(singleHero).to.be.an.instanceof(Models.RetrieveSingleHeroModel);
    });


});
