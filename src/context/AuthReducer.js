const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        currentUser: null,
        isLoading: false,
      };
    }
    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;