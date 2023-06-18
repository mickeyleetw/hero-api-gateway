import nock from 'nock';
import { HerokuAPIAdapter } from './adapter.js';
import { HEROKU_BASEURL } from '../../config.js';

export class MockHerokuAdapter {

    mockHerokuAdapter = new HerokuAPIAdapter();
    mockHeroId01 = 1;
    mockHeroId02 = 2;
    mockErrorHeroId = 3;
    mockAuthPayload = { 'name': 'testName', 'password': 'testPassword' };
    mockHerosResponse = [
        { 'id': '1', 'name': 'testName01', 'image': 'testImage01' }, { 'id': '2', 'name': 'testName02', 'image': 'testImage02' },
    ];
    mockSingleHeroResponse = this.mockHerosResponse[0];
    mockSingleHeroProfileResponse01 = { 'str': 2, 'int': 7, 'agi': 9, 'luk': 7 };
    mockSingleHeroProfileResponse02 = { 'str': 1, 'int': 1, 'agi': 1, 'luk': 0 };
    mockAuthResponse = { 'message': 'OK' };
    mockHerokuBackendErrorResponse = { 'code': 1000, 'message': 'Backend Error' };

    init() {
        nock(`${HEROKU_BASEURL}`).get('/heroes').reply(200, this.mockHerosResponse);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${this.mockHeroId01}`).reply(200, this.mockSingleHeroResponse);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${this.mockErrorHeroId}`).reply(200, this.mockHerokuBackendErrorResponse);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${this.mockHeroId01}/profile`).reply(200, this.mockSingleHeroProfileResponse01);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${this.mockHeroId02}/profile`).reply(200, this.mockSingleHeroProfileResponse02);
        nock(`${HEROKU_BASEURL}`).post('/auth', this.mockAuthPayload).reply(200, this.mockAuthResponse);
    }

    reset() {
        nock.cleanAll();
    }
}