// import { createStore, applyMiddleware } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import {AnyAction} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import {ThunkDispatch} from 'redux-thunk';

import reducers from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
  devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reducers>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
