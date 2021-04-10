
const Reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLoggedIn: true,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                userId: action.payload.userId,
                searchParams: {
                    currentPage: 1,
                    queryParams: '',
                    cachedData: undefined,
                }
            };
        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn: false,
                accessToken: '',
                refreshToken: '',
                userId: undefined,
                searchParams: {
                    currentPage: 1,
                    queryParams: '',
                    cachedData: undefined,
                }
            };
        case 'REFRESH_TOKEN':
            return {
                ...state,
                accessToken: action.payload.accessToken,
            };
        case 'ADV_SEARCH/UPDATE':
            return {
                ...state,
                searchParams: {
                    ...action.payload
                }
            };
        default:
            return state;
    }
};

export default Reducer;