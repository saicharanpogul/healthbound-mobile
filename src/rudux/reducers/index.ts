import {combineReducers} from 'redux';
import fitnessTrackerReducer from './fitnessTracker';
import profileReducer from './profile';

const allReducers = {
  fitnessTracker: fitnessTrackerReducer,
  profile: profileReducer,
};

export default combineReducers(allReducers);
