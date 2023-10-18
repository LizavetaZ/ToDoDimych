import {AnyAction, combineReducers} from "redux";
import {tasksReducer, todolistsReducer} from "features/TodolistsList";
import thunkMiddleWare, {ThunkAction} from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "features/Auth";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {FieldErrorType} from "api/todolists-Api";
import {appReducer} from "features/Application";

export const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})


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
