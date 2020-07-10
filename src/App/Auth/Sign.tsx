import React from 'react'
import { apiGetTodoList, AppState } from '../../index'
import { useAppState } from '@laststance/use-app-state'
import { Container, Buttons } from './style'
import { Link, redirectTo, navigate } from '@reach/router'
import Amplify, { Auth } from 'aws-amplify'
import CognitoConfig from '../../CognitoConfig'

Amplify.configure(CognitoConfig)

const Sign: React.FC = () => {
  const [appState, setAppState] = useAppState<AppState>()

  const onChangeHandler = (value: string, name: any): void => {
    const change: any = {}
    change[name] = value
    setAppState(change)
  }
  const onSubmit = (e: any): void => {
    setAppState({
      loading: true,
    })
    e.preventDefault()
    Auth.signIn(appState.email, appState.password)
      .then(async (response: any) => {
        setAppState({
          message: 'Successful',
        })
        const token = response.signInUserSession.idToken.jwtToken
        const todoList = await apiGetTodoList(token)
        setAppState({
          todoList,
          loading: false,
        })
        redirectTo('/todo')
      })
      .catch((response: any): void => {
        if (response.message) {
          setAppState({
            message: response.message,
          })
        }
        if (response && response.uri) {
          navigate(response.uri)
        }
        setAppState({
          loading: false,
        })
      })
  }

  return (
    <Container>
      <form className="header" onSubmit={onSubmit}>
        <h1 className="title">Sign In</h1>
        <input
          type="email"
          value={appState.email}
          className="new-todo"
          placeholder="enter email"
          onChange={(e) => onChangeHandler(e.target.value, 'email')}
          data-cy="new-todo-input-text"
        />
        <br />
        <input
          type="password"
          value={appState.password}
          className="new-todo"
          placeholder="enter password"
          onChange={(e) => onChangeHandler(e.target.value, 'password')}
          data-cy="new-todo-input-text"
        />

        <Buttons>
          <button type="submit" disabled={appState.loading}>{appState.loading ? 'loading...' : 'sign in'}</button>

          <Link data-cy="all-filter" to="/sign_up">
            sign up
          </Link>
        </Buttons>
      </form>

      {appState.message && (
        <>
          <p>{appState.message}</p>
        </>
      )}
    </Container>
  )
}

export default Sign
