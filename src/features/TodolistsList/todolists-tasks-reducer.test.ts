import {asyncActions, ToDoListDomainType} from "./todolists-reducer";
import {TasksStateType} from "./tasks-reducer";
import {tasksReducer, todolistsReducer} from "features/TodolistsList/index";

test('ids should be equals', () => {
    const startTasksState : TasksStateType = {}
    const startTodolistsState : Array<ToDoListDomainType> = []
    const newTodo: ToDoListDomainType = {
        id: 'todolistid3',
        title: "i'm new",
        addedDate: '',
        order: 0,
        filter: 'all',
        entityStatus: 'idle'
    }

    const action = asyncActions.addTodolistTC.fulfilled({todolist: newTodo}, 'requestId', newTodo.title)

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)


})


