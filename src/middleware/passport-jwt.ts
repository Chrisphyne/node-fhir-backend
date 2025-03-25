import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { prisma } from '../app';
import { jwtConfig } from '../config/jwt.config';
import { Officer } from '@prisma/client';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret,
  issuer: jwtConfig.issuer,
  audience: jwtConfig.audience,
};

export const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  console.log(payload, "payload");
  try {
    const officer = await prisma.officer.findUnique({
      where: { id: payload.sub }
    });
    if (officer) {
      return done(null, {
        ...officer,
        id: officer.id.toString()
      });
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}); 