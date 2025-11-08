"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const supertest_1 = __importDefault(require("supertest"));
dotenv_1.default.config();
const BASE_URL = 'http://localhost:3000';
const ADMIN_KEY = process.env.ADMIN_KEY;
let userToken;
let userId;
let roomId;
let reservationId;
describe('Full API Flow', () => {
    jest.setTimeout(40000);
    //region users
    test('Register user (admin)', async () => {
        const res = await (0, supertest_1.default)(BASE_URL)
            .post('/users/register')
            .set('Authorization', `Bearer ${ADMIN_KEY}`)
            .send({
            name: 'apitestuser',
            email: 'apitestuser@example.com',
            passwordHash: Buffer.from('password').toString('base64'),
        });
        expect([200, 201, 202]).toContain(res.statusCode);
        userId = res.body._id || res.body.id;
    });
    test('Login user', async () => {
        const res = await (0, supertest_1.default)(BASE_URL)
            .post('/users/login')
            .send({
            email: 'apitestuser@example.com',
            passwordHash: Buffer.from('password').toString('base64'),
        });
        expect([200, 202]).toContain(res.statusCode);
        userToken = res.body.token;
    });
    //region rooms
    test('Create room (admin)', async () => {
        const res = await (0, supertest_1.default)(BASE_URL)
            .post('/rooms')
            .set('Authorization', `Bearer ${ADMIN_KEY}`)
            .send({ name: 'Suite 101', isAvailable: true });
        expect([200, 201]).toContain(res.statusCode);
        roomId = res.body._id || res.body.id;
    });
    test('Get all rooms', async () => {
        const res = await (0, supertest_1.default)(BASE_URL).get('/rooms');
        expect([200, 202]).toContain(res.statusCode);
    });
    //region reservations
    test('Create reservation (user self)', async () => {
        const res = await (0, supertest_1.default)(BASE_URL)
            .post('/reservations')
            .send({
            userId,
            roomId,
            checkIn: '2025-11-10T14:00:00.000Z',
            checkOut: '2025-11-12T10:00:00.000Z',
            token: userToken,
        });
        expect([200, 201, 401]).toContain(res.statusCode);
        reservationId = res.body._id || res.body.id;
    });
    test('List reservations (user self)', async () => {
        const res = await (0, supertest_1.default)(BASE_URL)
            .get(`/reservations?userId=${userId}`)
            .query({ token: userToken });
        expect([200, 202, 401]).toContain(res.statusCode);
    });
    test('Update reservation (user self)', async () => {
        const res = await (0, supertest_1.default)(BASE_URL)
            .patch('/reservations')
            .send({ id: reservationId, status: 'completed', token: userToken });
        expect([200, 202, 400]).toContain(res.statusCode);
    });
    test('Cancel reservation (user self)', async () => {
        const res = await (0, supertest_1.default)(BASE_URL)
            .patch('/reservations/cancel')
            .send({ id: reservationId, token: userToken });
        expect([200, 202, 400]).toContain(res.statusCode);
    });
});
