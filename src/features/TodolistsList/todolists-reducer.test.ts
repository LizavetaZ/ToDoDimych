import {
    asyncActions, slice,
    FilterValuesType, ToDoListDomainType
} from './todolists-reducer'
import {v1} from 'uuid'
import {RequestStatusType} from "features/Application/application-reducer";
import {ToDoListType} from "api/todolists-Api";

const {fetchTodolistsTC, changeTodolistTitleTC, removeTodolistTC, addTodolistTC} = asyncActions

const {changeTodolistFilter} = slice.actions
const todolistsReducer = slice.reducer

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

    const endState = todolistsReducer(startState, removeTodolistTC.fulfilled({id: todolistId1}, 'requestId', todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    const todolist: ToDoListType = {
        id: 'todolistid3',
        title: 'i new',
        addedDate: '',
        order: 0
    }

    const endState = todolistsReducer(startState, addTodolistTC.fulfilled({todolist}, 'requestId',  todolist.title))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todolist.title)
    expect(endState[0].filter).toBe('all')
    expect(endState[0].id).toBeDefined()
})

test('todolist title should be changed', () => {

    let newTodolistTitle = 'New Todolist'

    let payload = { todolistId: todolistId2, title: newTodolistTitle};
    const action = changeTodolistTitleTC.fulfilled(payload, 'requestId', payload)

    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('todolist filter should be changed', () => {

    let newFilter: FilterValuesType = 'completed'

    const action = changeTodolistFilter({filter: 'completed', id: todolistId2})
    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('all')
    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe('completed')
})

test('todolists should be set to the state', () => {
    let payload = {todolists: startState};
    const action = fetchTodolistsTC.fulfilled(payload, 'requestId', undefined)
    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})

test('correct entity status of todolist should be changed', () => {

    let newStatus: RequestStatusType = 'loading'
    let payload = {todolistId: todolistId2, title: newStatus};
    const endState = todolistsReducer(startState, changeTodolistTitleTC.fulfilled(payload, 'requestId', payload))

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe('idle')
})

