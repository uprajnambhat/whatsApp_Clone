import { messages } from "../messages";
import { metaData } from "../metaData";

const initialstate = {
  selectedUser: {},
  metaDataDetails: metaData,
  chatList: messages,
};

export const chatsReducer = (state = initialstate, action) => {
  switch (action.type) {
    case "UPDATE_SELECTEDUSER_DETAILS":
      return {
        ...state,
        selectedUser: action.payload,
      };
    case "UPDATE_MESSAGES_LIST":
      return {
        ...state,
        chatList: action.payload,
      };
    case "UPDATE_METADATA_DETAILS":
      return {
        ...state,
        metaDataDetails: action.payload,
      };
    default:
      return state;
  }
};
