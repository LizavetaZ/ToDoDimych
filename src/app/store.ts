import {AnyAction, applyMiddleware, combineReducers, createStore} from "redux";
import {tasksReducer} from "../features/TodolistsList/tasks-reducer";
import {todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import thunkMiddleWare, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {appReducer} from "./app-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "../features/TodolistsList/auth-reducer";
import {useDispatch, TypedUseSelectorHook, useSelector} from "react-redux";

export const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
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

export type ThunkType = ThunkAction<void,AppRootState,unknown,AnyAction>
export type DispatchType = ThunkDispatch<AppRootState, any, AnyAction>
export const useAppDispatch = () =>  useDispatch<DispatchType>()
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector

// @ts-ignore
window.store = store

