export interface ModuleModel {
  id: number;
  name: string;
  controller: string;
  action: string;
  address: string;
  icon: string;
  menu: number;
  parentId: number;
  subModules: ModuleModel[];
}
