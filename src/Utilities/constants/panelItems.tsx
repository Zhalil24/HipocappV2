import { ComponentType } from "react";
import {
  Users,
  LayoutGrid,
  ShieldCheck,
  GraduationCap,
  Megaphone,
  ShoppingCart,
  Handshake,
  Group,
  UserPlus,
  FileText, Clipboard 
} from "lucide-react";
import { Endpoints } from "../enums/Endpoints";
import { AdminMenuType } from "../enums/AminMenuType";


type IconType = ComponentType<{ className?: string }>;

export type CrudOperation = "list" | "create" | "update" | "delete" | "detail" | "list2";

export interface EndpointConfig {
  operation: CrudOperation;
  endpoint: Endpoints;
  hasPage: boolean;
  label?: string;

}

export type Item = {
  label: string;
  icon?: IconType;
  type?: AdminMenuType;
  operation?: string;
  children?: {
    label: string;
    endpoints: EndpointConfig[];
  }[];
};

export class AdminMenuConstants {
  static readonly items: Item[] = [
    {
      label: "Kullanıcılar",
      icon: Users,
      type: AdminMenuType.Users,
      children: [
        {
          label: "Kullanıcı İşlemleri",
          endpoints: [
            { operation: "list", endpoint: Endpoints.GetUsers, hasPage: true, label: "Kullanıcı Listesi" },
            //  { operation: "create", endpoint: Endpoints.CreateUser, hasPage: true, label: "Kullanıcı Ekle" },
            //  { operation: "update", endpoint: Endpoints.UpdateUser, hasPage: false },
            //  { operation: "delete", endpoint: Endpoints.DeleteUser, hasPage: false },
            //  { operation: "detail", endpoint: Endpoints.GetUserDetail, hasPage: true, label: "Kullanıcı Detayı" },
          ],
        },
        {
          label: "Onay İşlemleri",
          endpoints: [
            { operation: "list2", endpoint: Endpoints.GetUnapprovedUsers, hasPage: true, label: "Onaylanmamış Kullanıcılar" },
          ],
        },
      ],
    },
    {
      label: "Yorumlar",
      icon: FileText,
      type: AdminMenuType.Entries,
      children: [
        {
          label: "Yorumlar İşlemleri",
          endpoints: [
            { operation: "list", endpoint: Endpoints.GetAllEntries, hasPage: true, label: "Yorumlar Listesi" },
          ],
        },
      ],
    },
    {
      label: "Modüller",
      icon: LayoutGrid,
      type: AdminMenuType.Modules,
      children: [
        {
          label: "Modül İşlemleri",
          endpoints: [
            // { operation: "list", endpoint: Endpoints.GetModules, hasPage: true, label: "Modül Listesi" },
            // { operation: "create", endpoint: Endpoints.CreateModule, hasPage: true, label: "Modül Ekle" },
            // { operation: "update", endpoint: Endpoints.UpdateModule, hasPage: false },
            // { operation: "delete", endpoint: Endpoints.DeleteModule, hasPage: false },
          ],
        },
      ],
    },
    {
      label: "Roller",
      icon: ShieldCheck,
      type: AdminMenuType.Roles,
      children: [
        {
          label: "Rol İşlemleri",
          endpoints: [
            { operation: "list", endpoint: Endpoints.GetRoles, hasPage: true, label: "Rol Listesi" },
          ],
        },
      ],
    },
    {
      label: "Eğitimler",
      icon: GraduationCap,
      type: AdminMenuType.Trainings,
      children: [
        {
          label: "Eğitim İşlemleri",
          endpoints: [
            { operation: "list", endpoint: Endpoints.GetDraws, hasPage: true, label: "Eğitim Listesi" },
            { operation: "create", endpoint: Endpoints.CreateDraw, hasPage: false },
            { operation: "update", endpoint: Endpoints.UpdateDraw, hasPage: false },
            { operation: "delete", endpoint: Endpoints.DeleteDraw, hasPage: false },
          ],
        },
      ],
    },
    {
      label: "İlanlar",
      icon: Megaphone,
      type: AdminMenuType.Jobs,
      children: [
        {
          label: "İlan İşlemleri",
          endpoints: [
            { operation: "list", endpoint: Endpoints.GetJobAdvertisements, hasPage: true, label: "İlan Listesi" },
            { operation: "create", endpoint: Endpoints.CreateJobAdvertisement, hasPage: false, },
            { operation: "update", endpoint: Endpoints.UpdateJobAdvertisement, hasPage: false },
            { operation: "delete", endpoint: Endpoints.DeleteJobAdvertisement, hasPage: false },
          ],
        },
      ],
    },
    {
      label: "Market",
      icon: ShoppingCart,
      type: AdminMenuType.Market,
      children: [
        {
          label: "Market İşlemleri",
          endpoints: [
            { operation: "list", endpoint: Endpoints.GetCampaigns, hasPage: true, label: "Market Listesi" },
            { operation: "create", endpoint: Endpoints.CreateCampaign, hasPage: false, },
            { operation: "update", endpoint: Endpoints.UpdateCampaign, hasPage: false },
            { operation: "delete", endpoint: Endpoints.DeleteCampaign, hasPage: false },
          ],
        },
      ],
    },
    {
      label: "Partnerler",
      icon: Handshake,
      type: AdminMenuType.Partners,
      children: [
        {
          label: "Partner İşlemleri",
          endpoints: [
            { operation: "list", endpoint: Endpoints.GetThesisConsultation, hasPage: true, label: "Partner Listesi" },
            { operation: "create", endpoint: Endpoints.CreateThesisConsultation, hasPage: false, },
            { operation: "update", endpoint: Endpoints.UpdateThesisConsultation, hasPage: false },
            { operation: "delete", endpoint: Endpoints.DeleteThesisConsultation, hasPage: false },
          ],
        },
      ],
    },
    {
      label: "Gruplar",
      icon: UserPlus,
      type: AdminMenuType.Groups,
      children: [
        {
          label: "Grup İşlemleri",
          endpoints: [
            { operation: "list", endpoint: Endpoints.GetGroupsMemberRequest, hasPage: true, label: "Onay Bekleyen Kullanıcı Listesi" },
            { operation: "list2", endpoint: Endpoints.GetGroupsApprovedMemberRequest, hasPage: true, label: "Onaylanmış Kullanıcılar" },
            { operation: "create", endpoint: Endpoints.CreateGroup, hasPage: true, label: "Gruplar" },
          ],
        },
      ],
    },
  ];
}
