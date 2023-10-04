import React from 'react';
import {Provider} from "react-redux";
import {AppRootState} from "../app/store";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import {tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolists-Api";
import {appReducer} from "../app/app-reducer";
import thunkMiddleWare from "redux-thunk";

export const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
        {id: 'todolistId2', title: 'What to by', filter: 'all', addedDate: '', order: 0, entityStatus: 'loading'}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(),
                title: 'HTML&CSS',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                completed: false,
                todoListId: 'todolistId1'
            },
            {
                id: v1(),
                title: 'JS',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                completed: false,
                todoListId: 'todolistId1'
            }
        ],
        ['todolistId2']: [
            {
                id: v1(),
                title: 'Milk',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                completed: false,
                todoListId: 'todolistId2'
            },
            {
                id: v1(),
                title: 'React Book',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                completed: false,
                todoListId: 'todolistId2'
            }
        ],
    },
    app: {
        error:null,
        status: 'idle', isInitialized: false},
    auth: {
        isLoggedIn: false
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootState, applyMiddleware(thunkMiddleWare))


const ReduxStorePropviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
};

export default ReduxStorePropviderDecorator;