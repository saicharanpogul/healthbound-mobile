import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {RootState} from '../store';

export interface ProfileState {
  id: string;
  isLoggedIn: boolean;
  username: string;
  primaryAddress: string; // user's primary address
  address: string;
  loading: boolean;
  error: string;
}

const initialState: ProfileState = {
  id: '',
  isLoggedIn: false,
  username: '',
  primaryAddress: '',
  address: '',
  loading: false,
  error: '',
};

export const profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfile: state => {
      state.id = initialState.id;
      state.isLoggedIn = initialState.isLoggedIn;
      state.username = initialState.username;
      state.primaryAddress = initialState.primaryAddress;
      state.address = initialState.address;
      state.loading = initialState.loading;
      state.error = initialState.error;
    },
    setIsLoggedIn: (state, {payload}: PayloadAction<{isLoggedIn: boolean}>) => {
      state.isLoggedIn = payload.isLoggedIn;
    },
    setData: (
      state,
      {
        payload,
      }: PayloadAction<{
        address?: string;
        id?: string;
        username?: string;
        primaryAddress?: string;
      }>,
    ) => {
      state.username = payload.username || state.username;
      state.address = payload.address || state.address;
      state.id = payload.id || state.id;
      state.primaryAddress = payload.primaryAddress || state.primaryAddress;
    },
  },
  // extraReducers: builder => {},
});

export const {setData, resetProfile, setIsLoggedIn} = profile.actions;

export const getData = (state: RootState) => state.profile.primaryAddress;
export const getProfileLoading = (state: RootState) => state.profile.loading;
export const getProfileError = (state: RootState) => state.profile.error;

export default profile.reducer;
