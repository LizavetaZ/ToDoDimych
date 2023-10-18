import {slice as todolistsSlice, asyncActions as todolistsAsyncActions} from './todolists-reducer'
import { TodolistsList } from "./TodolistsList";
import {slice as taskSlice, asyncActions as tasksAsyncActions} from './tasks-reducer'

const todolistsActions = {
    ...todolistsAsyncActions, ...todolistsSlice.actions
}

const tasksActions = {
    ...tasksAsyncActions,
    ...taskSlice.actions
}
const todolistsReducer = todolistsSlice.reducer

const tasksReducer = taskSlice.reducer

export {
    tasksActions,
    todolistsActions,
    TodolistsList,
    todolistsReducer,
    tasksReducer
}