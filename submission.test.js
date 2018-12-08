const app = require('./app');
const request = require('supertest');
const dummiesDB = require('./dummies');
const utilities = require('./utilities');

/*NOTE in TESTING access_token == validId
* In an actual case the access_toke is authomatically generated by google oauth
* */

beforeAll(() => {
    return dummiesDB.popDB();
});

afterAll(() => {
    return dummiesDB.cleanDB().then(() => dummiesDB.connection.end());
});

const dummyStud = dummiesDB.dummyStud;
const dummyTeach = dummiesDB.dummyTeacher;
const dummyTeach2 = dummiesDB.dummyTeacher2;
const validStudId = dummyStud.id;
const validTeachId = dummyTeach.id;
const invalidId = '999999999999999999999999';
const pureStringId = 'aaaaaaaaaaaaaaaaaaaaaa';
let dummySubm;

test('app module should be defined', () => {
    expect.assertions(1);
    expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
    expect.assertions(1);
    let response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
});

test('GET /submissions?access_token=stud_id with user as student', async () => {
    expect.assertions(2);
    let response = await request(app).get('/submissions?access_token=' + validStudId);
    expect(response.statusCode).toBe(200);
    expect(utilities.isAnArrayOfSubmission(response.body)).toBe(true);
    dummySubm = response.body[0];
});
test('GET /submissions?access_token=teach_id with user as teacher', async () => {
    expect.assertions(2);
    let response = await request(app).get('/submissions?access_token=' + validTeachId);
    expect(response.statusCode).toBe(200);
    expect(utilities.isAnArrayOfSubmission(response.body)).toBe(true);
});

test('GET /submissions?access_token=invalid_id with user as invalid', async () => {
    expect.assertions(2);
    let response = await request(app).get('/submissions?access_token=' + invalidId);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
});

test('GET /submissions?access_token=teacher2_id  with user as teacher without privileges to see anything', async () => {
    expect.assertions(2);
    let response = await request(app).get('/submissions?access_token=' + dummyTeach2.id);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
});

test('GET /submissions/id?access_token=stud_id with user as student', async () => {
    expect.assertions(2);
    let response = await request(app).get('/submissions/'+ dummySubm.id +'?access_token=' + validStudId);
    expect(response.statusCode).toBe(200);
    expect(utilities.isASubmission(response.body)).toBe(true);
});

test('GET /submissions/id_notvalid?access_token=stud_id with user as student', async () => {
    expect.assertions(2);
    let response = await request(app).get('/submissions/'+ -1000 +'?access_token=' + validStudId);
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual('Submission not found');
});

test('GET /submissions/id_valid?access_token=teach_id with user as teacher', async () => {
    expect.assertions(2);
    let response = await request(app).get('/submissions/'+ dummySubm.id +'?access_token=' + validTeachId);
    expect(response.statusCode).toBe(200);
    expect(utilities.isASubmission(response.body)).toBe(true);
});

test('GET /submissions/id_valid?access_token=teach_id with user as teacher who can\'t see the requested object', async () => {
    expect.assertions(2);
    let response = await request(app).get('/submissions/'+ dummySubm.id +'?access_token=' + dummyTeach2.id);
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('Submission not found');
});

test('GET /submissions/id_valid?access_token=invalidtoken ', async () => {
    expect.assertions(2);
    let response = await request(app).get('/submissions/'+ dummySubm.id +'?access_token=' + invalidId);
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Unauthorized');
});

test('PUT /submissions/id_valid Authorization=invalidtoken ', async () => {
    expect.assertions(2);
    let response = await request(app).put('/submissions/'+ dummySubm.id).set('Authorization', 'Bearer ' + invalidId).send(dummySubm);
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Unauthorized');
});

test('PUT /submissions/id_valid Authorization=valid_id with user that wants to provide an answer (but answer is not defined) ', async () => {
    expect.assertions(2);
    dummySubm.answer = null;
    let response = await request(app).put('/submissions/'+ dummySubm.id).set('Authorization', 'Bearer ' + validStudId).send(dummySubm);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Bad request');
});

test('PUT /submissions/id_valid Authorization=valid_id with user that wants to provide an answer ', async () => {
    expect.assertions(2);
    dummySubm.answer = 'My answer is Boffo!';
    let response = await request(app).put('/submissions/'+ dummySubm.id).set('Authorization', 'Bearer ' + validStudId).send(dummySubm);
    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe(dummySubm.answer);
});

test('PUT /submissions/id_valid Authorization=valid_id with user that wants to provide an answer & mark submission as still not completed', async () => {
    expect.assertions(3);
    dummySubm.answer = 'My answer is Boffo!';
    dummySubm.completed = false;

    let response = await request(app).put('/submissions/'+ dummySubm.id).set('Authorization', 'Bearer ' + validStudId).send(dummySubm);
    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe(dummySubm.answer);
    expect(response.body.completed == false).toBe(true);
});

