import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { HerokuAppError } from '../../adapters/index.js';
import HeroRepository from '../../repositories/index.js';
import app from '../../../app.js';
import * as Models from '../../models/index.js';

chai.use(chaiHttp);
const should = chai.should();

describe('Test Hero API Server', function () {

    const mockHeroRepository = new HeroRepository();

    const mockHeroId01 = 1;
    const isAuthUserStub = sinon.stub(mockHeroRepository, 'isAuthUser');
    const getHeroListStub = sinon.stub(mockHeroRepository, 'getHeroList');
    const mockHeroList = [new Models.RetrieveSingleHeroModel(mockHeroId01, 'test01', 'image01'), new Models.RetrieveSingleHeroModel(2, 'test02', 'image02')]
    const getSingleHeroStub = sinon.stub(mockHeroRepository, 'getSingleHero');
    const mockSingleHero = mockHeroList[0]
    const getAuthenticatedHeroListStub = sinon.stub(mockHeroRepository, 'getAuthenticatedHeroList');
    const mockAuthenticatedHeroList = [
        new Models.RetrieveSingleHeroDetailModel(mockHeroId01, 'test01', 'image01', 1, 2, 3, 4),
        new Models.RetrieveSingleHeroDetailModel(2, 'test02', 'image02', 5, 6, 7, 8)
    ];
    const getAuthenticatedSingleHeroStub = sinon.stub(mockHeroRepository, 'getAuthenticatedSingleHero');
    const mockAuthenticatedSingleHero = mockAuthenticatedHeroList[0];

    beforeEach(() => {
        isAuthUserStub.returns(true);
        getHeroListStub.returns(new Models.RetrieveHeroListModel(mockHeroList));
        getSingleHeroStub.returns(mockSingleHero);
        getAuthenticatedHeroListStub.returns(new Models.RetrieveHeroDetailListModel(mockAuthenticatedHeroList));
        getAuthenticatedSingleHeroStub.returns(mockAuthenticatedSingleHero);
    });

    afterEach(() => {
        isAuthUserStub.restore();
        getHeroListStub.restore();
        getSingleHeroStub.restore();
        getAuthenticatedHeroListStub.restore();
        getAuthenticatedSingleHeroStub.restore();
    });

    it('Should Return Unauthorized Single Hero', (done) => {
        try {
            chai.request(app).get(`/heroes/${mockHeroId01}`).end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.be.an.instanceOf(Models.RetrieveSingleHeroModel);

                const { hero } = response;
                expect(hero.id).to.be.an.instanceOf(String);
                hero.id.should.equal(mockSingleHero.id);
                expect(hero.name).to.be.an.instanceOf(String);
                hero.name.should.equal(mockSingleHero.name);
                expect(hero.image).to.be.an.instanceOf(String);
                hero.image.should.equal(mockSingleHero.image);
            });
        } catch (error) {
            if (typeof error === 'HeroAppError') {
                expect(error.statusCode).to.equal(500);
                expect(error.message).to.equal('Internal Server Error');
                return done(error);
            } else {
                expect(error).to.be.an.instanceof(HerokuAppError);
                return done(error);
            }
        }
        return done();
    });

    it('Should Return Authorized Single Hero', (done) => {
        try {
            (chai.request(app).get(`/heroes/${mockHeroId01}`)).set('name','test').set('password','test').end((error, response) => {
                expect(response).to.have.status(200);
                const { hero } = response.body  ;

                expect(hero).to.be.an.instanceOf(Models.RetrieveSingleHeroDetailModel);
                expect(hero.id).to.be.an.instanceOf(String);
                hero.id.should.equal(mockAuthenticatedSingleHero.id);
                expect(hero.name).to.be.an.instanceOf(String);
                hero.name.should.equal(mockAuthenticatedSingleHero.name);
                expect(hero.image).to.be.an.instanceOf(String);
                hero.image.should.equal(mockAuthenticatedSingleHero.image);
                
                const { profile } = hero;
                expect(profile).to.be.an.instanceOf(Models.HeroProfileModel);
                expect(profile.int).to.be.an.instanceOf(Number);
                profile.int.should.equal(mockAuthenticatedSingleHero.profile.int);
                expect(profile.str).to.be.an.instanceOf(Number);
                profile.str.should.equal(mockAuthenticatedSingleHero.profile.str);
                expect(profile.agi).to.be.an.instanceOf(Number);
                profile.agi.should.equal(mockAuthenticatedSingleHero.profile.agi);
                expect(profile.luk).to.be.an.instanceOf(Number);
                profile.luk.should.equal(mockAuthenticatedSingleHero.profile.luk);

            });
        } catch (error) {
            if (typeof error === 'HeroAppError') {
                expect(error.statusCode).to.equal(500);
                expect(error.message).to.equal('Internal Server Error');
                return done(error);
            } else {
                expect(error).to.be.an.instanceof(HerokuAppError);
                return done(error);
            }
        }
        return done();
    });

    it('Should Return Unauthorized Hero List', (done) => {
        try {
            chai.request(app).get(`/heroes/`).end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.be.an.instanceOf(Models.RetrieveHeroListModel);

                const { heroes } = response;
                expect(heroes).to.be.an.instanceOf(Array);
                expect(heroes.length).to.equal(mockHeroList.length);
                const hero = heroes[0];
                expect(hero.id).to.be.an.instanceOf(String);
                hero.id.should.equal(mockSingleHero.id);
                expect(hero.name).to.be.an.instanceOf(String);
                hero.name.should.equal(mockSingleHero.name);
                expect(hero.image).to.be.an.instanceOf(String);
                hero.image.should.equal(mockSingleHero.image);
            });
        } catch (error) {
            if (typeof error === 'HeroAppError') {
                expect(error.statusCode).to.equal(500);
                expect(error.message).to.equal('Internal Server Error');
                return done(error);
            } else {
                expect(error).to.be.an.instanceof(HerokuAppError);
                return done(error);
            }
        }
        return done();
    });

    it('Should Return Authorized Hero List', (done) => {
        try {
            (chai.request(app).get(`/heroes`)).set('name','test').set('password','test').end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.be.an.instanceOf(Models.RetrieveHeroListDetailModel);

                const { heroes } = response;
                expect(heroes).to.be.an.instanceOf(Array);
                expect(heroes.length).to.equal(mockAuthenticatedHeroList.length);
                const hero = heroes[0];
                expect(hero).to.be.an.instanceOf(Models.RetrieveSingleHeroDetailModel);
                expect(hero.id).to.be.an.instanceOf(String);
                hero.id.should.equal(mockAuthenticatedSingleHero.id);
                expect(hero.name).to.be.an.instanceOf(String);
                hero.name.should.equal(mockAuthenticatedSingleHero.name);
                expect(hero.image).to.be.an.instanceOf(String);
                hero.image.should.equal(mockAuthenticatedSingleHero.image);
                
                const { profile } = hero;
                expect(profile).to.be.an.instanceOf(Models.HeroProfileModel);
                expect(profile.int).to.be.an.instanceOf(Number);
                profile.int.should.equal(mockAuthenticatedSingleHero.profile.int);
                expect(profile.str).to.be.an.instanceOf(Number);
                profile.str.should.equal(mockAuthenticatedSingleHero.profile.str);
                expect(profile.agi).to.be.an.instanceOf(Number);
                profile.agi.should.equal(mockAuthenticatedSingleHero.profile.agi);
                expect(profile.luk).to.be.an.instanceOf(Number);
                profile.luk.should.equal(mockAuthenticatedSingleHero.profile.luk);

            });
        } catch (error) {
            if (typeof error === 'HeroAppError') {
                expect(error.statusCode).to.equal(500);
                expect(error.message).to.equal('Internal Server Error');
                return done(error);
            } else {
                expect(error).to.be.an.instanceof(HerokuAppError);
                return done(error);
            }
        }
        return done();
    });

});