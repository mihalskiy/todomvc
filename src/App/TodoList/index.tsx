import React, { ReactElement } from 'react'
import { Routes, Todo, AppState } from '../../index'
import Item from './Item'
import { useAppState } from '@laststance/use-app-state'
import { Container } from './style'

interface Props {
  path: Routes
}

const TodoList: React.FC<Props> = ({ path }) => {
  const [appState, setAppState] = useAppState<AppState>()

  function toggleAllCheckbox(e: React.ChangeEvent<HTMLInputElement>): void {
    setAppState({
      todoList: {"todoList":[{"id":"Q5BOuGrfiI3w","bodyText":"mwfw,","isComplete":false},{"id":"tUxiVD4X3iZ9","bodyText":"fdg","isComplete":true}]},
    })
  }

  return (
    <Container>
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={toggleAllCheckbox}
          data-cy="toggle-all-btn"
          data-testid="toggle-all-btn"
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list" data-testid="todo-list">
          {appState.todoList
            .filter((t: Todo): boolean => {
              switch (path) {
                case '/':
                  return true
                case '/active':
                  return !t.isComplete
                case '/completed':
                  return t.isComplete
                default:
                  return true
              }
            })
            .map(
              (t: Todo): ReactElement => {
                return <Item key={t.id} todo={t} />
              }
            )}
        </ul>
      </section>
    </Container>
  )
}

export default TodoList