test('PUT /submissions/id_valid Authorization=valid_id with user that wants to provide an answer & mark submission as completed', async () => {
    expect.assertions(3);
    dummySubm.answer = 'My answer is Boffo!';
    dummySubm.completed = true;

    let response = await request(app).put('/submissions/'+ dummySubm.id).set('Authorization', 'Bearer ' + validStudId).send(dummySubm);
    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe(dummySubm.answer);
    expect(response.body.completed == true).toBe(true);
});

test('PUT /submissions/id_valid(of subm already finished) Authorization=valid_id with user that wants to provide an answer & mark submission as completed', async () => {
    expect.assertions(2);
    dummySubm.answer = 'My answer is Boffo!';
    dummySubm.completed = true;
    let response = await request(app).put('/submissions/'+ dummiesDB.dummySubmission1Finished.id).set('Authorization', 'Bearer ' + validStudId).send(dummiesDB.dummySubmission1Finished);
    expect(response.statusCode).toBe(403);
    expect(response.text).toBe('Forbidden');
});

test('PUT /submissions/id_valid(of subm already finished) Authorization=valid_id with user that wants to mark & evaluate', async () => {
    expect.assertions(3);
    let dummySubmFin = dummiesDB.dummySubmission1Finished;
    dummySubmFin.comment = 'Sehr gut';
    dummySubmFin.earned_points = dummySubmFin.points - 1;
    let response = await request(app).put('/submissions/'+ dummySubmFin.id).set('Authorization', 'Bearer ' + validTeachId).send(dummySubmFin);
    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe(dummySubmFin.comment);
    expect(response.body.earned_points).toBe(dummySubmFin.earned_points);
});

test('PUT /submissions/id_valid(of subm already finished) Authorization=valid_id with user that wants to mark & evaluate, but doesn\'t put the comment', async () => {
    expect.assertions(2);
    let dummySubmFin = dummiesDB.dummySubmission1Finished;
    dummySubmFin.comment = null;
    dummySubmFin.earned_points = dummySubmFin.points - 1;
    let response = await request(app).put('/submissions/'+ dummySubmFin.id).set('Authorization', 'Bearer ' + validTeachId).send(dummySubmFin);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Bad request');
});

test('PUT /submissions/id_valid(of subm already finished) Authorization=valid_id with user that wants to mark & evaluate, but put earned_points > points', async () => {
    expect.assertions(2);
    let dummySubmFin = dummiesDB.dummySubmission1Finished;
    dummySubmFin.comment = 'Very gut';
    dummySubmFin.earned_points = dummySubmFin.points + 1;
    let response = await request(app).put('/submissions/'+ dummySubmFin.id).set('Authorization', 'Bearer ' + validTeachId).send(dummySubmFin);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Bad request');
});

test('PUT /submissions/id_valid(of subm already finished) Authorization=valid_id with user that wants to mark & evaluate, but put earned_points < 0', async () => {
    expect.assertions(2);
    let dummySubmFin = dummiesDB.dummySubmission1Finished;
    dummySubmFin.comment = 'Very gut';
    dummySubmFin.earned_points =  - 1;
    let response = await request(app).put('/submissions/'+ dummySubmFin.id).set('Authorization', 'Bearer ' + validTeachId).send(dummySubmFin);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Bad request');
});


test('PUT /submissions/id_valid(of subm already finished) Authorization=valid_id with user that wants to mark & evaluate', async () => {
    expect.assertions(2);
    let dummySubmFin = dummiesDB.dummySubmission1Finished;
    dummySubmFin.comment = 'Sehr gut';
    dummySubmFin.earned_points = dummySubmFin.points - 1;
    let response = await request(app).put('/submissions/'+ invalidId).set('Authorization', 'Bearer ' + validTeachId).send(dummySubmFin);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Bad request');
});

test('PUT /submissions/id_valid(of subm already finished) Authorization=valid_id with user that wants to mark & evaluate', async () => {
    expect.assertions(2);
    let dummySubmFin = dummiesDB.dummySubmission1Finished;
    dummySubmFin.id = invalidId;
    dummySubmFin.comment = 'Sehr gut';
    dummySubmFin.earned_points = dummySubmFin.points - 1;
    let response = await request(app).put('/submissions/'+ invalidId).set('Authorization', 'Bearer ' + validTeachId).send(dummySubmFin);
    expect(response.statusCode).toBe(403);
    expect(response.text).toBe('Forbidden');
});

test('PUT /submissions/id_valid Authorization=valid_id with user that wants to mark & evaluate on a not finished exam\'s submission', async () => {
    expect.assertions(2);
    dummySubm.comment = 'Sehr gut';
    dummySubm.earned_points = dummySubm.points - 1;
    let response = await request(app).put('/submissions/'+ dummySubm.id).set('Authorization', 'Bearer ' + validTeachId).send(dummySubm);
    expect(response.statusCode).toBe(403);
    expect(response.text).toBe('Forbidden');
});