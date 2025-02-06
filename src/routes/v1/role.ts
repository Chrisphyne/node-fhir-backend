import { Router } from "express";
import { createRole, getAllRoles, getRoleById, updateRole, deleteRole } from "../../controllers/role";

const RoleRouter = Router();

RoleRouter.post('/', createRole);
RoleRouter.get('/', getAllRoles);
RoleRouter.get('/:id', getRoleById);
RoleRouter.put('/:id', updateRole);
RoleRouter.delete('/:id', deleteRole);

export default RoleRouter;