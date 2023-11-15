import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export const years = [2018, 2019];

export interface HappinessState {
  year: number;
}

const initialState: HappinessState = {
  year: 2019,
};

export const HappinessSlice = createSlice({
  name: "Happiness",
  initialState,
  reducers: {
    setYear: (state, action: PayloadAction<number>) => {
      state.year = action.payload;
    },
  },
});

export const { setYear } = HappinessSlice.actions;

export const selectHappiness = (state: RootState) => state.happiness;

export default HappinessSlice.reducer;
