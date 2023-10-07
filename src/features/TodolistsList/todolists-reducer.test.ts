import {
    addTodolistAC, changeTotodlistFilterAC,
    changeTotodlistTitleAC,
    FilterValuesType, removeTodolistAC, setTodolistsAC,
    ToDoListDomainType,
    todolistsReducer
} from './todolists-reducer'
import {v1} from 'uuid'
import {RequestStatusType} from "../../app/app-reducer";
import {ToDoListType} from "../../api/todolists-Api";
let todolistId1 : string
let todolistId2 : string
let startState: Array<ToDoListDomainType> = []


beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()

   startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'}
    ]
})


test('correct todolist should be removed', () => {

    const endState = todolistsReducer(startState, removeTodolistAC({id: todolistId1}))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    const newTodo: ToDoListType = {
        id: 'todolistid3',
        title: "i'm new",
        addedDate: '',
        order: 0
    }

    const endState = todolistsReducer(startState, addTodolistAC({todolist: newTodo}))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodo.title)
    expect(endState[0].filter).toBe('all')
    expect(endState[0].id).toBeDefined()
})

test('todolist title should be changed', () => {

    let newTodolistTitle = 'New Todolist'

    const action = changeTotodlistTitleAC({id: todolistId2, title: newTodolistTitle})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('todolist filter should be changed', () => {

    let newFilter: FilterValuesType = 'completed'

    const action = changeTotodlistFilterAC({filter: 'completed', id: todolistId2})
    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('all')
    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe('completed')
})

test('todolists should be set to the state', () => {
    const action = setTodolistsAC({todolists: startState})
    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})

test('correct entity status of todolist should be changed', () => {

    let newStatus: RequestStatusType = 'loading'
    const endState = todolistsReducer(startState, changeTotodlistTitleAC({id: todolistId2, title: newStatus}))

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe('idle')
})

