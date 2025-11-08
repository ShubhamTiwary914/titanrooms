"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conn_1 = __importDefault(require("./db/conn"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan = require("morgan");
const auth_1 = __importDefault(require("./middleware/auth"));
const users_1 = __importDefault(require("./routes/users"));
const rooms_1 = __importDefault(require("./routes/rooms"));
const reservations_1 = __importDefault(require("./routes/reservations"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const address = process.env.MONGO_ADDRESS || "localhost";
const serverPort = 3000;
const dbPort = 27017;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(morgan(':method :url :status :req[content-type] - :response-time ms'));
//routes
app.get('/ping', (_, res) => {
    res.send(`pinged express server at ${address}:${serverPort}`).status(200);
});
app.get('/ping-admin', (0, auth_1.default)(), (_, res) => {
    res.send(`pinged express server as admin at ${address}:${serverPort}`).status(200);
});
app.use('/users', users_1.default);
app.use('/rooms', rooms_1.default);
app.use('/reservations', reservations_1.default);
(0, conn_1.default)(`${address}:${dbPort}`);
app.listen(serverPort, () => console.log(`Server running on port ${serverPort}`));
