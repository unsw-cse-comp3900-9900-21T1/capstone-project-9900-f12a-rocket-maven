// May be better to create more specialised reducers
// May need to create an isLoggingOut action
const Reducer = (state: any, action: any) => {
  switch (action.type) {
      case 'LOGIN':
          return {
              ...state,
              isLoggedIn: true,
              accessToken: action.payload.accessToken,
              refreshToken: action.payload.refreshToken,
              userId: action.payload.userId
          };
      case 'LOGOUT':
          return {
              ...state,
              isLoggedIn: false,
              accessToken: '',
              refreshToken: '',
              userId: undefined,
          };
      default:
          return state;
  }
};

export default Reducer;