import { Endpoints } from "./Endpoints";

export enum AdminMenuType {
  Users = "users",
  Modules = "modules",
  Roles = "roles",
  Trainings = "trainings",
  Jobs = "jobs",
  Market = "market",
  Partners = "partners",
  Entries = "entries"
}


export const EndpointMappings: Record<AdminMenuType, Partial<Record<"list" | "create" | "update" | "delete" | "list2", Endpoints>>> = {
  [AdminMenuType.Users]: {
    list: Endpoints.GetUsers,
    //  create: Endpoints.CreateUser,
    //  update: Endpoints.UpdateUser,
    //  delete: Endpoints.DeleteUser,
    list2: Endpoints.GetUnapprovedUsers,
  },
  [AdminMenuType.Modules]: {
    //  list: Endpoints.GetModules,
    //  create: Endpoints.CreateModule,
    //  update: Endpoints.UpdateModule,
    //  delete: Endpoints.DeleteModule,
  },
  [AdminMenuType.Entries]: {
    list: Endpoints.GetAllEntries,
    //  create: Endpoints.CreateModule,
    //  update: Endpoints.UpdateModule,
    //  delete: Endpoints.DeleteModule,
  },
  [AdminMenuType.Roles]: {
    list: Endpoints.GetRoles,
    //   create: Endpoints.CreateRole,
    //  update: Endpoints.UpdateRole,
    //  delete: Endpoints.DeleteRole,
  },
  [AdminMenuType.Trainings]: {
    list: Endpoints.GetDraws,
    create: Endpoints.CreateDraw,
    update: Endpoints.UpdateDraw,
    delete: Endpoints.DeleteDraw,
  },
  [AdminMenuType.Jobs]: {
    list: Endpoints.GetJobAdvertisements,
    create: Endpoints.CreateJobAdvertisement,
    update: Endpoints.UpdateJobAdvertisement,
    delete: Endpoints.DeleteJobAdvertisement,
  },
  [AdminMenuType.Market]: {
    list: Endpoints.GetCampaigns,
    create: Endpoints.CreateCampaign,
    update: Endpoints.UpdateCampaign,
    delete: Endpoints.DeleteCampaign,
  },
  [AdminMenuType.Partners]: {
    list: Endpoints.GetThesisConsultation,
    create: Endpoints.CreateThesisConsultation,
    update: Endpoints.UpdateThesisConsultation,
    delete: Endpoints.DeleteThesisConsultation,
  },
};
