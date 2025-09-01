import { ContentModel } from "../content/contentModel";
import { AllEntryModel } from "../entries/allEntriesModel";
import { LastEntryModel } from "../entries/lastEntriesModel";
import { PaginationModel } from "../pagination/paginationModel";

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
    content: ContentModel[] ;
     allEntries: PaginationModel<AllEntryModel> | null;
}

export const adminPanelModelState: InitialAdminPanelModel = {
    data: null,
    lastEntries: [],
    degrees:[],
    userCount: 0,
    loading: false,
    error: null,
    isLogin: false,
    userRole: '',
    message: '',
    content:[],
      allEntries: null,
};
