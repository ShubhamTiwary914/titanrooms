import express, { Response } from 'express';
import connectDB from './db/conn' 
import dotenv from 'dotenv'
import morgan = require('morgan');
import verifyAdminKey from './middleware/auth';

import usersRouter from './routes/users'
import roomRouter from './routes/rooms'
import reservationRouter from './routes/reservations'

dotenv.config()
const app = express()
const address = process.env.MONGO_ADDRESS || "localhost";
const serverPort = 3000
const dbPort = 27017

app.use(express.json());               
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':method :url :status :req[content-type] - :response-time ms'))

//routes
app.get('/ping', 
    (_, res: Response)=>{
    res.send(`pinged express server at ${address}:${serverPort}`).status(200);
})
app.get('/ping-admin', 
    verifyAdminKey(),
    (_, res: Response)=>{
    res.send(`pinged express server as admin at ${address}:${serverPort}`).status(200);
})


app.use('/users', usersRouter)
app.use('/rooms', roomRouter)
app.use('/reservations', reservationRouter)

connectDB(`${address}:${dbPort}`);
app.listen(serverPort, () => console.log(`Server running on port ${serverPort}`));
