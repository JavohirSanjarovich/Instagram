import { combineReducers } from 'redux';
import user from './user_reducer';

export const rootReducer = combineReducers({
    user
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>