import { expect } from 'chai';
import { MockHerokuAdapter } from '../mockServer.js';
import * as Models from '../models/index.js';
import { HerokuAppError } from '../errorHandle.js';


describe('Test Heroku Adapter Function', function () {

    const mockServer = new MockHerokuAdapter();
    const mockHerokuAdapter = mockServer.mockHerokuAdapter

    beforeEach(function () { mockServer.init(); });

    afterEach(function () { mockServer.reset(); });

    it('Should Return Heroku Hero List ', async function () {
        const result = await mockHerokuAdapter.getHeroes();
        expect(result).to.be.an('array');
        const resp_data = result[0];
        expect(resp_data).to.be.an.instanceof(Models.RetrieveHerokuHeroModel);
        expect(resp_data.id).to.equal(mockServer.mockHerosResponse[0].id);
        expect(resp_data.name).to.equal(mockServer.mockHerosResponse[0].name);
        expect(resp_data.image).to.equal(mockServer.mockHerosResponse[0].image);
    });

    it('Should Return Heroku Single Hero ', async function () {
        const result = await mockHerokuAdapter.getSingleHero(mockServer.mockHeroId01);
        expect(result).to.be.an.instanceof(Models.RetrieveHerokuHeroModel);
        expect(result.id).to.equal(mockServer.mockSingleHeroResponse.id);
        expect(result.name).to.equal(mockServer.mockSingleHeroResponse.name);
        expect(result.image).to.equal(mockServer.mockSingleHeroResponse.image);
    });

    it('Return 200 but Heroku server error', async function () {
        try {
            await mockHerokuAdapter.getSingleHero(mockServer.mockErrorHeroId);
            expect.fail('Expected HerokuAppError')
        } catch (error) {
            expect(error).to.be.an.instanceof(HerokuAppError);
            expect(error.status_code).to.equal(200);
            expect(error.msg).to.equal(`Heroku ${mockServer.mockHerokuBackendErrorResponse.message}`);
        }
    });

    it('Should Return 200 & Heroku SingleHeroProfile ', async function () {
        const result = await mockHerokuAdapter.getSingleHeroProfile(mockServer.mockHeroId01);
        expect(result).to.be.an.instanceof(Models.RetrieveHerokuHeroProfileModel);
        expect(result.agi).to.equal(mockServer.mockSingleHeroProfileResponse01.agi);
        expect(result.int).to.equal(mockServer.mockSingleHeroProfileResponse01.int);
        expect(result.luk).to.equal(mockServer.mockSingleHeroProfileResponse01.luk);
        expect(result.str).to.equal(mockServer.mockSingleHeroProfileResponse01.str);
    });

    it('Should Return 200 & if authorized ', async function () {
        const result = await mockHerokuAdapter.authUser(mockServer.mockAuthPayload.name, mockServer.mockAuthPayload.password);
        expect(result).to.be.an.instanceof(Object);
        expect(result.status).to.equal(200);
        expect(result.data.message).to.equal(mockServer.mockAuthResponse.message);
    });

});