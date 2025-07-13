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
}

export const lastEntriesInitialState: InitialLastEntryModel = {
  data: [],
  loading: false,
  error: null,
};
