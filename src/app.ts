import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
var multer = require('multer');
export var forms = multer({
  dest: 'upload/',
});
import {PrismaClient } from '@prisma/client';
const passport = require('passport')
require('./middleware/passport')
export const prisma = new PrismaClient()

export const saltRounds = 10;

const bcrypt = require('bcrypt');


const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const http = require('http');
const app = express();

const { Server } = require("socket.io");
import { uuid } from 'uuidv4';
import cors from 'cors';
import { home } from './routes/home';
// import { login } from './controllers/auth/login';
// import { loginRouter } from './routes/auth/login';
import path from 'path';

import iprsPersonRouter from './routes/v1/search_iprs';
import { ModuleRouter } from './routes/v1/module';
import { ModuleDataRouter } from './routes/v1/module_data';
import UserRouter from './routes/v1/user';
import { SubModulesRouter } from './routes/v1/sub_module';
import { SubModuleDataRouter } from './routes/v1/sub_module_data';
import { ApplicationsDataRouter } from './routes/v1/applications';
import { RegionRouter } from './routes/v1/region';
import { CountiesRouter } from './routes/v1/counties';
import SubCountiesRouter from './routes/v1/sub_counties';
import { DivisionRouter } from './routes/v1/division';
import VillageRouter from './routes/v1/village';
import locationRouter from './routes/v1/location';
// import { ApplicationsDataRouter } from './routes/v1/applications';

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
}));




// app.use(cors({credentials: true, origin: '*'}))
const whitelist = ['http://localhost:3007', 'http://localhost', '*'];
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
app.use('/api/v1/iprsPersons', iprsPersonRouter);
app.use('/api/v1/user', UserRouter);
app.use('/api/v1/module', ModuleRouter);
app.use('/api/v1/sub_module', SubModulesRouter);
app.use('/api/v1/sub_module_data', SubModuleDataRouter);
app.use('/api/v1/module_data', ModuleDataRouter);
app.use('/api/v1/applications', ApplicationsDataRouter);
app.use('/api/v1/region', RegionRouter);
app.use('/api/v1/counties', CountiesRouter);
app.use('/api/v1/sub_counties', SubCountiesRouter);
app.use('/api/v1/division', DivisionRouter);
app.use('/api/v1/location', locationRouter);
app.use('/api/v1/village', VillageRouter);


app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(filename, { root: path.join('uploads') }); // serve files from uploads directory
});

export const JWTSecret = "secret"
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
