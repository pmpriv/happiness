import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import geoMapReducer from "../features/geo-map/GeoMapSlice";
import happinessReducer from "../features/happiness/HappinessSlice";
import { happinessApi } from "../features/happiness/HappinessAPI";

export const store = configureStore({
  reducer: {
    [happinessApi.reducerPath]: happinessApi.reducer,
    happiness: happinessReducer,
    geoMap: geoMapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(happinessApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
