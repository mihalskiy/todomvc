import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from '@reach/router'
import Provider from '@laststance/use-app-state'
import './index.css'
import * as serviceWorker from './serviceWorker'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import { NotFound } from './NotFound'

export type Routes = '/' | '/active' | '/completed'

export interface Todo {
  readonly id?: string
  readonly title: string
  readonly isComplete: boolean
}

export type TodoListType = Todo[]

export interface AppState {
  todoList: Todo[]
}
export const getTodoListUrl = process.env.REACT_APP_URL || 'localhost:3000'

function reactRender(data: AppState | TodoListType) {
  ReactDOM.render(
    <ErrorBoundary>
      <Provider appState={{ todoList: data }}>
        <Router>
          <Controller path="/" />
          <Controller path="/active" />
          <Controller path="/completed" />
          <NotFound default />
        </Router>
      </Provider>
    </ErrorBoundary>,
    document.getElementById('root')
  )
}
fetch(getTodoListUrl, {
  method: 'GET',
  mode: 'cors',
  redirect: 'follow',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then((response) => {
    return response.json()
  })
  .then((data: AppState) => {
    reactRender(data)
  })
  .catch(() => {
    reactRender([])
  })

interface Props {
  path: Routes
}
const Controller: React.FC<Props> = ({ path }) => <App path={path} />

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
