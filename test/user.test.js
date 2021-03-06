const app = require('../src/app');
const request = require('supertest');
const utilities = require('../src/utilities');

/*NOTE in TESTING access_token == validId
* In an actual case the access_toke is authomatically generated by google oauth
*
* NOTE FOR ALL COPY FOR ALL TEST 15 - 23
* */

const dummiesDB = require('./dummies');
beforeAll(() => {
    return dummiesDB.popDB();
});

afterAll(() => {
    return dummiesDB.cleanDB().then(() => dummiesDB.connection.end());
    //utilities.connection.end();
});


const dummyStud = dummiesDB.dummyStud;
const validId = dummyStud.id;
const invalidId = '999999999999999999999999';
const pureStringId = 'aaaaaaaaaaaaaaaaaaaaaa';

describe('GENERIC user test cases', async () => {
    test('app module should be defined', () => {
        expect.assertions(1);
        expect(app).toBeDefined();
    });
});


describe('GET user test cases', async () => {
    test('GET / should return 200', async () => {
        expect.assertions(1);
        let response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    test('GET /users/validId?access_token=validId; should return 200 + users obj', async () => {
        expect.assertions(4);
        let response = await request(app).get('/users/' + validId + '?access_token=' + validId);
        expect(response.statusCode).toBe(200);
        let userGET = {
            id: response.body.id,
            name: response.body.name,
            surname: response.body.surname,
            email: response.body.email,
            born: response.body.born,
            enrolled: response.body.enrolled,
            exam_eval: [],
            submissions: []
        };
        expect(userGET).toEqual(dummyStud);
        expect(response.body.submissions.length).toBe(1);
        expect(response.body.exam_eval.length).toBe(1);
    });

    test('GET /users/validId?access_token=invalidId; should return 401 + {} obj', async () => {
        expect.assertions(2);
        let response = await request(app).get('/users/' + validId + '?access_token=' + invalidId);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });

    test('GET /users/validId?access_token=invalidId; should return 401 + {} obj', async () => {
        expect.assertions(2);
        let response = await request(app).get('/users/' + validId + '?access_token=' + invalidId);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });

    test('GET /users/invalidId?access_token=validId should return 404 + empty obj', async () => {
        expect.assertions(2);
        let response = await request(app).get('/users/' + invalidId + '?access_token=' + validId);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({});
    });


    test('GET /users/purestringid?access_token=validId with string as id in the uri; should return 404 + empty obj', async () => {
        expect.assertions(2);
        let response = await request(app).get('/users/' + pureStringId + '?access_token=' + validId);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({});
    });

    test('GET /users?access_token=validId without parameter; should return 200 + all users in the system', async () => {
        expect.assertions(3);
        let response = await request(app).get('/users?access_token=' + validId);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(4);
        expect(utilities.isAnArrayOfUser(response.body)).toBe(true);
    });

    test('GET /users?access_token=validId with only enrolledBefore param; should return 200 + all users in the system enrolled before 2019', async () => {
        expect.assertions(3);
        let response = await request(app).get('/users?access_token=' + validId).query({ enrolledBefore: '2019' });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(4);
        expect(utilities.isAnArrayOfUser(response.body)).toBe(true);
    });

    test('GET /users?access_token=validId with only enrolledBefore param; should return 200 + all users in the system enrolled after 2012', async () => {
        expect.assertions(4);
        let response = await request(app).get('/users?access_token=' + validId).query({ enrolledAfter: '2012' });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
        expect(utilities.isAnArrayOfUser(response.body)).toBe(true);
        let before = false; // true if there is a user that has been enrolled before 2012
        for (let user of response.body) {
            if (user.enrolled != null && user.enrolled < 2012)
                before = true;
        }
        expect(before).toBe(false);
    });

    test('GET /users?access_token=validId with enrolledAfter & enrolledBefore param; should return 200 + all users in the system enrolled in [2010-2013]', async () => {
        expect.assertions(4);
        let response = await request(app).get('/users?access_token=' + validId).query({ enrolledAfter: '2010', enrolledBefore: '2013' });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
        expect(utilities.isAnArrayOfUser(response.body)).toBe(true);
        let before = false; // true if there is a user that has been enrolled before 2010
        let after = false; // true if there is a user that has been enrolled after 2013
        for (let user of response.body) {
            if (user.enrolled != null && user.enrolled < 2010)
                before = true;
            if (user.enrolled != null && user.enrolled > 2013)
                before = true;
        }
        expect(before || after).toBe(false);
    });

    test('GET /users?access_token=validId with alpha sorting, enrolledAfter & enrolledBefore param; should return 200 + all users in the system enrolled in [2010-2013]', async () => {
        expect.assertions(5);
        let response = await request(app).get('/users?access_token=' + validId).query({ sortUsrBy: 'alpha', enrolledAfter: '2010', enrolledBefore: '2013' });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
        expect(utilities.isAnArrayOfUser(response.body)).toBe(true);
        let before = false; // true if there is a user that has been enrolled before 2010
        let after = false; // true if there is a user that has been enrolled after 2013
        for (let user of response.body) {
            if (user.enrolled != null && user.enrolled < 2010)
                before = true;
            if (user.enrolled != null && user.enrolled > 2013)
                before = true;
        }
        expect(before || after).toBe(false);
        expect(response.body.sort(utilities.compareAlfa)).toEqual(response.body);//alpha sorted
    });

    test('GET /users?access_token=validId with enrol sorting param; should return 200 + all users in the system', async () => {
        expect.assertions(4);
        let response = await request(app).get('/users?access_token=' + validId).query({ sortUsrBy: 'enrol' });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(4);
        expect(utilities.isAnArrayOfUser(response.body)).toBe(true);
        expect(response.body.sort(utilities.compareEnrol)).toEqual(response.body);//enrol sorted
    });

    test('GET /users?access_token=validId with enrol sorting, enrolledAfter & enrolledBefore param; should return 200 + all users in the system', async () => {
        expect.assertions(5);
        let response = await request(app).get('/users?access_token=' + validId).query({ sortUsrBy: 'enrol', enrolledAfter: '1970', enrolledBefore: '2019' });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(4);
        expect(utilities.isAnArrayOfUser(response.body)).toBe(true);
        let before = false; // true if there is a user that has been enrolled before 2010
        let after = false; // true if there is a user that has been enrolled after 2013
        for (let user of response.body) {
            if (user.enrolled != null && user.enrolled < 1970)
                before = true;
            if (user.enrolled != null && user.enrolled > 2019)
                before = true;
        }
        expect(before || after).toBe(false);
        expect(response.body.sort(utilities.compareEnrol)).toEqual(response.body);//enrol sorted
    });

    test('GET /users?access_token=validId with enrol sorting param; should return 200 + all users in the system', async () => {
        expect.assertions(4);
        let response = await request(app).get('/users?access_token=' + validId).query({ sortUsrBy: 'enrol' });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(4);
        expect(utilities.isAnArrayOfUser(response.body)).toBe(true);
        expect(response.body.sort(utilities.compareEnrol)).toEqual(response.body);//enrol sorted
    });


    test('GET /users?access_token=invalidId; should return 401 + null Fields', async () => {
        expect.assertions(2);
        let response = await request(app).get('/users?access_token=' + invalidId);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
});

describe('PUT user test cases', async () => {
    test('PUT /users/validId; should return 200 + users obj', async () => {
        expect.assertions(2);
        dummyStud.name = 'Giorgio';
        let response = await request(app).put('/users/' + validId).set('Authorization', 'Bearer ' + validId).send(dummyStud);
        expect(response.statusCode).toBe(200);
        let userPUT = {
            id: response.body.id,
            name: response.body.name,
            surname: response.body.surname,
            email: response.body.email,
            born: response.body.born,
            enrolled: response.body.enrolled,
            exam_eval: [],
            submissions: []
        };
        expect(userPUT).toEqual(dummyStud);
    });

    test('PUT /users/validId with wrong access token; should return 401 + obj {}', async () => {
        expect.assertions(2);
        let response = await request(app).put('/users/' + validId).set('Authorization', 'Bearer ' + invalidId).send(dummyStud);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });

    test('PUT /users/invalidId with wrong access token; should return 401 + obj {}', async () => {
        expect.assertions(2);
        let response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + invalidId).send(dummyStud);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });

    test('PUT /users/validId with wrong access token; should return 401 + obj {}', async () => {
        expect.assertions(2);
        let response = await request(app).put('/users/' + validId).set('Authorization', 'Bearer ' + invalidId).send(dummyStud);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });

    test('PUT /users/invalidId with wrong access token; should return 401 + obj {}', async () => {
        expect.assertions(2);
        let response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + invalidId).send(dummyStud);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });

    test('PUT /users/invalidId; should return 403', async () => {
        let response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + validId).send(dummyStud);
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({});
    });

    test('PUT /users/validId with invalid data in body; should return 400', async () => {
        expect.assertions(2);
        let response = await request(app).put('/users/' + validId).set('Authorization', 'Bearer ' + validId).send({
            id: validId,
            name: 'John',
            surname: null
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });

    test('PUT /users/invalidId with right access_token but no body; should return 403', async () => {
        expect.assertions(2);
        let response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + validId).send({});
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({});
    });

    test('PUT /users/invalidId with right access_token; should return 400', async () => {
        expect.assertions(2);
        let response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + validId).send({
            id: invalidId,
            name: 'Giovanni',
            surname: 'Guadagnini',
            email: 'giovanni.guadagnini@gmail.com',
            enrolled: '2012'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });

    test('PUT /users/pureStringId with string as id in the uri; should return 403', async () => {
        expect.assertions(2);
        let response = await request(app).put('/users/' + pureStringId).set('Authorization', 'Bearer ' + validId).send(dummyStud);
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({});
    });

    test('PUT /users/invalidId without parameter; should return 403', async () => {
        expect.assertions(2);
        let response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + validId).send(null);
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({});
    });

    test('PUT /users/pureStringId with string as id in the uri and without parameter; should return 403', async () => {
        expect.assertions(2);
        let response = await request(app).put('/users/' + pureStringId).set('Authorization', 'Bearer ' + validId).send(null);
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({});
    });
});

describe('DELETE user test cases', async () => {

    test('DELETE /users/validId; should return 200 + users obj', async () => {
        expect.assertions(2);
        let response = await request(app).delete('/users/' + validId).set('Authorization', 'Bearer ' + validId).send(dummyStud);
        expect(response.statusCode).toBe(200);
        let userDELETE = {
            id: response.body.id,
            name: response.body.name,
            surname: response.body.surname,
            email: response.body.email,
            born: response.body.born,
            enrolled: response.body.enrolled,
            exam_eval: [],
            submissions: []
        };
        expect(userDELETE).toEqual(dummyStud);
    });

    test('DELETE /users/invalidId in the uri and no body; should return 401 + {}', async () => {
        expect.assertions(2);
        let response = await request(app).delete('/users/' + invalidId).set('Authorization', 'Bearer ' + validId);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });

    test('DELETE /users/invalidId in the uri + validAccessToken + invalidId in body; should return 401 + {}', async () => {
        expect.assertions(2);
        let response = await request(app).delete('/users/' + invalidId).set('Authorization', 'Bearer ' + validId).send({ id: invalidId });
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });

    test('DELETE /users/invalidId in the uri + invalidAccessToken + invalidId in body; should return 401 + {}', async () => {
        expect.assertions(2);
        let response = await request(app).delete('/users/' + invalidId).set('Authorization', 'Bearer ' + invalidId).send({ id: invalidId });
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });

    test('DELETE /users/pureStringId with string as id in the uri and no body; should return 401 + {}', async () => {
        expect.assertions(2);
        let response = await request(app).delete('/users/' + pureStringId).set('Authorization', 'Bearer ' + validId);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
});
