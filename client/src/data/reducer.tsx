// May need to create several reducers
// May need to create an isLoggingOut action
const Reducer = (state: any, action: any) => {
  switch (action.type) {
      case 'LOGIN':
          return {
              ...state,
              isLoggedIn: true,
          };
      case 'LOGOUT':
          return {
              ...state,
              isLoggedIn: false,
          };
      default:
          return state;
  }
};

export default Reducer;