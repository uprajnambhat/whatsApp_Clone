import { combineReducers, createStore } from "redux";
import { chatsReducer } from "./reducers/chatsReducer";

const userNameReducer = combineReducers({
  chatDetails: chatsReducer,
});

const store = createStore(userNameReducer);
export default store;
