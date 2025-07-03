import passport from "passport";
import { jwtStrategy } from '../../middleware/passport-jwt'; // adjust path to your file

passport.use("jwt", jwtStrategy); // THIS REGISTERS THE STRATEGY

export default passport;
