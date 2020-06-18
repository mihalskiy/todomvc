import React, { useState, createRef, useEffect } from 'react'
import { AppState, getTodoListUrl, Todo, TodoListType } from '../../../index'
import { useAppState } from '@laststance/use-app-state'
import { Container } from './style'

interface Props {
  todo: Todo
}

interface State {
  onEdit: boolean
}

const Item: React.FC<Props> = ({ todo }) => {
  const [appState, setAppState] = useAppState<AppState>()
  const editInput = createRef<HTMLInputElement>()
  const init: State = { onEdit: false }
  const [state, setState] = useState(init)

  const onDoubleClick = (): void => {
    setState({ onEdit: true })
  }

  const onBlurEdit = (e: React.FocusEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value.trim().length > 0) {
      setState({ onEdit: false })
    } else {
      removeItem(todo.id)
    }
  }

  const submitEditText = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: Todo['id']
  ): void => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      if (e.currentTarget.value.trim().length > 0) {
        fetch(getTodoListUrl + `/${id}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(todo),
        })
          .then((r) => {
            setState({ onEdit: false })
          })
          .catch(() => {
            return
          })
      }
    }
  }

  // Control Todo's CSS based on complex user interaction
  const SwitchStyle = (t: Todo, onEdit: boolean): string => {
    switch (true) {
      case onEdit && t.isComplete:
        return 'completed editing'
      case onEdit && !t.isComplete:
        return 'editing'
      case !onEdit && t.isComplete:
        return 'completed'
      case !onEdit && !t.isComplete:
        return ''

      default:
        return ''
    }
  }

  const reverseCompleted = (id: Todo['id']): void => {
    const toggled: TodoListType = appState.todoList.map((t) => {
      // search clicked item by id...
      if (t.id === id) {
        const updateTodoById = { ...t, isComplete: !t.isComplete }
        fetch(getTodoListUrl + `/${t.id}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateTodoById),
        }).catch(() => {
          return
        })
        return updateTodoById;
        // return other item without any changes
      } else {
        return t
      }
    })

    setAppState({ todoList: toggled })
  }

  const removeItem = (terminate: Todo['id']): void => {
    const removed: TodoListType = appState.todoList.filter(
      (t: Todo): boolean => t.id !== terminate
    )

    fetch(getTodoListUrl + `/${terminate}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    })
      .then((r) => {
        setAppState({ todoList: removed })
      })
      .catch(() => {
        return
      })
  }

  const handleTodoTextEdit = (
    e: React.ChangeEvent<HTMLInputElement>,
    onEdit: Todo['id']
  ): void => {
    const edited = appState.todoList.map(
      (t: Todo): Todo => {
        if (t.id === onEdit) {
          return { ...t, title: e.target.value }
        } else {
          return t
        }
      }
    )

    setAppState({ todoList: edited })
  }

  useEffect(() => {
    // For fucus input element when double clicks text label. fix this https://github.com/laststance/create-react-app-typescript-todo-example-2020/issues/50
    if (state.onEdit && editInput.current !== null) editInput.current.focus()
  }, [editInput, state.onEdit])

  return (
    <Container data-cy="todo-item">
      <li className={SwitchStyle(todo, state.onEdit)} data-testid="todo-item">
        <div className="view" data-testid="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.isComplete}
            onChange={() => reverseCompleted(todo.id)}
            data-cy="todo-item-complete-check"
            data-testid="todo-item-complete-check"
          />
          <label
            onDoubleClick={onDoubleClick}
            data-cy="todo-body-text"
            data-testid="todo-body-text"
          >
            {todo.title}
          </label>
          <button
            className="destroy"
            onClick={() => removeItem(todo.id)}
            data-cy="delete-todo-btn"
            data-testid="delete-todo-btn"
          />
        </div>
        <input
          ref={editInput}
          onBlur={(e) => onBlurEdit(e)}
          className="edit"
          value={todo.title}
          onChange={(e) => handleTodoTextEdit(e, todo.id)}
          onKeyPress={(e) => submitEditText(e, todo.id)}
          data-cy="todo-edit-input"
          data-testid="todo-edit-input"
        />
      </li>
    </Container>
  )
}

export default Item
