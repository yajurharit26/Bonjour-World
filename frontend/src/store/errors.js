import { combineReducers } from "redux";
import { sessionErrorsReducer } from "./session";
import { eventErrorsReducer } from "./events";
import { updateUserErrorsReducer } from "./users";

export default combineReducers({
  session: sessionErrorsReducer,
  event: eventErrorsReducer,
  updateUser: updateUserErrorsReducer
});