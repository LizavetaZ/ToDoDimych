import React from 'react';
import {Provider} from "react-redux";
import {AppRootState, RootReducerType} from "../app/store";
import {combineReducers} from "redux";
import {FilterValuesType, todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import {tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolists-Api";
import {appReducer} from "../app/app-reducer";
import thunkMiddleWare from "redux-thunk";

import {authReducer} from "features/Auth/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {HashRouter} from "react-router-dom";

export const rootReducer:RootReducerType = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all' as FilterValuesType, addedDate: '', order: 0, entityStatus: 'idle'},
        {id: 'todolistId2', title: 'What to by', filter: 'all' as FilterValuesType, addedDate: '', order: 0, entityStatus: 'loading'}
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
        status: 'succeeded', isInitialized: true},
    auth: {
        isLoggedIn: false
    }
}

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware:  (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(
                thunkMiddleWare
            )
})


export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
};

export const BrowserDecorator = (storyFn: any) => {
    return <HashRouter>{storyFn()}</HashRouter>
};
