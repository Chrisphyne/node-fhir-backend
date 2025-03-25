import { Router } from "express"; 
import passport from "passport";
const validateToken = Router();

validateToken.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.user);
});

export default validateToken;