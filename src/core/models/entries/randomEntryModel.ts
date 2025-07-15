export interface RandomEntryModel {
  id: number;
  titleName: string;
  headerId: number;
  description: string;
  userId: number;
  isEntry: boolean;
  createDate: string;
}

export interface InitialRandomEntryModel {
  data: RandomEntryModel[];
  loading: boolean;
  error: string | null;
  halil: string | null;
}

export const randomEntriesInitialState: InitialRandomEntryModel = {
  data: [],
  loading: false,
  error: null,
  halil: null,
};
