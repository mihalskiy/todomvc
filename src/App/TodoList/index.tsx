import React, { ReactElement } from 'react'
import { Routes, Todo, AppState } from '../../index'
import Item from './Item'
import { useAppState } from '@laststance/use-app-state'
import { Container } from './style'

interface Props {
  path: Routes
}

const TodoList: React.FC<Props> = ({ path }) => {
  const [appState] = useAppState<AppState>()

  return (
    <Container>
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          data-cy="toggle-all-btn"
          data-testid="toggle-all-btn"
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list" data-testid="todo-list">
          {appState.todoList
            .filter((t: Todo): boolean => {
              switch (path) {
                case '/todo':
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
        {!appState.todoList &&
          <span>loading...</span>
        }
      </section>
    </Container>
  )
}

export default TodoList
