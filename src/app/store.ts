import {applyMiddleware, combineReducers, createStore} from "redux";
import {tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import thunkMiddleWare from "redux-thunk";
import {appReducer} from "./app-reducer";
import {configureStore} from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer
})

export type AppRootState = ReturnType<typeof rootReducer>

// export const store = createStore(rootReducer, applyMiddleware(thunkMiddleWare))

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(
                thunkMiddleWare
            )
})


// @ts-ignore
window.store = store

