import React from 'react'
import { AppState } from '../../index'
import { useAppState } from '@laststance/use-app-state'
import { Container, Buttons } from './style'
import { Link, navigate } from '@reach/router'
import Amplify, { Auth } from 'aws-amplify'
import CognitoConfig from '../../CognitoConfig'
Amplify.configure(CognitoConfig)

const SignUp: React.FC = () => {
  const [appState, setAppState] = useAppState<AppState>()

  const onChangeHandler = (value: string, name: any): void => {
    const change: any = {}
    change[name] = value
    setAppState(change)
  }

  const onSubmit = (e: any): void => {
    e.preventDefault()
    if (!appState.email && !appState.password) return
    setAppState({
      loading: true,
    })
    Auth.signUp({
      username: appState.email,
      password: appState.password,
      attributes: {
        email: appState.email,
      },
    })
      .then((response: any) => {
        const message: string = response.userConfirmed
          ? 'Successful'
          : 'check email for confirm'
        setAppState({
          message,
          loading: false,
        })
        navigate('/sign_in')
      })
      .catch((response: any) => {
        if (response.message) {
          setAppState({
            message: response.message,
          })
        }
        setAppState({
          loading: false,
        })
      })
  }

  return (
    <Container>
      <form className="header" onSubmit={onSubmit}>
        <h1 className="title">Sign Up</h1>
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
          <button type="submit" disabled={appState.loading}>{appState.loading ? 'loading...' : 'sign up'}</button>

          <Link data-cy="all-filter" to="/sign_in">
            sign in
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

export default SignUp
