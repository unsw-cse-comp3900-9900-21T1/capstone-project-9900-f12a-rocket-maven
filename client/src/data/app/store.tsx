import React, { Dispatch, createContext, useReducer, useEffect } from "react";
import Reducer from '@rocketmaven/data/app/reducer'

// https://dev.to/bigaru/creating-persistent-synchronized-global-store-using-react-hooks-in-typescript-209a
// https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/#usecontext

// Note(Jude): Basic implementation of login state management, will most
// likely have to adjust as I become more familiar with JWT authentiaction
// TODO(Jude): clean up store
// TODO(Jude): Implement state persistence on refresh
// TODO(Jude): Implement accessTokens securely -> HTTPOnly cookie

type Context = { state: AppState; dispatch: Dispatch<Action> }

interface LoginAction {
  type: 'LOGIN'
  payload: {
    accessToken: string,
    refreshToken: string,
    userId: number,
  }
}

interface LogoutAction {
  type: 'LOGOUT'
}

interface RefreshTokenAction {
  type: 'REFRESH_TOKEN'
  payload: {
    accessToken: string,
  }
}

type Action =
  | LoginAction
  | LogoutAction
  | RefreshTokenAction

interface AppState {
  isLoggedIn: boolean,
  accessToken: string,
  refreshToken: string,
  userId?: number,
}

const initialStoreContext: Context = {
  state: {
    isLoggedIn: false,
    accessToken: '',
    refreshToken: '',
    userId: undefined,
  },
  dispatch: (_a: any) => {},
}

const storeContext = createContext(initialStoreContext)

const { Provider } = storeContext

type Props = {
  children: React.ReactNode
}

const STORAGE_KEY = 'ROCKET_MAVEN_REACT_STORE'

// What is the difference between PropsWithChildren and React.ReactNode?
const Store = ({children}: Props) => {
  const storedStore = localStorage.getItem(STORAGE_KEY)
  const savedValues = storedStore ? JSON.parse(storedStore) : null
  const [state, dispatch] = useReducer(Reducer, savedValues || initialStoreContext.state);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  return (
    <Provider value={{state, dispatch}}>
      {children}
    </Provider>
  )
}

export { Store, storeContext }
