import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import { HerokuAPIAdapter } from '../adapter.js';
import { HEROKU_BASEURL } from '../../../config.js';
import * as Models from '../models/index.js';

chai.use(chaiHttp);


describe('Test Heroku App Response', function () {

    const mockHerokuAdapter = new HerokuAPIAdapter();
    const heroId = 1;
    const mockHerosResponse = [
        { 'id': '1', 'name': 'testName01', 'image': 'testImage01' }, { 'id': '2', 'name': 'testName02', 'image': 'testImage02' },
    ]
    const mockSingleHeroResponse = mockHerosResponse[0];
    const mockSingleHeroProfileResponse = { 'str': 2, 'int': 7, 'agi': 9, 'luk': 7 }
    const authPayload = { 'name': 'hahow', 'password': 'rocks' }
    const authResponse = { 'message': 'OK' }

    beforeEach(function () {
        nock(`${HEROKU_BASEURL}`).get('/heroes').reply(200, mockHerosResponse);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${heroId}`).reply(200, mockSingleHeroResponse);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${heroId}/profile`).reply(200, mockSingleHeroProfileResponse);
        nock(`${HEROKU_BASEURL}`).post('/auth', authPayload).reply(200, authResponse);
    });

    afterEach(function () { nock.cleanAll(); });


    it('Should Return 200 & Heroku HeroList ', async function () {
        const result = await mockHerokuAdapter.getHeroes();
        expect(result).to.be.an('array');
        const resp_data = result[0];
        expect(resp_data).to.be.an.instanceof(Models.RetrieveHerokuHeroModel);
        expect(resp_data.id).to.equal(mockHerosResponse[0].id);
        expect(resp_data.name).to.equal(mockHerosResponse[0].name);
        expect(resp_data.image).to.equal(mockHerosResponse[0].image);
    });

    it('Should Return 200 & Heroku SingleHero ', async function () {
        const result = await mockHerokuAdapter.getSingleHero(heroId);
        expect(result).to.be.an.instanceof(Models.RetrieveHerokuHeroModel);
        expect(result.id).to.equal(mockSingleHeroResponse.id);
        expect(result.name).to.equal(mockSingleHeroResponse.name);
        expect(result.image).to.equal(mockSingleHeroResponse.image);
    });

    it('Should Return 200 & Heroku SingleHeroProfile ', async function () {
        const result = await mockHerokuAdapter.getSingleHeroProfile(heroId);
        expect(result).to.be.an.instanceof(Models.RetrieveHerokuHeroProfileModel);
        expect(result.agi).to.equal(mockSingleHeroProfileResponse.agi);
        expect(result.int).to.equal(mockSingleHeroProfileResponse.int);
        expect(result.luk).to.equal(mockSingleHeroProfileResponse.luk);
        expect(result.str).to.equal(mockSingleHeroProfileResponse.str);
    });

    it('Should Return 200 & Heroku SingleHeroProfile ', async function () {
        const result = await mockHerokuAdapter.getSingleHeroProfile(heroId);
        expect(result).to.be.an.instanceof(Models.RetrieveHerokuHeroProfileModel);
        expect(result.agi).to.equal(mockSingleHeroProfileResponse.agi);
        expect(result.int).to.equal(mockSingleHeroProfileResponse.int);
        expect(result.luk).to.equal(mockSingleHeroProfileResponse.luk);
        expect(result.str).to.equal(mockSingleHeroProfileResponse.str);
    });

    
});