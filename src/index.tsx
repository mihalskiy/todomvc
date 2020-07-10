import React from 'react'
import ReactDOM from 'react-dom'
import { navigate, RouteComponentProps, Router } from '@reach/router'
import Provider from '@laststance/use-app-state'
import './index.css'
import * as serviceWorker from './serviceWorker'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import { NotFound } from './NotFound'
import Sign from './App/Auth/Sign'
import SignUp from './App/Auth/SignUp'
import { Auth } from 'aws-amplify'

export const getTodoListUrl = process.env.REACT_APP_URL || 'localhost:3000'

export type Routes =
  | '/'
  | '/active'
  | '/todo'
  | '/completed'
  | '/register'
  | '/sign_in'
  | '/sign_up'

export interface Todo {
  readonly id?: string
  readonly title: string
  readonly isComplete: boolean
}

export type TodoListType = Todo[]

export interface AppState {
  todoList: Todo[]
  email: string
  password: string
  message: string
  idToken: string
  loading: boolean
}

export const apiGetTodoList = (token:string): any => {
  return fetch(getTodoListUrl, {
    method: 'GET',
    mode: 'cors',
    redirect: 'follow',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data: AppState) => data)
    .catch(() => [])
}
Auth.currentSession()
  .then(async (response: any) => {
    const token = response.idToken.jwtToken
    const todoList = await apiGetTodoList(token)
    reactRender(todoList)
  })
  .catch(() => {
    reactRender([])
    navigate('/sign_in')
  })

function reactRender(data: AppState | TodoListType, token?: AppState) {
  ReactDOM.render(
    <ErrorBoundary>
      <Provider appState={{ todoList: data, idToken: token }}>
        <Router>
          <RouterPage path="/sign_in" pageComponent={<Sign />} />
          <RouterPage path="/sign_up" pageComponent={<SignUp />} />
          <RouterPage path="/" pageComponent={<SignUp />} />
          <Controller path="/todo" />
          <Controller path="/active" />
          <Controller path="/completed" />
          <Controller path="/register" />
          <Controller path="/sign_in" />
          <NotFound default />
        </Router>
      </Provider>
    </ErrorBoundary>,
    document.getElementById('root')
  )
}

interface Props {
  path: Routes
}
const Controller: React.FC<Props> = ({ path }) => <App path={path} />
const RouterPage = (
  props: { pageComponent: JSX.Element } & RouteComponentProps
) => props.pageComponent
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
