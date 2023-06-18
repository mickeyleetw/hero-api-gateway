import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { HeroAppError } from '../errorHandle.js';
import app from '../../../app.js';

chai.use(chaiHttp);
const should = chai.should();


describe('Get Unauthorized Hero Request', () => {
    it('return 200 and unauthorized hero information', (done) => {
        const heroId = 1;
        chai.request(app).get(`/heroes/${heroId}`).end((error, response) => {
            if (error) {
                expect(response.status).not.equal(200);
                expect(error).to.be.an.instanceof(HeroAppError);
                return done(error);
            }
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
            const hero = response.body;
            expect(hero.id).to.be.a('string');
            hero.id.should.equal(String(heroId));
            expect(hero.name).to.be.a('string');
            hero.name.should.equal('Daredevil');
            expect(hero.image).to.be.a('string');
            hero.image.should.equal('http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg');

            done();
        });
    });
});


describe('Get Unauthorized Heroes Request', () => {
    it('return 200 and unauthorized hero information list', (done) => {
        chai.request(app).get('/heroes').end((error, response) => {
            if (error) {
                expect(response.status).not.equal(200);
                expect(error).to.be.an.instanceof(HeroAppError);
                return done(error);
            }
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body.heroes).to.be.an('array');
            const heroList = response.body.heroes;
            if (heroList.length > 0) {
                for (let i = 0; i < heroList.length; i++) {
                    expect(heroList[i].id).to.be.a('string');
                    heroList[i].id.should.equal(String(i + 1));
                    expect(heroList[i].name).to.be.a('string');
                    expect(heroList[i].image).to.be.a('string');
                };
            }
            heroList[0].name.should.equal('Daredevil');
            heroList[0].image.should.equal('http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg');

            done();
        });
    });

});