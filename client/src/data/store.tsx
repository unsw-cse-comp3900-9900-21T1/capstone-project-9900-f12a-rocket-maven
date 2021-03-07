import React, {Dispatch, createContext, useReducer, PropsWithChildren} from "react";
import Reducer from './reducer'

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
}

interface LogoutAction {
  type: 'LOGIN'
}

type Action =
  | LoginAction
  | LogoutAction

interface AppState {
  isLoggedIn: boolean,
}

const initialStoreContext: Context = {
  state: {
    isLoggedIn: false,
  },
  dispatch: (_a: any) => {},
}

const storeContext = createContext(initialStoreContext)

const { Provider } = storeContext

type Props = {
  children: React.ReactNode
}

// What is the difference between PropsWithChildren and React.ReactNode?
const Store = ({children}: Props) => {
  const [state, dispatch] = useReducer(Reducer, initialStoreContext.state);
  return (
    <Provider value={{state, dispatch}}>
      {children}
    </Provider>
  )
}

export { Store, storeContext }
