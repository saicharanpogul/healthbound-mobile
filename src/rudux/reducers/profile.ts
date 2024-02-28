import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import SimpleToast from 'react-native-simple-toast';

import {RootState} from '../store';

export interface ProfileState {
  isLoggedIn: boolean;
  name: string;
  address: string;
  loading: boolean;
  error: string;
}

const initialState: ProfileState = {
  isLoggedIn: false,
  name: 'Unnamed',
  address: '',
  loading: false,
  error: '',
};

export const profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfile: state => {
      state.address = initialState.address;
    },
    setIsLoggedIn: (state, {payload}: PayloadAction<{isLoggedIn: boolean}>) => {
      state.isLoggedIn = payload.isLoggedIn;
    },
    setData: (
      state,
      {
        payload,
      }: PayloadAction<{
        name: string;
        address: string;
      }>,
    ) => {
      state.name = payload.name;
      state.address = payload.address;
      SimpleToast.show('Saved', 5000);
    },
  },
  // extraReducers: builder => {},
});

export const {setData, resetProfile, setIsLoggedIn} = profile.actions;

export const getData = (state: RootState) => state.profile.address;
export const getProfileLoading = (state: RootState) => state.profile.loading;
export const getProfileError = (state: RootState) => state.profile.error;

export default profile.reducer;
