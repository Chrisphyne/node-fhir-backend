const passport = require('passport')
import { prisma } from "../app";


var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
let opts:any = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret'; 

passport.use(new JwtStrategy(opts,
     async function (jwt_payload, done)  { 
      console.log('jwt_payload', jwt_payload);
    let officer =   await prisma.officer.findFirst({
        where:{
          id:jwt_payload.id
        }
      })
        
          if(officer){ 
            return done(null, officer);

          }else{

            return done('invalid', false);
          }
 
}));