import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Topology } from "topojson-specification";
import * as topojson from 'topojson-client';
import { RootState } from "../../app/store";

type WorldMapData = GeoJSON.FeatureCollection<GeoJSON.GeometryObject, FeatureProperties>;

interface FeatureProperties {
  name: string;
}

export type FeatureShape = GeoJSON.Feature<GeoJSON.GeometryObject, FeatureProperties> & { id: string };

export interface GeoMapState {
  status: "idle" | "loading" | "failed",
  world?: WorldMapData;
}

const initialState: GeoMapState = {
  status: "idle",
};

export const loadWorldTopology = createAsyncThunk(
  "geoMap/loadWorldTopology",
  () => fetchWorldTopology(),
);

export const geoMapSlice = createSlice({
  name: "geomap",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWorldTopology.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadWorldTopology.fulfilled, (state, action) => {
        const topology = action.payload;
        state.status = "idle";
        state.world = topojson.feature(topology, topology.objects.units) as WorldMapData;
      })
      .addCase(loadWorldTopology.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectGeoMap = (state: RootState) => state.geoMap;

export default geoMapSlice.reducer;

const baseUrl = `${import.meta.env.BASE_URL}map/`;

async function fetchWorldTopology(): Promise<Topology> {
  const res = await fetch(`${baseUrl}world-topo.json`);
  if (!res.ok) {
    throw new Error("Failed to load topology");
  }
  return await res.json();
}
