import { Router } from "express";
import {
    createQualificationAndSkill,
    getAllQualificationsAndSkills,
    getQualificationAndSkillById,
    updateQualificationAndSkill,
    deleteQualificationAndSkill
} from "../../controllers/qulification_skills";
import passport from "passport";

const QualificationAndSkillsRouter = Router();

QualificationAndSkillsRouter.post("/", passport.authenticate('jwt', { session: false }), createQualificationAndSkill);
QualificationAndSkillsRouter.get("/", passport.authenticate('jwt', { session: false }), getAllQualificationsAndSkills);
QualificationAndSkillsRouter.get("/:id", passport.authenticate('jwt', { session: false }), getQualificationAndSkillById);
QualificationAndSkillsRouter.put("/:id", passport.authenticate('jwt', { session: false }), updateQualificationAndSkill);
QualificationAndSkillsRouter.delete("/:id", passport.authenticate('jwt', { session: false }), deleteQualificationAndSkill);

export default QualificationAndSkillsRouter;
