/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai';
import { MockHerokuAdapter } from '../mockServer.js';
import * as Models from '../models/index.js';
import { HerokuAppError } from '../errorHandle.js';

describe('Test Heroku Adapter Function', () => {
  const mockServer = new MockHerokuAdapter();
  const { mockHerokuAdapter } = mockServer;

  beforeEach(() => { mockServer.init(); });

  afterEach(() => { mockServer.reset(); });

  it('Should Return Unauthorized Heroku Hero List', async () => {
    const result = await mockHerokuAdapter.getHeroes();
    expect(result).to.be.an('array');
    const respData = result[0];
    expect(respData).to.be.an.instanceof(Models.RetrieveHerokuHeroModel);
    expect(respData.id).to.equal(mockServer.mockHeroesResponse[0].id);
    expect(respData.name).to.equal(mockServer.mockHeroesResponse[0].name);
    expect(respData.image).to.equal(mockServer.mockHeroesResponse[0].image);
  });

  it('Should Return Unauthorized Heroku Single Hero', async () => {
    const result = await mockHerokuAdapter.getSingleHero(mockServer.mockHeroId01);
    expect(result).to.be.an.instanceof(Models.RetrieveHerokuHeroModel);
    expect(result.id).to.equal(mockServer.mockSingleHeroResponse.id);
    expect(result.name).to.equal(mockServer.mockSingleHeroResponse.name);
    expect(result.image).to.equal(mockServer.mockSingleHeroResponse.image);
  });

  it('Return 200 but Heroku server error', async () => {
    try {
      await mockHerokuAdapter.getSingleHero(mockServer.mockErrorHeroId);
      expect.fail('Expected HerokuAppError');
    } catch (error) {
      expect(error).to.be.an.instanceof(HerokuAppError);
      expect(error.statusCode).to.equal(200);
      expect(error.msg).to.equal(`Heroku ${mockServer.mockHerokuBackendErrorResponse.message}`);
    }
  });

  it('Should Return Heroku SingleHeroProfile ', async () => {
    const result = await mockHerokuAdapter.getSingleHeroProfile(mockServer.mockHeroId01);
    expect(result).to.be.an.instanceof(Models.RetrieveHerokuHeroProfileModel);
    expect(result.agi).to.equal(mockServer.mockSingleHeroProfileResponse01.agi);
    expect(result.int).to.equal(mockServer.mockSingleHeroProfileResponse01.int);
    expect(result.luk).to.equal(mockServer.mockSingleHeroProfileResponse01.luk);
    expect(result.str).to.equal(mockServer.mockSingleHeroProfileResponse01.str);
  });

  it('Should Return 200 & if authorized ', async () => {
    const result = await mockHerokuAdapter.authUser(
      mockServer.mockAuthPayload.name,
      mockServer.mockAuthPayload.password,
    );
    expect(result).to.be.an.instanceof(Object);
    expect(result.status).to.equal(200);
    expect(result.data.message).to.equal(mockServer.mockAuthResponse.message);
  });
});
