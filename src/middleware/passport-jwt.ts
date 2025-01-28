import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { prisma } from '../app';
import { jwtConfig } from '../config/jwt.config';
import { User } from '@prisma/client';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret,
  issuer: jwtConfig.issuer,
  audience: jwtConfig.audience,
};

export const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub }
    });
    if (user) {
      return done(null, {
        ...user,
        id: user.id.toString()
      });
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}); 