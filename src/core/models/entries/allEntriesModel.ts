import { HeaderModel } from "../header/headerModel";
import { UserDataModel } from "../user/userDataModel";

export interface AllEntryModel {
    id: number;
    titleName: string;
    headerId: number;
    description: string;
    createDate: string;
    updateDate: string;
    userId: number;
    isEntry: boolean;
    user: UserDataModel;
    header: HeaderModel;
}