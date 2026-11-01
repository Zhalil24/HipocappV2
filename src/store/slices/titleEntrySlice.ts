import { BaseResponseModel } from '@/core/models';
import { GroupModel } from '@/core/models/chatMessage/messageModel';
import { ContentModel } from '@/core/models/content/contentModel';
import { TitleModel } from '@/core/models/entries/titleModel';
import { UserDataModel } from '@/core/models/user/userDataModel';
import { BaseService } from '@/core/services/baseService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const baseService = new BaseService();

export const fetchEntriesByTitleName = createAsyncThunk(
  'titleEntry/fetchEntriesByTitleName',
  async (titleName: string) => {
    const response = await baseService.get<any>('/Entry/GetEntriesByTitleName', { name: titleName });

    return response;
  }
);

export const searchTitlesByName = createAsyncThunk<
  BaseResponseModel<TitleModel[]>,
  { name: string },
  { rejectValue: string }
>(
  "titles/searchByName",
  async ({ name }, { rejectWithValue, signal }) => {
    const query = (name ?? "").trim();
    if (!query) {
      return { success: true, data: [], message: "", error: "" };
    }

    const res = await baseService.get<TitleModel[]>(
      "/Title/SearchEntriesByTitleName",
      { name: query },
      { signal }
    );

    return res;
  }
);

export const fetchUsers = createAsyncThunk<UserDataModel[], void>(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    const res = await baseService.get<UserDataModel[]>('/api/user/all');
    if (!Array.isArray(res)) {
      return rejectWithValue('Kullanıcılar alınamadı');
    }
    return res;
  }
);

export const fetchGetJobAdvertisements = createAsyncThunk<
  BaseResponseModel<ContentModel[]>
>('draw/GetJobAdvertisements', async () => {
  const response = await baseService.get<ContentModel[]>('api/draw/GetJobAdvertisements');
  return response;
});

export const fetchGetGroups = createAsyncThunk<
  BaseResponseModel<GroupModel[]>>
  ("get/groups", async () => {
    const resp = await baseService.get<GroupModel[]>('api/chat/GetAllGroups')
    return resp;
  });


const initialState = {
  entries: [] as any[],
  loading: false,
  error: null as string | null,
  jobs: [] as any[],
  titles: [] as any[],
  users: [] as UserDataModel[],
  lastQuery: '',
  groups: [] as GroupModel[],
};

const titleEntrySlice = createSlice({
  name: 'titleEntry',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntriesByTitleName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntriesByTitleName.fulfilled, (state, action) => {
        state.loading = false;

        state.entries = action.payload.data ?? [];
      })
      .addCase(fetchEntriesByTitleName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Bir hata oluştu';
      })

      .addCase(fetchGetJobAdvertisements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGetJobAdvertisements.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data ?? [];
      })
      .addCase(fetchGetJobAdvertisements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Bir hata oluştu.';
      })

      .addCase(searchTitlesByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTitlesByName.fulfilled, (state, action) => {
        state.loading = false;
        state.titles = action.payload.data!;
      })
      .addCase(searchTitlesByName.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Bir hata oluştu";
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;

      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Bir hata oluştu";
      })
      .addCase(fetchGetGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGetGroups.fulfilled, (state, action) => {
        state.groups = action.payload.data ?? [];
        state.loading = false;

      })
      .addCase(fetchGetGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Bir hata oluştu";
      });

  },
});

export default titleEntrySlice.reducer;
