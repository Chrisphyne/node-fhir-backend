import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { createClient } from 'redis';
var multer = require('multer');
export var forms = multer({
  dest: 'upload/',
});
import {PrismaClient } from '@prisma/client';
import passport from "./routes/auth/passport"; // 👈 This is key
require('./middleware/passport-jwt')
export const prisma = new PrismaClient()

export const saltRounds = 10;

const bcrypt = require('bcrypt');


const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const http = require('http');
const app = express();

const { Server } = require("socket.io");

// export const redisClient = createClient( {socket: {
//   host: '127.0.0.1',
//   port: 6379
// }});
// redisClient.on('error', (err: Error) => console.error('Redis error:', err));
// redisClient.connect();


import { uuid } from 'uuidv4';
import cors from 'cors';
import { home } from './routes/home';
// import { login } from './controllers/auth/login';
// import { loginRouter } from './routes/auth/login';
import path from 'path';

// Initialize passport
app.use(passport.initialize()); // 👈 Must come before routes that use it


import userRouter from './routes/v1/user';
import organizationRouter from './routes/v1/organization';
import userOrganizationAccessRouter from './routes/v1/userOrganizationAccess';
import staffRouter from './routes/v1/staff';
import patientRouter from './routes/v1/patient';
import patientOrganizationRouter from './routes/v1/patientOrganization';
import equipmentRouter from './routes/v1/equipment';
// import { socketsManager } from './service/sockets';

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));              
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
}));




// app.use(cors({credentials: true, origin: '*'}))
const whitelist = ['http://localhost:3000', 'http://localhost', '*'];
// init()30

app.options('*', cors())




export const server = http.createServer(app);

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors({
  origin: '*'
}));
// io.use

dotenv.config();
// init()
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


// routes
  app.use('/', home);
  app.use('/api/v1/user', userRouter);
  app.use('/api/v1/organization', organizationRouter);
  app.use('/api/v1/userOrganizationAccess', userOrganizationAccessRouter);
  app.use('/api/v1/staff', staffRouter);
  app.use('/api/v1/patient', patientRouter);
  app.use('/api/v1/patientOrganization', patientOrganizationRouter);
  app.use('/api/v1/equipment', equipmentRouter);
  // app.use('/api/v1/applications', ApplicationsDataRouter);

// app.use('/api/v1/rank', RanpmkRouter);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(filename, { root: path.join('uploads') }); // serve files from uploads directory
});

// socketsManager()
// app.use('/product', product)

// start the server
app.listen(process.env.BACK_PORT, () => {
  console.log(
    `server running : http://localhost:${process.env.BACK_PORT}`
  );
});

server.listen(process.env.SOCKET_PORT, () => {
  console.log(`socket listening  on *:${process.env.SOCKET_PORT}`);
}); 
