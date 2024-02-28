import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {RootState} from '../store';

export interface FitnessTrackerState {
  claimed: HealthData[];
}

const initialState: FitnessTrackerState = {
  claimed: [],
};

export const fitnessTracker = createSlice({
  name: 'fitnessTracker',
  initialState,
  reducers: {
    setIsAuthorize: (
      state,
      {
        payload,
      }: PayloadAction<{
        claimed: HealthData[];
      }>,
    ) => {
      state.claimed = payload.claimed;
    },
  },
});

export const {setIsAuthorize} = fitnessTracker.actions;

export const getData = (state: RootState) => state.fitnessTracker.claimed;

export default fitnessTracker.reducer;
