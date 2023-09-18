import {
    addTodolistAC,
    changeTotodlistTitleAC,
    FilterValuesType, setTodolistsAC,
    ToDoListDomainType,
    todolistsReducer
} from './todolists-reducer'
import {v1} from 'uuid'
let todolistId1 : string
let todolistId2 : string
let startState: Array<ToDoListDomainType> = []


beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()

   startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}
    ]
})


test('correct todolist should be removed', () => {

    const endState = todolistsReducer(startState, {type: 'REMOVE-TODOLIST', id: todolistId1})

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    const newTodo: ToDoListDomainType = {
        id: 'todolistid3',
        title: "i'm new",
        addedDate: '',
        order: 0,
        filter: 'all'
    }

    const endState = todolistsReducer(startState, addTodolistAC(newTodo))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodo.title)
    expect(endState[0].filter).toBe('all')
    expect(endState[0].id).toBeDefined()
})

test('todolist title should be changed', () => {

    let newTodolistTitle = 'New Todolist'

    const action = changeTotodlistTitleAC(todolistId2, newTodolistTitle)

    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('todolist filter should be changed', () => {

    let newFilter: FilterValuesType = 'completed'

    const action = {
        type: 'CHANGE-TODOLIST-FILTER' as const,
        filter: newFilter,
        id: todolistId2

    }
    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('all')
    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe('completed')
})

test('todolists should be set to the state', () => {
    const action = setTodolistsAC(startState)
    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})

