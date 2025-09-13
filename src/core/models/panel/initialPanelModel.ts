import { GroupModel } from "../chatMessage/messageModel";
import { ContentModel } from "../content/contentModel";
import { AllEntryModel } from "../entries/allEntriesModel";
import { LastEntryModel } from "../entries/lastEntriesModel";
import { GetGroupsMemberRequest } from "../groupMemberRequest/groupMemberRequestModel";
import { ModuleRoleModel } from "../ModuleRole/modulRoleModel";
import { PaginationModel } from "../pagination/paginationModel";
import { RoleDTO } from "../role/roleModel";
import { RoleModelResponse } from "../RoleModel/roleModulModel";
import { UserDataModel } from "../user/userDataModel";

export interface InitialAdminPanelModel {
  data: [] | null;
  lastEntries: LastEntryModel[] | null;
  userCount: number,
  degrees: number[],
  loading: boolean;
  error: string | null;
  isLogin: boolean | null;
  userRole: string | '';
  message: string | '';
  content: ContentModel[];
  allEntries: PaginationModel<AllEntryModel> | null;
  allUsers: PaginationModel<UserDataModel> | null;
  roles: RoleDTO[] | null;
  moduleRoles: RoleModelResponse | null;
  pendingGroupMemberRequest : PaginationModel<GetGroupsMemberRequest> | null;
  approvedGroupMemberRequest : PaginationModel<GetGroupsMemberRequest> | null;
  groups: GroupModel[] | null;
}

export const adminPanelModelState: InitialAdminPanelModel = {
  data: null,
  lastEntries: [],
  degrees: [],
  userCount: 0,
  loading: false,
  error: null,
  isLogin: false,
  userRole: '',
  message: '',
  content: [],
  allEntries: null,
  allUsers: null,
  roles: [],
  moduleRoles: null,
  pendingGroupMemberRequest: null,
  approvedGroupMemberRequest: null,
  groups: null
};
