import React, { createRef } from 'react'
import { Todo, AppState, getTodoListUrl } from '../../index'
import { useAppState } from '@laststance/use-app-state'
import { Container } from './style'

const TodoTextInput: React.FC = () => {
  const [appState, setAppState] = useAppState<AppState>()
  const textInput = createRef<HTMLInputElement>()

  function addTodo(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (textInput.current === null) return
    if (e.key === 'Enter') {
      if (textInput.current.value.trim().length > 0) {
        // make new TODO object
        const todo: Todo = {
          title: textInput.current.value,
          isComplete: false,
        }

        fetch(getTodoListUrl, {
          method: 'POST',
          mode: 'cors',
          redirect: 'follow',
          headers: {
            Authorization: appState.idToken,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(todo),
        })
          .then((r) => r.json())
          .then((todo: Todo) => {
            setAppState({ todoList: [todo, ...appState.todoList] })
          })
          .catch((e) => {
            return e
          })

        textInput.current.value = ''
      }
    }
  }

  return (
    <Container>
      <header className="header">
        <h1>TODO</h1>
        <input
          type="text"
          className="new-todo"
          placeholder="What needs to be done?"
          ref={textInput}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => addTodo(e)}
          autoFocus
          data-cy="new-todo-input-text"
        />
      </header>
    </Container>
  )
}

export default TodoTextInput
