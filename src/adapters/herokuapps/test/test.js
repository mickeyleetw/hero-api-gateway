import nock from 'nock';
import { expect } from 'chai';
import { HerokuAPIAdapter } from '../adapter.js';
import { HEROKU_BASEURL } from '../../../config.js';
import * as Models from '../models/index.js';
import { HerokuAppError } from '../errorHandle.js';


describe('Test Heroku Adapter Function', function () {

    const mockHerokuAdapter = new HerokuAPIAdapter();
    const mockHeroId = 1;
    const mockErrorHeroId = 2;
    const mockAuthPayload = { 'name': 'testName', 'password': 'testPassword' }

    const mockHerosResponse = [
        { 'id': '1', 'name': 'testName01', 'image': 'testImage01' }, { 'id': '2', 'name': 'testName02', 'image': 'testImage02' },
    ]
    const mockSingleHeroResponse = mockHerosResponse[0];
    const mockSingleHeroProfileResponse = { 'str': 2, 'int': 7, 'agi': 9, 'luk': 7 }
    const mockAuthResponse = { 'message': 'OK' }
    const mockHerokuBackendErrorResponse = { 'code': 1000, 'message': 'Backend Error' }

    beforeEach(function () {
        nock(`${HEROKU_BASEURL}`).get('/heroes').reply(200, mockHerosResponse);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${mockHeroId}`).reply(200, mockSingleHeroResponse);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${mockErrorHeroId}`).reply(200, mockHerokuBackendErrorResponse);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${mockHeroId}/profile`).reply(200, mockSingleHeroProfileResponse);
        nock(`${HEROKU_BASEURL}`).post('/auth', mockAuthPayload).reply(200, mockAuthResponse);
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
        const result = await mockHerokuAdapter.getSingleHero(mockHeroId);
        expect(result).to.be.an.instanceof(Models.RetrieveHerokuHeroModel);
        expect(result.id).to.equal(mockSingleHeroResponse.id);
        expect(result.name).to.equal(mockSingleHeroResponse.name);
        expect(result.image).to.equal(mockSingleHeroResponse.image);
    });

    it('Return 200 but Heroku server error', async function () {
        try {
            await mockHerokuAdapter.getSingleHero(mockErrorHeroId);
            expect.fail('Expected HerokuAppError')
        } catch (error) {
            expect(error).to.be.an.instanceof(HerokuAppError);
            expect(error.status_code).to.equal(200);
            expect(error.msg).to.equal(`Heroku ${mockHerokuBackendErrorResponse.message}`);
        }
    });

    it('Should Return 200 & Heroku SingleHeroProfile ', async function () {
        const result = await mockHerokuAdapter.getSingleHeroProfile(mockHeroId);
        expect(result).to.be.an.instanceof(Models.RetrieveHerokuHeroProfileModel);
        expect(result.agi).to.equal(mockSingleHeroProfileResponse.agi);
        expect(result.int).to.equal(mockSingleHeroProfileResponse.int);
        expect(result.luk).to.equal(mockSingleHeroProfileResponse.luk);
        expect(result.str).to.equal(mockSingleHeroProfileResponse.str);
    });

    it('Should Return 200 & if authorized ', async function () {
        const result = await mockHerokuAdapter.authUser(mockAuthPayload.name, mockAuthPayload.password);
        expect(result).to.be.an.instanceof(Object);
        expect(result.status).to.equal(200);
        expect(result.data.message).to.equal(mockAuthResponse.message);
    });

});