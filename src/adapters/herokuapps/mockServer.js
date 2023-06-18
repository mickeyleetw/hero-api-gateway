import nock from 'nock';
import { HerokuAPIAdapter } from './adapter.js';
import { HEROKU_BASEURL } from '../../config.js';

export class MockHerokuAdapter {

    mockHerokuAdapter = new HerokuAPIAdapter();
    mockHeroId = 1;
    mockErrorHeroId = 2;
    mockAuthPayload = { 'name': 'testName', 'password': 'testPassword' };
    mockHerosResponse = [
        { 'id': '1', 'name': 'testName01', 'image': 'testImage01' }, { 'id': '2', 'name': 'testName02', 'image': 'testImage02' },
    ];
    mockSingleHeroResponse = this.mockHerosResponse[0];
    mockSingleHeroProfileResponse = { 'str': 2, 'int': 7, 'agi': 9, 'luk': 7 };
    mockAuthResponse = { 'message': 'OK' };
    mockHerokuBackendErrorResponse = { 'code': 1000, 'message': 'Backend Error' };

    init() {
        nock(`${HEROKU_BASEURL}`).get('/heroes').reply(200, this.mockHerosResponse);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${this.mockHeroId}`).reply(200, this.mockSingleHeroResponse);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${this.mockErrorHeroId}`).reply(200, this.mockHerokuBackendErrorResponse);
        nock(`${HEROKU_BASEURL}`).get(`/heroes/${this.mockHeroId}/profile`).reply(200, this.mockSingleHeroProfileResponse);
        nock(`${HEROKU_BASEURL}`).post('/auth', this.mockAuthPayload).reply(200, this.mockAuthResponse);
    }

    reset() {
        nock.cleanAll();
    }
}