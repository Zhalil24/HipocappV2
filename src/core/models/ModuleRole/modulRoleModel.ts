import { ModuleModel } from "../modul/modulModel";
import { RoleDTO } from "../role/roleModel";

export interface ModuleRoleModel {
  id: number;
  rolId: number;
  userId: number;
  moduleId: number;

  roleDTO: RoleDTO;
  moduleDTO: ModuleModel;
}

