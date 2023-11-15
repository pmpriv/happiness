import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DataRecord } from "../../model/model";

export const dataFiles = [
    { year: 2018, name: "2018.json" },
    { year: 2019, name: "2019.json" },
];

export const happinessApi = createApi({
    reducerPath: 'happinessApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/data/' }),
    endpoints: (builder) => ({
      happinessByYear: builder.query<DataRecord[], string | number>({
        query: (name) => `${name}.json`,
      }),
    }),
});

export const { useHappinessByYearQuery } = happinessApi;
