import { ModuleModel } from "../modul/modulModel";
import { ModuleRoleModel } from "../ModuleRole/modulRoleModel";

export interface RoleModelResponse {
  roleId: number;
  moduleList: ModuleModel[];
  authModuleList: ModuleRoleModel[];
}
