import { AllEntryModel } from "../entries/allEntriesModel";

export interface PaginationModel<T> {
    from: number;
    index: number;
    size: number;
    count: number;
    pages: number;
    items: T[];
}