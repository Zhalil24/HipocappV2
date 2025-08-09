export interface ContentModel {
    id: number;
    imageURL: string;
    description: string;
    title: string;
    link: string;
}

export interface InitialContentModel {
    data: ContentModel[];
    loading: boolean;
    message: string | null;
    error: string | null;
}

export const contentModelInitialState: InitialContentModel = {
    data: [],
    loading: false,
    error: null,
    message: null,
};
