import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import LayoutReducer from "./LayoutReducer";
import NavigationReducer from "./NavigationReducer";
import SessionReducer from "./SessionReducer";
import UserReducer from "./UserReducer";
import PostReducer from "./PostReducer";
import CommentReducer from "./CommentReducer";

const RootReducer = combineReducers({
  login: LoginReducer,
  layout: LayoutReducer,
  navigations: NavigationReducer,
  session: SessionReducer,
  user: UserReducer,
  post: PostReducer,
  comment: CommentReducer
});

export default RootReducer;
