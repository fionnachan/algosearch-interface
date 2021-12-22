import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICurrentRoundResponse, ILatestBlocksResponse } from "../types/apiResponseTypes";
import {apiGetCurrentRound, apiGetLatestBlocks} from "../utils/api"
import {State} from "../store"

export interface IApplicationState {
  currentRound: ICurrentRoundResponse;
  latestBlocks: [];
}

const initialState: IApplicationState = {
  currentRound: {
    round: 0,
    "genesis-id": 0,
  },
  latestBlocks: []
};

export const getCurrentRound = createAsyncThunk("app/getCurrentRound", async () => {
  const response: ICurrentRoundResponse = await apiGetCurrentRound() ?? initialState.currentRound
  return response;
})

export const getLatestBlocks = createAsyncThunk("app/getLatestBlocks", async (currentRound: number) => {
  const response: ILatestBlocksResponse = await apiGetLatestBlocks(currentRound) ?? initialState.latestBlocks
  return response;
})

export const applicationSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(getCurrentRound.fulfilled, (state, action: PayloadAction<ICurrentRoundResponse>) => {
        state.currentRound = action.payload;
      })
      .addCase(getLatestBlocks.fulfilled, (state, action: PayloadAction<ILatestBlocksResponse>) => {
        state.latestBlocks = action.payload.items;
      })
  }
});

export const selectCurrentRound = (state: State) => state.app.currentRound;
export const selectLatestBlocks = (state: State) => state.app.latestBlocks;

// export const {} = applicationSlice.actions;

export default applicationSlice.reducer;