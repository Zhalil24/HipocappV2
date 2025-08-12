export interface LastEntryModel {
  id: number;
  titleName: string;
  entryDescription: string;
  userName: string;
  userNameSurname?: string;
  date: string;
}

export interface InitialLastEntryModel {
  data: LastEntryModel[];
  loading: boolean;
  error: string | null;
  headerId: number | null;
  message: string | null;
}

export const lastEntriesInitialState: InitialLastEntryModel = {
  data: [],
  loading: false,
  error: null,
  headerId: null,
  message: null,
};
