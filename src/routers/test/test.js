import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { HerokuAppError } from '../../adapters/index.js';
import { getHeroListHandler, getSingleHeroHandler } from '../hero.js';
import * as Models from '../../models/index.js';
import express from 'express';

chai.use(chaiHttp);
const should = chai.should();

describe('Test Hero API Server', function () {

    let mockHeroRepository;
    let mockHeroId01 = 1;
    const mockHeroList = [new Models.RetrieveSingleHeroModel(mockHeroId01, 'test01', 'image01'), new Models.RetrieveSingleHeroModel(2, 'test02', 'image02')]
    const mockSingleHero = mockHeroList[0]
    const mockAuthenticatedHeroList = [
        new Models.RetrieveSingleHeroDetailModel(mockHeroId01, 'test01', 'image01', 1, 2, 3, 4),
        new Models.RetrieveSingleHeroDetailModel(2, 'test02', 'image02', 5, 6, 7, 8)
    ];
    const mockAuthenticatedSingleHero = mockAuthenticatedHeroList[0];

    beforeEach(() => {
        mockHeroRepository = {
            isAuthUser: sinon.stub(),
            getHeroList: sinon.stub(),
            getSingleHero: sinon.stub(),
            getAuthenticatedHeroList: sinon.stub(),
            getAuthenticatedSingleHero: sinon.stub(),
        };

        mockHeroRepository.getSingleHero.returns(mockSingleHero);
        mockHeroRepository.isAuthUser.returns(true);
        mockHeroRepository.getHeroList.returns(new Models.RetrieveHeroListModel(mockHeroList));
        mockHeroRepository.getAuthenticatedHeroList.returns(new Models.RetrieveHeroDetailListModel(mockAuthenticatedHeroList));
        mockHeroRepository.getAuthenticatedSingleHero.returns(mockAuthenticatedSingleHero);
    });

    afterEach(() => {
        mockHeroRepository.isAuthUser.reset();
        mockHeroRepository.getHeroList.reset();
        mockHeroRepository.getSingleHero.reset();
        mockHeroRepository.getAuthenticatedHeroList.reset();
        mockHeroRepository.getAuthenticatedSingleHero.reset();
    });

    it('Should Return Unauthorized Single Hero', async () => {
        const testApp = express()
        try {
            testApp.get(`/heroes/${mockHeroId01}`, getSingleHeroHandler(mockHeroRepository));
            const response = await chai.request(testApp).get(`/heroes/${mockHeroId01}`);
            expect(response).to.have.status(200);
            expect(response.body).to.be.an.instanceOf(Object);
            const hero_resp = response.body;
            expect(hero_resp.id).to.be.a('Number');
            hero_resp.id.should.equal(mockSingleHero.id);
            expect(hero_resp.name).to.be.a('String');
            hero_resp.name.should.equal(mockSingleHero.name);
            expect(hero_resp.image).to.be.a('String');
            hero_resp.image.should.equal(mockSingleHero.image);
        } catch (error) {
            if (typeof error === 'HeroAppError') {
                expect(error.statusCode).to.equal(500);
                expect(error.message).to.equal('Internal Server Error');
            } else {
                expect(error).to.be.an.instanceof(HerokuAppError);
            }
        }

    });

    it('Should Return Authorized Single Hero', async () => {
        const testApp = express()
        try {
            testApp.get(`/heroes/${mockHeroId01}`, getSingleHeroHandler(mockHeroRepository));
            const response = await chai.request(testApp).get(`/heroes/${mockHeroId01}`).set('name', 'test').set('password', 'test');
            expect(response).to.have.status(200);
            expect(response.body).to.be.an.instanceOf(Object);
            const hero_resp = response.body;
            expect(hero_resp.id).to.be.a('Number');
            hero_resp.id.should.equal(mockSingleHero.id);
            expect(hero_resp.name).to.be.a('String');
            hero_resp.name.should.equal(mockSingleHero.name);
            expect(hero_resp.image).to.be.a('String');
            hero_resp.image.should.equal(mockSingleHero.image);

            const profile = hero_resp.profile;
            expect(profile).to.be.an.instanceOf(Object);
            expect(profile.int).to.be.a('Number');
            profile.int.should.equal(mockAuthenticatedSingleHero.profile.int);
            expect(profile.str).to.be.a('Number');
            profile.str.should.equal(mockAuthenticatedSingleHero.profile.str);
            expect(profile.agi).to.be.a('Number');
            profile.agi.should.equal(mockAuthenticatedSingleHero.profile.agi);
            expect(profile.luk).to.be.a('Number');
            profile.luk.should.equal(mockAuthenticatedSingleHero.profile.luk);
        } catch (error) {
            if (typeof error === 'HeroAppError') {
                expect(error.statusCode).to.equal(500);
                expect(error.message).to.equal('Internal Server Error');
            } else {
                expect(error).to.be.an.instanceof(HerokuAppError);
            }
        }

    });

    it('Should Return Unauthorized Hero List', async () => {
        const testApp = express()
        try {
            testApp.get(`/heroes`, getHeroListHandler(mockHeroRepository));
            const response = await chai.request(testApp).get(`/heroes`);
            expect(response).to.have.status(200);
            expect(response.body).to.be.an.instanceOf(Object);
            const heroList = response.body.heroes;
            expect(heroList).to.be.an.instanceOf(Array);
            expect(heroList.length).to.equal(mockHeroList.length);
            const hero_resp = heroList[0];
            expect(hero_resp.id).to.be.a('Number');
            hero_resp.id.should.equal(mockSingleHero.id);
            expect(hero_resp.name).to.be.a('String');
            hero_resp.name.should.equal(mockSingleHero.name);
            expect(hero_resp.image).to.be.a('String');
            hero_resp.image.should.equal(mockSingleHero.image);
        } catch (error) {
            if (typeof error === 'HeroAppError') {
                expect(error.statusCode).to.equal(500);
                expect(error.message).to.equal('Internal Server Error');
            } else {
                expect(error).to.be.an.instanceof(HerokuAppError);
            }
        }

    });

    it('Should Return Authorized Hero List', async () => {
        const testApp = express()
        try {
            testApp.get(`/heroes`, getHeroListHandler(mockHeroRepository));
            const response = await chai.request(testApp).get(`/heroes`).set('name', 'test').set('password', 'test');
            expect(response).to.have.status(200);
            expect(response.body).to.be.an.instanceOf(Object);
            const heroList = response.body.heroes;
            expect(heroList).to.be.an.instanceOf(Array);
            expect(heroList.length).to.equal(mockHeroList.length);
            const hero_resp = heroList[0];
            expect(hero_resp.id).to.be.a('Number');
            hero_resp.id.should.equal(mockSingleHero.id);
            expect(hero_resp.name).to.be.a('String');
            hero_resp.name.should.equal(mockSingleHero.name);
            expect(hero_resp.image).to.be.a('String');
            hero_resp.image.should.equal(mockSingleHero.image);

            const profile = hero_resp.profile;
            expect(profile).to.be.an.instanceOf(Object);
            expect(profile.int).to.be.a('Number');
            profile.int.should.equal(mockAuthenticatedSingleHero.profile.int);
            expect(profile.str).to.be.a('Number');
            profile.str.should.equal(mockAuthenticatedSingleHero.profile.str);
            expect(profile.agi).to.be.a('Number');
            profile.agi.should.equal(mockAuthenticatedSingleHero.profile.agi);
            expect(profile.luk).to.be.a('Number');
            profile.luk.should.equal(mockAuthenticatedSingleHero.profile.luk);
        } catch (error) {
            if (typeof error === 'HeroAppError') {
                expect(error.statusCode).to.equal(500);
                expect(error.message).to.equal('Internal Server Error');
            } else {
                expect(error).to.be.an.instanceof(HerokuAppError);
            }
        }

    });

    it('Should Return 401 if Authorization Failed', async () => {
        const testApp = express()
        mockHeroRepository.isAuthUser.reset();
        mockHeroRepository.isAuthUser.returns(false);
        try {
            testApp.get(`/heroes`, getHeroListHandler(mockHeroRepository));
            const response = await chai.request(testApp).get(`/heroes`).set('name', 'testZZ').set('password', 'testZZ');
            expect(response).to.have.status(401);
        } catch (error) {
            if (typeof error === 'HeroAppError') {
                expect(error.statusCode).to.equal(500);
                expect(error.message).to.equal('Internal Server Error');
            } else {
                expect(error).to.be.an.instanceof(HerokuAppError);
            }
        }

    });

});